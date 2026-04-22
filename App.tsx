import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from './src/store';
import { Home } from './src/Home';
import { Profile } from './src/Profile';

// Types
export type TabParamList = {
  Home: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar barStyle="light-content" />

            <Tab.Navigator
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#121212',
                },
                headerTintColor: '#ffffff',
                tabBarActiveTintColor: '#ffffff',
                tabBarStyle: {
                  backgroundColor: '#121212',
                },
              }}
            >
              <Tab.Screen name="Home" component={Home} />
              <Tab.Screen name="Profile" component={Profile} />
            </Tab.Navigator>

          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;