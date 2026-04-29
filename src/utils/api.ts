import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const signInWithGoogle = async () => {
  try {
    console.log('🚀 1. Checking Play Services...');
    await GoogleSignin.hasPlayServices();

    console.log('🚀 2. Signing in...');
    const response = await GoogleSignin.signIn();
    console.log('✅ Google Sign-in response:', response);

    if (response.type !== 'success') throw new Error(`Sign-in not completed: ${response.type}`);
    const idToken = response.data?.idToken;
    if (!idToken) throw new Error('Missing idToken in Google response');

    console.log('🚀 3. Creating Google credential...');
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    console.log('🚀 4. Signing in with credential...');
    const userCredential = await auth().signInWithCredential(googleCredential);
    const user = userCredential?.user;
    if (!user) throw new Error('Firebase Auth failed: No user returned');

    console.log('🚀 5. Writing to Firestore...');
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
        console.error('❌ Firestore write failed:', err);
      });

    console.log('✅ Firebase User:', JSON.stringify(user, null, 2));
    return user;
  } catch (error) {
    console.error('❌ Google Sign-In failed:', error);
    throw error;
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

  const snapshot = await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('bmiHistory')
    .orderBy('createdAt', 'desc') // newest first
    .get();

  return snapshot.docs.map(doc => {
    const data = doc.data();
    const heightM = data.height / 100;
    const bmi = data.weight / (heightM * heightM);

    return {
      id: doc.id,
      weight: data.weight,
      height: data.height,
      createdAt: data.createdAt?.toDate(),
      bmi: parseFloat(bmi.toFixed(1)),
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
  console.log('emailLink', emailLink)
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


export const deleteAccount = async (): Promise<void> => {
  const currentUser = auth().currentUser;
  if (!currentUser) throw new Error('No user logged in');

  const uid = currentUser.uid;

  // Delete bmiHistory subcollection
  const bmiSnap = await firestore()
    .collection('users')
    .doc(uid)
    .collection('bmiHistory')
    .get();

  const batch = firestore().batch();
  bmiSnap.docs.forEach(doc => batch.delete(doc.ref));
  await batch.commit();

  // Delete user document
  await firestore().collection('users').doc(uid).delete();

  // Delete Firebase Auth account
  await currentUser.delete();
};