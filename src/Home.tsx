import {BackHandler, SafeAreaView, StyleSheet, Text} from 'react-native';
import * as React from 'react';
import {useEffect} from 'react';
import Header from './components/Header';
import {colors} from './utils/constants';

export const Home = ({navigation, route}) => {
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

  return (
    <SafeAreaView style={styles.homeContainer}>
      <Header />
      <Text>Home Page</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: colors.APP_COLOR,
  },
});
