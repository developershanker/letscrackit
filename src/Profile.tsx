import React, { useEffect } from 'react';
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, fonts } from './utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData, selectUserPhysicalData } from './store/selectors/userSelectors';
import { logout } from './store/slices/userSlice';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { capitalizeWords, reportError, formatBMIMetric, BMI_METHOD_LABEL } from './utils/helpers';
import { BMIEntry } from './store/slices/userSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { deleteAccount } from './utils/api';

export const Profile: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData: any = useSelector(selectUserData);
  const userPhysicalData: BMIEntry[] = useSelector(selectUserPhysicalData) ?? [];

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      BackHandler.exitApp();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  const handleLogout = async () => {
    try {
      const currentUser = auth().currentUser;
      const isGoogleUser = currentUser?.providerData?.some(
        p => p.providerId === 'google.com'
      );
      await auth().signOut();
      if (isGoogleUser) await GoogleSignin.signOut();
      dispatch(logout());
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Logout Failed', 'Something went wrong while signing out.');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Proceed',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Final Confirmation',
              'This will permanently delete your account and all your data. This cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete My Account',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      const currentUser = auth().currentUser;
                      const isGoogleUser = currentUser?.providerData?.some(
                        p => p.providerId === 'google.com'
                      );
                      await deleteAccount();
                      if (isGoogleUser) await GoogleSignin.signOut();
                      dispatch(logout());
                      navigation.replace('Login');
                    } catch (error: any) {
                      if (error?.code === 'auth/requires-recent-login') {
                        Alert.alert(
                          'Sign In Required',
                          'For security, please sign out and sign back in, then try deleting your account again.'
                        );
                      } else {
                        reportError(error, 'handleDeleteAccount_Profile.tsx');
                        Alert.alert('Error', 'Failed to delete account. Please try again.');
                      }
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const latestEntry = userPhysicalData?.[0];
  const bmi         = latestEntry?.bmi;
  const entryColor  = latestEntry?.color  ?? colors.POWDER_BLUE;
  const entryCategory = latestEntry?.category ?? null;
  const hasData     = userPhysicalData?.length > 0;

  const formattedMetric = formatBMIMetric(latestEntry?.method, latestEntry?.metric);
  const metricLabel = latestEntry?.method ? BMI_METHOD_LABEL[latestEntry.method] : '';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Avatar card */}
        <View style={styles.avatarCard}>
          {userData?.photoURL ? (
            <Image source={{ uri: userData.photoURL }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitial}>
                {userData?.displayName?.[0]?.toUpperCase() || 'U'}
              </Text>
            </View>
          )}
          <Text style={styles.userName}>{capitalizeWords(userData?.displayName)}</Text>
          <Text style={styles.userEmail}>{userData?.email}</Text>
        </View>

        {/* BMI card */}
        {hasData && bmi ? (
          <View style={styles.bmiCard}>
            <Text style={styles.bmiLabel}>Body Mass Index</Text>
            <Text style={[styles.bmiValue, { color: entryColor }]}>{bmi}</Text>
            <View style={[styles.categoryBadge, { backgroundColor: entryColor + '22', borderColor: entryColor }]}>
              <Text style={[styles.categoryText, { color: entryColor }]}>{entryCategory}</Text>
            </View>

            {formattedMetric != null && (
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>{metricLabel}</Text>
                <Text style={[styles.metricValue, { color: entryColor }]}>{formattedMetric}</Text>
              </View>
            )}

            <Text style={styles.bmiMeta}>
              {latestEntry?.weight ? `${latestEntry.weight} kg` : ''}
              {latestEntry?.height ? `  ·  ${latestEntry.height} cm` : ''}
            </Text>
          </View>
        ) : (
          <View style={styles.emptyBmiCard}>
            <Text style={styles.emptyBmiIcon}>📊</Text>
            <Text style={styles.emptyBmiTitle}>No BMI data yet</Text>
            <Text style={styles.emptyBmiSubtitle}>Add your weight & height to track your BMI</Text>
          </View>
        )}


<View style={styles.bottomSection}>
  <TouchableOpacity
    style={styles.primaryButton}
    onPress={() => navigation.navigate('AddDetails')}
    activeOpacity={0.85}>
    <Text style={styles.primaryButtonText}>
      {hasData ? 'Update Details' : 'Add Details'}
    </Text>
  </TouchableOpacity>

  <View style={styles.secondaryRow}>
    <TouchableOpacity onPress={handleDeleteAccount} style={styles.deleteBtn}>
      <Text style={styles.deleteText}>Delete Account</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.signOutBtn} onPress={handleLogout} activeOpacity={0.85}>
      <Text style={styles.signOutText}>Sign Out</Text>
    </TouchableOpacity>
  </View>
