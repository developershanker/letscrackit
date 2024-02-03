import {BackHandler, ScrollView, StyleSheet, View} from 'react-native';
import * as React from 'react';
import {useEffect} from 'react';
import {colors} from './utils/constants';
import {useNavigation} from '@react-navigation/native';
import Header from './components/Header';

export const Discover: React.FC = () => {
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
      <Header
        leftIconName={'chevron-back-outline'}
        leftIconSize={25}
        onPressLeftIcon={handleBack}
      />
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
