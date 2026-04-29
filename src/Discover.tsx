import {BackHandler, ScrollView, StyleSheet, View} from 'react-native';
import * as React from 'react';
import {useEffect} from 'react';
import {colors} from './utils/constants';
import {useNavigation} from '@react-navigation/native';
import Header from './components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Discover: React.FC = () => {
  const navigation = useNavigation();
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
  'hardwareBackPress',
  handleBack
);

return () => subscription.remove();
  }, []);
  const handleBack = () => {
    navigation.goBack();
    return true;
  };
  return (
    <SafeAreaView style={styles.homeContainer}>
      <Header
        leftIconName={'chevron-back-outline'}
        leftIconSize={25}
        onPressLeftIcon={handleBack}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: colors.APP_COLOR,
  },
});
