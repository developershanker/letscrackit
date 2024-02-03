import {BackHandler, ScrollView, StyleSheet, View} from 'react-native';
import * as React from 'react';
import {useEffect} from 'react';
import {colors} from './utils/constants';
import {useNavigation} from '@react-navigation/native';

export const Profile: React.FC = () => {
  const navigation = useNavigation();
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBack);
    };
  }, []);
  const handleBack = () => {
    navigation.goBack();
    return true;
  };
  return (
    <ScrollView style={styles.homeContainer}>
      <View></View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: colors.APP_COLOR,
  },
});
