import {BackHandler, SafeAreaView, ScrollView, StyleSheet, Text} from 'react-native';
import * as React from 'react';
import {useEffect} from 'react';
import Header from './components/Header';
import {colors} from './utils/constants';
import {useNavigation} from '@react-navigation/native';
import remoteConfig, { FirebaseRemoteConfigTypes } from '@react-native-firebase/remote-config';

export const Home: React.FC = () => {
  const navigation = useNavigation();
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBack);
    };
  }, []);
  const handleBack = () => {
    BackHandler.exitApp();
    return true;
  };

  const parameters = remoteConfig().getAll();
  return (
    <SafeAreaView style={styles.homeContainer}>
      <Header
        leftIconName={'person-circle-outline'}
        onPressLeftIcon={() => navigation.navigate('Profile')}
      />
      <ScrollView>
        <Text style={{color:colors.WHITE}}>{parameters?.DEMO_KEY?.asString()}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: colors.APP_COLOR,
  },
});
