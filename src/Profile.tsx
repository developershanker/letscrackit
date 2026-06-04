import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  Linking,
  Modal,
  Platform,
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import { deleteAccount } from './utils/api';

const FEEDBACK_FORM_URL = 'https://forms.gle/2JKtsjtTWC1eYCRe7';
const PLAY_STORE_URL    = `market://details?id=com.letscrackit`;
const PLAY_STORE_WEB    = `https://play.google.com/store/apps/details?id=com.letscrackit`;
const APP_STORE_URL     = `itms-apps://apps.apple.com/app/idYOUR_APP_ID`;

export const Profile: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData: any = useSelector(selectUserData);
  const userPhysicalData: BMIEntry[] = useSelector(selectUserPhysicalData) ?? [];
  const [showFeedbackSheet, setShowFeedbackSheet] = useState(false);

  const openStoreRating = async () => {
    setShowFeedbackSheet(false);
    try {
      const storeUrl = Platform.OS === 'ios' ? APP_STORE_URL : PLAY_STORE_URL;
      const canOpen  = await Linking.canOpenURL(storeUrl);
      await Linking.openURL(canOpen ? storeUrl : PLAY_STORE_WEB);
    } catch (e) {
      reportError(e, 'openStoreRating_Profile.tsx');
    }
  };

  const openFeedbackForm = async () => {
    setShowFeedbackSheet(false);
    try {
      await Linking.openURL(FEEDBACK_FORM_URL);
    } catch (e) {
      reportError(e, 'openFeedbackForm_Profile.tsx');
    }
  };

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


        {/* Settings-style action list */}
        <View style={styles.settingsList}>
          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => navigation.navigate('AddDetails')}
            activeOpacity={0.7}>
            <View style={[styles.settingsIconWrap, { backgroundColor: colors.LIGHT_YELLOW + '22' }]}>
              <Ionicons name="scale-outline" size={18} color={colors.LIGHT_YELLOW} />
            </View>
            <Text style={styles.settingsItemText}>{hasData ? 'Update Details' : 'Add Details'}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.SLATE_BLUE} />
          </TouchableOpacity>

          <View style={styles.settingsDivider} />

          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => setShowFeedbackSheet(true)}
            activeOpacity={0.7}>
            <View style={[styles.settingsIconWrap, { backgroundColor: colors.MINT_GREEN + '22' }]}>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.MINT_GREEN} />
            </View>
            <Text style={styles.settingsItemText}>Give Feedback</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.SLATE_BLUE} />
          </TouchableOpacity>

          <View style={styles.settingsDivider} />

          <TouchableOpacity
            style={styles.settingsItem}
            onPress={handleLogout}
            activeOpacity={0.7}>
            <View style={[styles.settingsIconWrap, { backgroundColor: colors.DEEP_MIDNIGHT }]}>
              <Ionicons name="log-out-outline" size={18} color={colors.POWDER_BLUE} />
            </View>
            <Text style={styles.settingsItemText}>Sign Out</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.SLATE_BLUE} />
          </TouchableOpacity>

          <View style={styles.settingsDivider} />

          <TouchableOpacity
            style={styles.settingsItem}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}>
            <View style={[styles.settingsIconWrap, { backgroundColor: colors.DARK_MAROON }]}>
              <Ionicons name="trash-outline" size={18} color={colors.CORAL} />
            </View>
            <Text style={[styles.settingsItemText, { color: colors.CORAL }]}>Delete Account</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.CORAL + '88'} />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.profileFooter}>
          <Text style={styles.footerVersion}>v2.11 (13)</Text>
          <Text style={styles.footerTagline}>Made for Healthy India ❤️</Text>
        </View>

      </ScrollView>

      {/* Feedback bottom sheet */}
      <Modal
        visible={showFeedbackSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFeedbackSheet(false)}>
        <TouchableOpacity
          style={styles.sheetOverlay}
          activeOpacity={1}
          onPress={() => setShowFeedbackSheet(false)}>
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View style={styles.sheet}>
              {/* Handle bar */}
              <View style={styles.sheetHandle} />

              <Text style={styles.sheetTitle}>How would you like to help? 🙏</Text>
              <Text style={styles.sheetSubtitle}>Your feedback helps us make the app better for everyone</Text>

              {/* Rate on Store */}
              <TouchableOpacity style={styles.feedbackOption} onPress={openStoreRating} activeOpacity={0.85}>
                <View style={[styles.feedbackIconWrap, { backgroundColor: colors.AMBER + '22' }]}>
                  <Ionicons name="star" size={22} color={colors.AMBER} />
                </View>
                <View style={styles.feedbackOptionText}>
                  <Text style={styles.feedbackOptionTitle}>Rate on {Platform.OS === 'ios' ? 'App Store' : 'Play Store'}</Text>
                  <Text style={styles.feedbackOptionDesc}>Takes just 30 seconds ⭐</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.SLATE_BLUE} />
              </TouchableOpacity>

              <View style={styles.feedbackDivider} />

              {/* Feedback Form */}
              <TouchableOpacity style={styles.feedbackOption} onPress={openFeedbackForm} activeOpacity={0.85}>
                <View style={[styles.feedbackIconWrap, { backgroundColor: colors.SKY_BLUE + '22' }]}>
                  <Ionicons name="document-text-outline" size={22} color={colors.SKY_BLUE} />
                </View>
                <View style={styles.feedbackOptionText}>
                  <Text style={styles.feedbackOptionTitle}>Share Detailed Feedback</Text>
                  <Text style={styles.feedbackOptionDesc}>Fill a quick Google Form 📝</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.SLATE_BLUE} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.sheetCancel} onPress={() => setShowFeedbackSheet(false)} activeOpacity={0.7}>
                <Text style={styles.sheetCancelText}>Maybe Later</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
  // Settings list
  settingsList: {
    backgroundColor: colors.DARK_NAVY,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.NAVY_BLUE,
    overflow: 'hidden',
    marginBottom: 24,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  settingsIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsItemText: {
    flex: 1,
    color: colors.WHITE,
    ...fonts.PoppinsMedium(14),
  },
  settingsDivider: {
    height: 1,
    backgroundColor: colors.NAVY_BLUE,
    marginLeft: 66,
  },
  // Feedback bottom sheet
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.DARK_NAVY,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.NAVY_BLUE,
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 12,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.NAVY_BLUE,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    color: colors.WHITE,
    ...fonts.PoppinsBold(18),
    marginBottom: 6,
  },
  sheetSubtitle: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(13),
    lineHeight: 20,
    marginBottom: 24,
  },
  feedbackOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
  },
  feedbackIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackOptionText: {
    flex: 1,
    gap: 3,
  },
  feedbackOptionTitle: {
    color: colors.WHITE,
    ...fonts.PoppinsSemiBold(14),
  },
  feedbackOptionDesc: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(12),
  },
  feedbackDivider: {
    height: 1,
    backgroundColor: colors.NAVY_BLUE,
    marginLeft: 62,
  },
  sheetCancel: {
    marginTop: 20,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.NAVY_BLUE,
  },
  sheetCancelText: {
    color: colors.SLATE_BLUE,
    ...fonts.PoppinsMedium(14),
  },
  // Footer
  profileFooter: {
    alignItems: 'center',
    paddingBottom: 24,
    gap: 4,
  },
  footerVersion: {
    color: colors.SLATE_BLUE,
    ...fonts.PoppinsRegular(12),
  },
  footerTagline: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsMedium(13),
  },
});