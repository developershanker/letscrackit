import {Home} from './Home';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Profile} from './Profile';
import * as React from 'react';
import {colors} from './utils/constants';
import DynamicIcon from './icons/iconsList';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Discover } from './Discover';
import { Explore } from './Explore';

export const TabBar: React.FC = () => {
  const Tab = createBottomTabNavigator();
  const activeColor = colors.LIGHT_YELLOW;
  const inActiveColor = colors.WHITE;
  const MyTabBar = ({state, descriptors, navigation}) => {
    const insets = useSafeAreaInsets();
    return (
      <View style={styles.tabBarContainer(insets)}>
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
                backgroundColor: colors.MIDNIGHT_NAVY,
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
        tabBarActiveTintColor: colors.MIDNIGHT_NAVY,
        tabBarStyle: {
          backgroundColor: colors.LIGHT_YELLOW,
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
        name="Explore"
        component={Explore}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({color, size}) => (
            <DynamicIcon name="play-circle-outline" color={color} size={size} />
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


const styles = StyleSheet.create({
  tabBarContainer:(insets: any)=> ({
    flexDirection: 'row', 
    paddingBottom: insets.bottom,
    backgroundColor: colors.MIDNIGHT_NAVY
  })
})