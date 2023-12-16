import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect } from 'react'
import { colors, fontsNames } from './utils/constants';

const {width, height} = Dimensions.get('window');
export const SplashScreen = ({navigation, route}) => {
  useEffect(() => {
    const setTimer = setTimeout(() => {
      navigation.navigate('Home')
    }, 2000);
    return () => clearTimeout(setTimer);
  }, []);
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <View
          style={{
            height: height - 100,
            width: width,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require('./icons/logo-transparent-png.png')}
            style={{width: 150, height: 150}}
          />
        </View>
        <ActivityIndicator size={'large'} color={colors.LIGHT_YELLOW} />
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
    backgroundColor: colors.WHITE,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  testStyles: {
    fontSize: 100,
    fontFamily: fontsNames.SHORTBABY,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});