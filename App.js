import React, {useEffect} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SplashScreen} from './src/SplashScreen';
import {TabBar} from './src/TabBar';
import {Home} from './src/Home';
import {Discover} from './src/Discover';
import {Profile} from './src/Profile';
import {initiateFirebaseConfig} from './src/utils/helpers';

const App = () => {
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
    });
  }, []);
  const Stack = createStackNavigator();
  return (
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
