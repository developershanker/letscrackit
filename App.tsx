import React, {useEffect} from 'react';
import {Linking, StatusBar} from 'react-native';
import {createNavigationContainerRef, NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import {store, persistor} from './src/store';
import {SplashScreen} from './src/SplashScreen';
import {TabBar} from './src/TabBar';
import {Home} from './src/Home';
import {Discover} from './src/Discover';
import {Profile} from './src/Profile';
import {Login} from './src/Login';
import {AddDetails} from './src/AddDetails';
import {PhoneAuth} from './src/PhoneAuth';
import {OtpVerification} from './src/OtpVerification';
import {initiateFirebaseConfig, reportError} from './src/utils/helpers';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {EmailAuth} from './src/EmailAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { completeEmailSignIn, getBMIHistory } from './src/utils/api';
import { setUserData, setUserPhysicalData } from './src/store/slices/userSlice';


export const navigationRef = createNavigationContainerRef<RootStackParamList>();
export type RootStackParamList = {
  SplashScreen: undefined;
  Home: undefined;
  Profile: undefined;
  Discover: undefined;
  TabBar: undefined;
  Login: undefined;
  AddDetails: undefined;
  PhoneAuth: undefined;
  OtpVerification: {
    confirmation: FirebaseAuthTypes.ConfirmationResult;
    phoneNumber: string;
  };
  EmailAuth: undefined
};

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId:
        '113606866455-6b3rliisuocgf2culi18bp5u7cg85331.apps.googleusercontent.com',
      offlineAccess: true,
    });
  };
  const handleEmailLink = async (url: string) => {
  try {
    const email = await AsyncStorage.getItem('emailForSignIn');
    if (!email) return;
    const user = await completeEmailSignIn(email, url);
    store.dispatch(setUserData(user));
    const physicalData = await getBMIHistory();
    store.dispatch(setUserPhysicalData(physicalData));
    await AsyncStorage.removeItem('emailForSignIn');

    // Navigate after sign-in is complete
    if (navigationRef.isReady()) {
      navigationRef.navigate('TabBar');
    }
  } catch (error) {
    reportError(error, "handleEmailLink_App.tsx")
  }
 };

  const fetchFirebaseRemoteConfigValues = async () => {
    try {
      await initiateFirebaseConfig();
    } catch (error) {
      reportError(error, "fetchFirebaseRemoteConfigValues_App.tsx")
    }
  };

  useEffect(() => {
    configureGoogleSignIn();
    Linking.getInitialURL().then(url => { if (url) handleEmailLink(url); });
    const sub = Linking.addEventListener('url', ({ url }) => handleEmailLink(url));

    fetchFirebaseRemoteConfigValues().finally();
   return () => sub.remove();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{flex: 1}}>
          <SafeAreaProvider>
            <NavigationContainer ref={navigationRef}>
              <StatusBar barStyle="light-content" />
              <Stack.Navigator
                screenOptions={{
                  headerShown: false,
                }}
                initialRouteName="SplashScreen">
                <Stack.Screen name="SplashScreen" component={SplashScreen} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Profile" component={Profile} />
                <Stack.Screen name="Discover" component={Discover} />
                <Stack.Screen name="TabBar" component={TabBar} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="AddDetails" component={AddDetails} />
                <Stack.Screen name="PhoneAuth" component={PhoneAuth} />
                <Stack.Screen name="OtpVerification" component={OtpVerification} />
                <Stack.Screen name="EmailAuth" component={EmailAuth} />
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}

export default App;