</View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.MIDNIGHT_NAVY,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  // Avatar
  avatarCard: {
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 28,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: colors.LIGHT_YELLOW,
    marginBottom: 14,
  },
  avatarFallback: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.DARK_NAVY,
    borderWidth: 3,
    borderColor: colors.LIGHT_YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarInitial: {
    color: colors.LIGHT_YELLOW,
    ...fonts.PoppinsBold(36),
  },
  userName: {
    color: colors.WHITE,
    ...fonts.PoppinsBold(20),
    marginBottom: 4,
  },
  userEmail: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(13),
  },
  // BMI card
  bmiCard: {
    backgroundColor: colors.DARK_NAVY,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.NAVY_BLUE,
    paddingVertical: 28,
    alignItems: 'center',
    marginBottom: 16,
  },
  bmiLabel: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsMedium(12),
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  bmiValue: {
    ...fonts.PoppinsBold(56),
    lineHeight: 64,
    marginBottom: 10,
  },
  categoryBadge: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  categoryText: {
    ...fonts.PoppinsSemiBold(13),
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  metricLabel: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(12),
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  metricValue: {
    ...fonts.PoppinsBold(14),
  },
  bmiMeta: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(12),
  },
  // Empty state
  emptyBmiCard: {
    backgroundColor: colors.DARK_NAVY,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.NAVY_BLUE,
    paddingVertical: 36,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyBmiIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyBmiTitle: {
    color: colors.WHITE,
    ...fonts.PoppinsSemiBold(16),
    marginBottom: 6,
  },
  emptyBmiSubtitle: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(13),
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 20,
  },
  // Bottom CTAs
  bottomSection: {
  paddingHorizontal: 20,
  paddingBottom: 16,
  paddingTop: 10,
  gap: 10,
},
primaryButton: {
  backgroundColor: colors.LIGHT_YELLOW,
  borderRadius: 10,
  paddingVertical: 12,
  alignItems: 'center',
},
primaryButtonText: {
  color: colors.MIDNIGHT_NAVY,
  ...fonts.PoppinsSemiBold(14),
},
secondaryRow: {
  marginTop: 18, 
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
},
editProfileBtn: {
  borderWidth: 1,
  borderColor: colors.NAVY_BLUE,
  borderRadius: 10,
  paddingVertical: 10,
  alignItems: 'center',
},
editProfileText: {
  color: colors.POWDER_BLUE,
  ...fonts.PoppinsMedium(13),
},
signOutBtn: {
  flex: 1,
  borderWidth: 1,
  borderColor: colors.NAVY_BLUE,
  borderRadius: 10,
  paddingVertical: 10,
  alignItems: 'center',
},
signOutText: {
  color: colors.POWDER_BLUE,
  ...fonts.PoppinsMedium(13),
},
deleteBtn: {
  flex: 1,
  borderWidth: 1,
  borderColor: colors.DARK_MAROON,
  borderRadius: 10,
  paddingVertical: 10,
  alignItems: 'center',
},
deleteText: {
  color: colors.CORAL,
  ...fonts.PoppinsMedium(13),
},
});