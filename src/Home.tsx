import {
  BackHandler,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import * as React from 'react';
import {useEffect, useState} from 'react';
import Header from './components/Header';
import {colors} from './utils/constants';
import {useNavigation} from '@react-navigation/native';
import {firebaseRemoteConfigData} from './utils/helpers';

export const Home: React.FC = () => {
  const navigation = useNavigation();
  const [heading, setheading] = useState('');
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
  const getData = async () => {
    const headingText = await firebaseRemoteConfigData('DEMO_KEY', 'asString');
    setheading(headingText);
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView style={styles.homeContainer}>
      <Header
        leftIconName={'person-circle-outline'}
        onPressLeftIcon={() => navigation.navigate('Profile')}
      />
      <ScrollView>
        <Text style={{color: colors.WHITE}}>{heading}</Text>
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
