import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors, fonts} from './utils/constants';
import {useSelector} from 'react-redux';
import {selectUserData} from './store/selectors/userSelectors';
import { SafeAreaView } from 'react-native-safe-area-context';

const {width, height} = Dimensions.get('window');

export const SplashScreen = ({navigation}) => {
  const userData: any = useSelector(selectUserData);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    // Show animation first
    const showTimer = setTimeout(() => {
      setShowLoading(true);
    }, 1000); // 1s for branding/logo

    // Navigate based on login state
    const navTimer = setTimeout(() => {
      if (userData) {
        navigation.replace('TabBar'); // 🔁 replace so Splash is removed from stack
      } else {
        navigation.replace('Login'); // 👈 or whatever your login screen is
      }
    }, 2000); // total wait = 2s

    return () => {
      clearTimeout(showTimer);
      clearTimeout(navTimer);
    };
  }, [userData, navigation]);

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
            <Text style={styles.nameStyles}>Let's Crack It</Text>
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
});
