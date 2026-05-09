import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from './components/Header';
import { colors, fonts } from './utils/constants';
import { capitalizeWords, firebaseRemoteConfigData, formatBMIMetric, BMI_METHOD_LABEL } from './utils/helpers';
import { selectUserData, selectUserPhysicalData } from './store/selectors/userSelectors';
import { BMIEntry } from './store/slices/userSlice';
import { useHealthData } from './hooks/useHealthData';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export const Home: React.FC = () => {
  const navigation = useNavigation();
  const [heading, setHeading]       = useState('');
  const [subHeading, setSubHeading] = useState('');
  const userData: any    = useSelector(selectUserData);
  const physicalData: BMIEntry[] = useSelector(selectUserPhysicalData) ?? [];

  const latest          = physicalData?.[0];
  const bmi             = latest?.bmi;
  const firstName       = userData?.displayName?.split(' ')[0] || 'there';
  const entryColor      = latest?.color  ?? colors.POWDER_BLUE;
  const entryCategory   = latest?.category ?? '';
  const formattedMetric = formatBMIMetric(latest?.method, latest?.metric);
  const metricLabel     = latest?.method ? BMI_METHOD_LABEL[latest.method] : '';
  const profileIncomplete = !userData?.profileComplete;
  const { status: healthStatus, data: healthData, load: loadHealth } = useHealthData();

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      BackHandler.exitApp();
      return true;
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    const load = async () => {
      const data = await firebaseRemoteConfigData('DEMO_KEY');
      setHeading(data?.heading?.replace('{{user}}', userData?.displayName) || '');
      setSubHeading(data?.subHeading || '');
    };
    load();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        leftIconImage={userData?.photoURL}
        onPressLeftIcon={() => navigation.navigate('Profile')}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingLine}>{getGreeting()} 👋</Text>
          <Text style={styles.greetingName}>{firstName}</Text>
        </View>

        {/* Incomplete profile nudge */}
        {profileIncomplete && (
          <TouchableOpacity
            style={styles.nudgeBanner}
            onPress={() => navigation.navigate('OnboardingDetails')}
            activeOpacity={0.8}>
            <Ionicons name="person-circle-outline" size={18} color={colors.LIGHT_YELLOW} />
            <Text style={styles.nudgeText}>Complete your profile for age-accurate BMI</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.LIGHT_YELLOW} />
          </TouchableOpacity>
        )}

        {/* BMI card */}
        {bmi ? (
          <View style={styles.bmiCard}>
            <View>
              <Text style={styles.cardLabel}>Current BMI</Text>
              <Text style={[styles.bmiValue, { color: entryColor }]}>{bmi}</Text>
              <View style={[styles.categoryPill, { backgroundColor: entryColor + '22', borderColor: entryColor }]}>
                <Text style={[styles.categoryPillText, { color: entryColor }]}>{entryCategory}</Text>
              </View>
              {formattedMetric != null && (
                <Text style={[styles.metricLine, { color: entryColor }]}>
                  {metricLabel}  {formattedMetric}
                </Text>
              )}
            </View>

            <View style={styles.bmiRight}>
              {latest?.weight ? (
                <View style={styles.metaRow}>
                  <Ionicons name="barbell-outline" size={15} color={colors.POWDER_BLUE} />
                  <Text style={styles.metaText}>{latest.weight} kg</Text>
                </View>
              ) : null}
              {latest?.height ? (
                <View style={styles.metaRow}>
                  <Ionicons name="body-outline" size={15} color={colors.POWDER_BLUE} />
                  <Text style={styles.metaText}>{latest.height} cm</Text>
                </View>
              ) : null}
              <TouchableOpacity
                style={styles.updateBtn}
                onPress={() => navigation.navigate('AddDetails')}>
                <Text style={styles.updateBtnText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.emptyBmiCard}
            onPress={() => navigation.navigate('AddDetails')}
            activeOpacity={0.85}>
            <View style={styles.emptyLeft}>
              <Text style={styles.emptyIcon}>📊</Text>
              <View>
                <Text style={styles.emptyTitle}>Track your BMI</Text>
                <Text style={styles.emptySubtitle}>Add weight & height to get started</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.LIGHT_YELLOW} />
          </TouchableOpacity>
        )}

        {/* Health Stats */}
        <View style={styles.healthCard}>
          <View style={styles.healthCardHeader}>
            <Ionicons name="fitness-outline" size={16} color={colors.LIGHT_YELLOW} />
            <Text style={styles.healthCardTitle}>Today's Health</Text>
            {healthStatus === 'idle' || healthStatus === 'unavailable' ? (
              <TouchableOpacity onPress={loadHealth} style={styles.connectBtn} activeOpacity={0.8}>
                <Text style={styles.connectBtnText}>
                  {healthStatus === 'unavailable' ? 'Unavailable' : 'Connect'}
                </Text>
              </TouchableOpacity>
            ) : healthStatus === 'loading' ? (
              <ActivityIndicator size="small" color={colors.LIGHT_YELLOW} style={{ marginLeft: 'auto' }} />
            ) : null}
          </View>

          {healthStatus === 'ready' ? (
            <View style={styles.healthStats}>
              <View style={styles.healthStat}>
                <Ionicons name="footsteps-outline" size={20} color={colors.LIGHT_YELLOW} />
                <Text style={styles.healthStatValue}>
                  {healthData.steps !== undefined ? healthData.steps.toLocaleString() : '—'}
                </Text>
                <Text style={styles.healthStatLabel}>Steps</Text>
                {healthData.steps !== undefined && (
                  <View style={styles.stepBarTrack}>
                    <View style={[styles.stepBarFill, { width: `${Math.min((healthData.steps / 10000) * 100, 100)}%` as any }]} />
                  </View>
                )}
              </View>

              <View style={styles.healthStatDivider} />

              <View style={styles.healthStat}>
                <Ionicons name="heart-outline" size={20} color="#FF6B6B" />
                <Text style={styles.healthStatValue}>
                  {healthData.heartRate !== undefined ? `${healthData.heartRate}` : '—'}
                </Text>
                <Text style={styles.healthStatLabel}>
                  {healthData.heartRate !== undefined ? 'bpm' : 'Heart Rate'}
                </Text>
              </View>

              <View style={styles.healthStatDivider} />

              <View style={styles.healthStat}>
                <Ionicons name="moon-outline" size={20} color="#A78BFA" />
                <Text style={styles.healthStatValue}>
                  {healthData.sleep !== undefined ? `${healthData.sleep}h` : '—'}
                </Text>
                <Text style={styles.healthStatLabel}>Sleep</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.healthEmptyText}>
              {healthStatus === 'loading'
                ? 'Fetching health data…'
                : healthStatus === 'unavailable'
                ? 'Health data not available on this device'
                : 'Tap Connect to sync your health stats'}
            </Text>
          )}
        </View>

        {/* Firebase content */}
        {(heading || subHeading) ? (
          <View style={styles.contentCard}>
            <View style={styles.contentCardHeader}>
              <Ionicons name="flash-outline" size={16} color={colors.LIGHT_YELLOW} />
              <Text style={styles.contentTag}>Today's Focus</Text>
            </View>
            {heading    ? <Text style={styles.contentHeading}>{capitalizeWords(heading)}</Text>    : null}
            {subHeading ? <Text style={styles.contentSubHeading}>{subHeading}</Text> : null}
          </View>
        ) : null}

        {/* Quick actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickRow}>
          {[
            { icon: 'scale-outline',      label: 'Log BMI',  onPress: () => navigation.navigate('AddDetails') },
            { icon: 'person-outline',     label: 'Profile',  onPress: () => navigation.navigate('Profile') },
            { icon: 'trending-up-outline',label: 'Progress', onPress: () => navigation.navigate('ProgressScreen') },
          ].map(({ icon, label, onPress }) => (
            <TouchableOpacity key={label} style={styles.quickCard} onPress={onPress} activeOpacity={0.8}>
              <Ionicons name={icon} size={26} color={colors.LIGHT_YELLOW} />
              <Text style={styles.quickLabel}>{label}</Text>
            </TouchableOpacity>
          ))}
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
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  // Greeting
  greetingSection: {
    marginTop: 4,
    marginBottom: 20,
  },
  greetingLine: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(14),
    marginBottom: 2,
  },
  greetingName: {
    color: colors.WHITE,
    ...fonts.PoppinsBold(26),
  },
  // BMI card — has data
  bmiCard: {
    backgroundColor: colors.DARK_NAVY,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.NAVY_BLUE,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardLabel: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsMedium(11),
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  bmiValue: {
    ...fonts.PoppinsBold(52),
    lineHeight: 58,
    marginBottom: 8,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryPillText: {
    ...fonts.PoppinsMedium(12),
  },
  bmiRight: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(13),
  },
  updateBtn: {
    borderWidth: 1,
    borderColor: colors.LIGHT_YELLOW,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  updateBtnText: {
    color: colors.LIGHT_YELLOW,
    ...fonts.PoppinsMedium(12),
  },
  // BMI card — empty
  emptyBmiCard: {
    backgroundColor: colors.DARK_NAVY,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.NAVY_BLUE,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  emptyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  emptyIcon: { fontSize: 30 },
  emptyTitle: {
    color: colors.WHITE,
    ...fonts.PoppinsSemiBold(14),
    marginBottom: 2,
  },
  emptySubtitle: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(12),
  },
  // Firebase content card
  contentCard: {
    backgroundColor: colors.DARK_NAVY,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.NAVY_BLUE,
    padding: 20,
    marginBottom: 24,
  },
  contentCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  contentTag: {
    color: colors.LIGHT_YELLOW,
    ...fonts.PoppinsMedium(11),
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  contentHeading: {
    color: colors.WHITE,
    ...fonts.PoppinsSemiBold(16),
    marginBottom: 6,
    lineHeight: 24,
  },
  contentSubHeading: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(13),
    lineHeight: 20,
  },
  // Quick actions
  sectionTitle: {
    color: colors.WHITE,
    ...fonts.PoppinsSemiBold(14),
    marginBottom: 12,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 12,
  },
  quickCard: {
    flex: 1,
    backgroundColor: colors.DARK_NAVY,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.NAVY_BLUE,
    paddingVertical: 18,
    alignItems: 'center',
    gap: 8,
  },
  quickLabel: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(12),
  },
  nudgeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.DEEP_MIDNIGHT,
    borderWidth: 1,
    borderColor: colors.LIGHT_YELLOW + '55',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  nudgeText: {
    flex: 1,
    color: colors.LIGHT_YELLOW,
    ...fonts.PoppinsMedium(12),
  },
  metricLine: {
    ...fonts.PoppinsMedium(12),
    marginTop: 6,
    opacity: 0.9,
  },
  // Health stats card
  healthCard: {
    backgroundColor: colors.DARK_NAVY,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.NAVY_BLUE,
    padding: 16,
    marginBottom: 16,
  },
  healthCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  healthCardTitle: {
    color: colors.LIGHT_YELLOW,
    ...fonts.PoppinsMedium(11),
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    flex: 1,
  },
  connectBtn: {
    borderWidth: 1,
    borderColor: colors.LIGHT_YELLOW,
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  connectBtnText: {
    color: colors.LIGHT_YELLOW,
    ...fonts.PoppinsMedium(11),
  },
  healthStats: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  healthStat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  healthStatValue: {
    color: colors.WHITE,
    ...fonts.PoppinsBold(20),
  },
  healthStatLabel: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(11),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  healthStatDivider: {
    width: 1,
    height: 50,
    backgroundColor: colors.NAVY_BLUE,
    alignSelf: 'center',
  },
  stepBarTrack: {
    width: '80%',
    height: 3,
    backgroundColor: colors.NAVY_BLUE,
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  stepBarFill: {
    height: '100%',
    backgroundColor: colors.LIGHT_YELLOW,
    borderRadius: 2,
  },
  healthEmptyText: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(12),
    textAlign: 'center',
    paddingVertical: 8,
  },
});