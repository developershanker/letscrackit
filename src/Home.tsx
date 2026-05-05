import React, { useEffect, useState } from 'react';
import {
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
import { capitalizeWords, firebaseRemoteConfigData, getBMIInfo } from './utils/helpers';
import { selectUserData, selectUserPhysicalData } from './store/selectors/userSelectors';

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
  const physicalData: any[] = useSelector(selectUserPhysicalData) ?? [];

  const latest    = physicalData?.[0];
  const bmi       = latest?.bmi;
  const firstName = userData?.displayName?.split(' ')[0] || 'there';

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

        {/* BMI card */}
        {bmi ? (
          <View style={styles.bmiCard}>
            <View>
              <Text style={styles.cardLabel}>Current BMI</Text>
              <Text style={[styles.bmiValue, { color: getBMIInfo(bmi).color }]}>{bmi}</Text>
              <View style={[styles.categoryPill, { backgroundColor: getBMIInfo(bmi).color + '22', borderColor: getBMIInfo(bmi).color }]}>
                <Text style={[styles.categoryPillText, { color: getBMIInfo(bmi).color }]}>{getBMIInfo(bmi).category}</Text>
              </View>
            </View>

            <View style={styles.bmiRight}>
              {latest?.weight ? (
                <View style={styles.metaRow}>
                  <Ionicons name="barbell-outline" size={15} color={colors.APP_COLOR_LIGHT} />
                  <Text style={styles.metaText}>{latest.weight} kg</Text>
                </View>
              ) : null}
              {latest?.height ? (
                <View style={styles.metaRow}>
                  <Ionicons name="body-outline" size={15} color={colors.APP_COLOR_LIGHT} />
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
    backgroundColor: colors.APP_COLOR,
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
    color: colors.APP_COLOR_LIGHT,
    ...fonts.PoppinsRegular(14),
    marginBottom: 2,
  },
  greetingName: {
    color: colors.WHITE,
    ...fonts.PoppinsBold(26),
  },
  // BMI card — has data
  bmiCard: {
    backgroundColor: colors.CARD_BACKGROUND,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardLabel: {
    color: colors.APP_COLOR_LIGHT,
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
    color: colors.APP_COLOR_LIGHT,
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
    backgroundColor: colors.CARD_BACKGROUND,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
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
    color: colors.APP_COLOR_LIGHT,
    ...fonts.PoppinsRegular(12),
  },
  // Firebase content card
  contentCard: {
    backgroundColor: colors.CARD_BACKGROUND,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
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
    color: colors.APP_COLOR_LIGHT,
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
    backgroundColor: colors.CARD_BACKGROUND,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    paddingVertical: 18,
    alignItems: 'center',
    gap: 8,
  },
  quickLabel: {
    color: colors.APP_COLOR_LIGHT,
    ...fonts.PoppinsRegular(12),
  },
});