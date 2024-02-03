import {Home} from './Home';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Profile} from './Profile';
import {Discover} from './Discover';
import * as React from 'react';
import {colors} from './utils/constants';
import DynamicIcon from './icons/iconsList';
import {TouchableOpacity, View} from 'react-native';

export const TabBar: React.FC = () => {
  const Tab = createBottomTabNavigator();
  const activeColor = colors.LIGHT_YELLOW;
  const inActiveColor = colors.WHITE;
  const MyTabBar = ({state, descriptors, navigation}) => {
    return (
      <View style={{flexDirection: 'row'}}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              activeOpacity={0.5}
              style={{
                flex: 1,
                backgroundColor: colors.APP_COLOR,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {options.tabBarIcon({
                color: isFocused ? activeColor : inActiveColor,
                size: 24,
              })}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  return (
    <Tab.Navigator
      tabBar={props => <MyTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: colors.DARK_GREY,
        tabBarActiveTintColor: colors.APP_COLOR,
        tabBarStyle: {
          backgroundColor: colors.LIGHT_YELLOW,
          position: 'absolute',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <DynamicIcon name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Discover"
        component={Discover}
        options={{
          tabBarLabel: 'Discover',
          tabBarIcon: ({color, size}) => (
            <DynamicIcon name="disc-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <DynamicIcon name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
