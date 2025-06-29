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
import {colors, fonts} from './utils/constants';
import {useNavigation} from '@react-navigation/native';
import {firebaseRemoteConfigData} from './utils/helpers';
import { useSelector } from 'react-redux';
import { selectUserData } from './store/selectors/userSelectors';

export const Home: React.FC = () => {
  const navigation = useNavigation();
  const [heading, setHeading] = useState('');
  const [subHeading, setSubHeading] = useState('');
  const userData: any = useSelector(selectUserData);
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
    const headingText = await firebaseRemoteConfigData('DEMO_KEY');
    setHeading(headingText?.heading?.replace('{{user}}', userData?.displayName));
    setSubHeading(headingText?.subHeading)
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
        <Text style={styles.headingText}>{heading}</Text>
        <Text style={styles.headingText}>{subHeading}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: colors.APP_COLOR,
  },
  headingText: { 
      ...fonts.PoppinsBold(20), color: colors.WHITE, textAlign: 'center', width: '86%', alignSelf: 'center'}
});
