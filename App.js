import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SplashScreen } from './src/SplashScreen';
import { TabBar } from './src/TabBar';
import { Home } from './src/Home';
import { Discover } from './src/Discover';
import { Profile } from './src/Profile';
import { Login } from './src/Login';
import { AddDetails } from './src/AddDetails';
import { initiateFirebaseConfig } from './src/utils/helpers';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// 🆕 Redux Imports
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';

const App = () => {
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
    fetchFirebaseRemoteConfigValues().finally(() => {
      console.log('fetched everything');
      configureGoogleSignIn();
    });
  }, []);

  const Stack = createStackNavigator();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
            initialRouteName={'SplashScreen'}>
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Discover" component={Discover} />
            <Stack.Screen name="TabBar" component={TabBar} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="AddDetails" component={AddDetails} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
