import React, { useEffect, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, fonts } from './utils/constants';
import { getBMIHistory, signInWithGoogle } from './utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData, setUserPhysicalData } from './store/slices/userSlice';
import { reportError } from './utils/helpers';

export const Login: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => backHandler.remove();
  }, []);

  const handleBack = () => {
    navigation.goBack();
    return true;
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const user = await signInWithGoogle();
      dispatch(setUserData(user));
      const getUserPhysicalData = await getBMIHistory();
      dispatch(setUserPhysicalData(getUserPhysicalData));
      navigation.navigate('TabBar');
    } catch (error) {
      reportError(error, 'handleLogin_Login.tsx');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} bounces={false}>
      {/* Brand section */}
      <View style={styles.brandSection}>
        <Image
          source={require('./icons/logo-transparent2.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Lets Crack It</Text>
        <Text style={styles.tagline}>Your personal fitness companion</Text>
      </View>

      {/* Auth card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Welcome back</Text>
        <Text style={styles.cardSubtitle}>Sign in to continue your journey</Text>

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.LIGHT_YELLOW} />
            <Text style={styles.loaderText}>Signing you in…</Text>
          </View>
        ) : (
          <View style={styles.buttonGroup}>
            {/* Google button */}
            <TouchableOpacity onPress={handleLogin} style={styles.googleButton} activeOpacity={0.85}>
              <Image source={require('./icons/google_icon.webp')} style={styles.googleIcon}/>
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerLabel}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Email button */}
            <TouchableOpacity
              onPress={() => navigation.navigate('EmailAuth')}
              style={styles.emailButton}
              activeOpacity={0.85}>
              <Text style={styles.emailButtonText}>Continue with Email</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text style={styles.footer}>
        By continuing, you agree to our{' '}
        <Text style={styles.footerLink}>Terms</Text> &{' '}
        <Text style={styles.footerLink}>Privacy Policy</Text>
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.MIDNIGHT_NAVY,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 12,
  },
  appName: {
    color: colors.WHITE,
    ...fonts.PoppinsBold(28),
    letterSpacing: 0.5,
  },
  tagline: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(13),
    marginTop: 4,
  },
  card: {
    width: '100%',
    backgroundColor: colors.DARK_NAVY,
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: colors.NAVY_BLUE,
  },
  cardTitle: {
    color: colors.WHITE,
    ...fonts.PoppinsBold(22),
    marginBottom: 4,
  },
  cardSubtitle: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(13),
    marginBottom: 28,
  },
  loaderContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 12,
  },
  loaderText: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(14),
  },
  buttonGroup: {
    gap: 16,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    elevation: 3,
    shadowColor: colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  googleIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.CORNFLOWER_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  googleIconText: {
    color: colors.WHITE,
    ...fonts.PoppinsBold(14),
  },
  googleButtonText: {
    color: colors.CHARCOAL,
    ...fonts.PoppinsSemiBold(15),
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.NAVY_BLUE,
  },
  dividerLabel: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(13),
  },
  emailButton: {
    borderWidth: 1.5,
    borderColor: colors.LIGHT_YELLOW,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  emailButtonText: {
    color: colors.LIGHT_YELLOW,
    ...fonts.PoppinsSemiBold(15),
  },
  footer: {
    marginTop: 28,
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(11),
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    color: colors.LIGHT_YELLOW,
    ...fonts.PoppinsMedium(11),
  },
  googleIcon: {
  height: 28,
  width: 28,
  backgroundColor: 'white'
},
});