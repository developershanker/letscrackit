import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { reportError, getBMIInfo, calcAgeAwareBMI } from './helpers';

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    if (response.type !== 'success') {
      reportError(`Sign-in not completed: ${response.type}`, "signInWithGoogle_api.ts")
      return;
    };
    const idToken = response.data?.idToken;
    if (!idToken) {
      reportError("Missing idToken in Google response", "signInWithGoogle_api.ts")
      return;
    };
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const userCredential = await auth().signInWithCredential(googleCredential);
    const user = userCredential?.user;
    if (!user) {
      reportError('Firebase Auth failed: No user returned', "signInWithGoogle_api.tsx")
      return;
    };
    const { uid, email, displayName, photoURL } = user;

    await firestore()
      .collection('users')
      .doc(uid)
      .set(
        {
          email,
          displayName,
          photoURL,
        },
        { merge: true }
      )
      .then(() => {
        console.log('✅ Firestore write successful');
      })
      .catch((err) => {
        reportError(err, "signInWithGoogle_api.ts")
      });
    return user;
  } catch (error) {
    reportError(`Google Sign-In failed: ${error}`, "signInWithGoogle_api.ts")
  }
};

export const addBMIEntry = async (weightKg: number, heightCm: number) => {
  const user = auth().currentUser;
  if (!user) throw new Error("Not authenticated");

  const bmiRef = firestore()
    .collection('users')
    .doc(user.uid)
    .collection('bmiHistory');

  await bmiRef.add({
    weight: weightKg,
    height: heightCm,
    createdAt: firestore.FieldValue.serverTimestamp()
  });
};

export const getBMIHistory = async () => {
  const user = auth().currentUser;
  if (!user) throw new Error("Not authenticated");

  const [userDoc, snapshot] = await Promise.all([
    firestore().collection('users').doc(user.uid).get(),
    firestore()
      .collection('users')
      .doc(user.uid)
      .collection('bmiHistory')
      .orderBy('createdAt', 'desc')
      .get(),
  ]);

  const { dob, sex } = userDoc.data() ?? {};

  return snapshot.docs.map(doc => {
    const data = doc.data();
    const heightM = data.height / 100;
    const bmi = parseFloat((data.weight / (heightM * heightM)).toFixed(1));
    const entryDate: Date = data.createdAt?.toDate() ?? new Date();

    const ageAware = (dob && sex)
      ? calcAgeAwareBMI(bmi, dob, entryDate, sex as 'male' | 'female')
      : null;

    const fallback = getBMIInfo(bmi);

    return {
      id: doc.id,
      weight: data.weight,
      height: data.height,
      createdAt: entryDate,
      bmi,
      method:   ageAware?.method   ?? 'simple',
      metric:   ageAware?.metric   ?? null,
      category: ageAware?.category ?? fallback.category,
      color:    ageAware?.color    ?? fallback.color,
    };
  });
};

export const sendPhoneOtp = async (
  phoneNumber: string
): Promise<FirebaseAuthTypes.ConfirmationResult> => {
  return await auth().signInWithPhoneNumber(phoneNumber);
};

export const verifyPhoneOtp = async (
  confirmation: FirebaseAuthTypes.ConfirmationResult,
  otp: string
) => {
  const userCredential = await confirmation.confirm(otp);
  const user = userCredential?.user;
  if (!user) throw new Error('Phone verification failed: No user returned');

  const { uid, phoneNumber } = user;
  await firestore()
    .collection('users')
    .doc(uid)
    .set({ phoneNumber }, { merge: true });

  return user;
};

// export const signInWithEmailLink = async (email: string, emailLink: string) => {
//   const userCredential = await auth().signInWithEmailLink(email, emailLink);
//   const user = userCredential?.user;
//   if (!user) throw new Error('Email sign-in failed');

//   const { uid, displayName, photoURL } = user;
//   await firestore()
//     .collection('users')
//     .doc(uid)
//     .set({ email, displayName, photoURL }, { merge: true });

//   return user;
// };

export const sendEmailLink = async (email: string) => {
  const actionCodeSettings = {
    handleCodeInApp: true,
    url: 'https://letscrackit-dacc9.web.app', // replace with your Firebase Hosting URL
    android: {
      packageName: 'com.letscrackit',
      installApp: true,
    },
    iOS: {
      bundleId: 'com.letscrackit',
    },
  };
  await auth().sendSignInLinkToEmail(email, actionCodeSettings);
};

export const completeEmailSignIn = async (email: string, emailLink: string) => {
  if (!auth().isSignInWithEmailLink(emailLink)) {
    throw new Error('Invalid sign-in link');
  }
  const userCredential = await auth().signInWithEmailLink(email, emailLink);
  const user = userCredential?.user;
  if (!user) throw new Error('Sign in failed');

  await firestore()
    .collection('users')
    .doc(user.uid)
    .set({ email }, { merge: true });

  return user;
};


export const fetchUserProfile = async (uid: string) => {
  const doc = await firestore().collection('users').doc(uid).get();
  const data = doc.data();
  return {
    profileComplete: data?.profileComplete ?? false,
    dob: data?.dob ?? null,
    sex: data?.sex ?? null,
  };
};

export const saveUserProfile = async (dob: string, sex: 'male' | 'female') => {
  const user = auth().currentUser;
  if (!user) throw new Error('Not authenticated');
  await firestore()
    .collection('users')
    .doc(user.uid)
    .set({ dob, sex, profileComplete: true }, { merge: true });
};

export const deleteAccount = async (): Promise<void> => {
  const currentUser = auth().currentUser;
  if (!currentUser) throw new Error('No user logged in');

  const isGoogleUser = currentUser.providerData?.some(p => p.providerId === 'google.com');

  if (isGoogleUser) {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    if (response.type !== 'success' || !response.data?.idToken) {
      throw new Error('Google re-authentication cancelled');
    }
    const credential = auth.GoogleAuthProvider.credential(response.data.idToken);
    await currentUser.reauthenticateWithCredential(credential);
  }

  const uid = currentUser.uid;

  const bmiSnap = await firestore()
    .collection('users')
    .doc(uid)
    .collection('bmiHistory')
    .get();

  const batch = firestore().batch();
  bmiSnap.docs.forEach(doc => batch.delete(doc.ref));
  await batch.commit();

  await firestore().collection('users').doc(uid).delete();
  await currentUser.delete();
};