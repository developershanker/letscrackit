import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
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
import {initiateFirebaseConfig} from './src/utils/helpers';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

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

  const fetchFirebaseRemoteConfigValues = async () => {
    try {
      await initiateFirebaseConfig();
    } catch (error) {
      console.log('error fetchFirebaseRemoteConfigValues', error);
    }
  };

  useEffect(() => {
    configureGoogleSignIn();
    fetchFirebaseRemoteConfigValues().finally(() => {
      console.log('fetched everything');
    });
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{flex: 1}}>
          <SafeAreaProvider>
            <NavigationContainer>
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
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}

export default App;
