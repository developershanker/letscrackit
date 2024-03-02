import {
  ActivityIndicator,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {colors, fonts} from './utils/constants';
const {width, height} = Dimensions.get('window');

export const SplashScreen = ({navigation}) => {
  const [showLoading, setShowLoading] = useState(false);
  useEffect(() => {
    const setTimer = setTimeout(() => {
      setShowLoading(true);
    }, 2000);
    return () => clearTimeout(setTimer);
  }, []);

  useEffect(() => {
    const setTimer2 = setTimeout(() => {
      navigation.navigate('TabBar');
    }, 4000);
    return () => clearTimeout(setTimer2);
  }, []);
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.logoView}>
          {!showLoading ? (
            <Image
              source={require('./icons/logo-transparent2.png')}
              style={{width: 200, height: 200}}
            />
          ) : (
            <Text style={styles.nameStyles}>Lets Crack It</Text>
          )}
        </View>
        {showLoading ? (
          <ActivityIndicator size={'large'} color={colors.WHITE} />
        ) : null}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
    backgroundColor: colors.APP_COLOR,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  logoView: {
    height: height - 100,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameStyles: {
    ...fonts.PoppinsSemiBold(20),
    color: colors.WHITE,
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
