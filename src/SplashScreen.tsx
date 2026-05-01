import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { selectUserData } from './store/selectors/userSelectors';
import { colors, fonts } from './utils/constants';

const { height } = Dimensions.get('window');

export const SplashScreen = ({ navigation }) => {
  const userData: any = useSelector(selectUserData);

  const logoScale   = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const nameY       = useRef(new Animated.Value(24)).current;
  const nameOpacity = useRef(new Animated.Value(0)).current;
  const tagOpacity  = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const dot1        = useRef(new Animated.Value(0.2)).current;
  const dot2        = useRef(new Animated.Value(0.2)).current;
  const dot3        = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(glowOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.spring(logoScale,   { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(nameOpacity, { toValue: 1, duration: 380, useNativeDriver: true }),
        Animated.timing(nameY,       { toValue: 0, duration: 380, useNativeDriver: true }),
      ]),
      Animated.timing(tagOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();

    const pulseDot = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1,   duration: 380, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.2, duration: 380, useNativeDriver: true }),
        ])
      ).start();

    pulseDot(dot1, 0);
    pulseDot(dot2, 180);
    pulseDot(dot3, 360);

    const nav = setTimeout(() => {
      navigation.replace(userData ? 'TabBar' : 'Login');
    }, 10000);

    return () => clearTimeout(nav);
  }, []);

  return (
    <View style={styles.container}>

      <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />

      <View style={styles.center}>
        <Animated.Image
          source={require('./icons/logo-transparent2.png')}
          style={[styles.logo, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}
          resizeMode="contain"
        />

        <Animated.Text
          style={[styles.appName, { opacity: nameOpacity, transform: [{ translateY: nameY }] }]}>
          Lets Crack It
        </Animated.Text>

        <Animated.Text style={[styles.tagline, { opacity: tagOpacity }]}>
          Your personal fitness companion
        </Animated.Text>
      </View>

      <View style={styles.dotsRow}>
        {[dot1, dot2, dot3].map((dot, i) => (
          <Animated.View key={i} style={[styles.dot, { opacity: dot }]} />
        ))}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.APP_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.LIGHT_YELLOW,
    opacity: 0.07,
    top: height / 2 - 150,
  },
  center: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  appName: {
    color: colors.WHITE,
    ...fonts.PoppinsBold(30),
    letterSpacing: 0.8,
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    color: colors.APP_COLOR_LIGHT,
    ...fonts.PoppinsRegular(13),
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 64,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.LIGHT_YELLOW,
  },
});