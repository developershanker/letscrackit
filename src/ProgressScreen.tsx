import React, {useEffect} from 'react';
import {BackHandler, Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {colors, fonts} from './utils/constants';
import Header from './components/Header';
import {selectUserPhysicalData} from './store/selectors/userSelectors';
import {formatBMIMetric} from './utils/helpers';
import {BMIEntry} from './store/slices/userSlice';

const {width: winWidth} = Dimensions.get('window');

const formatDate = (date?: Date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d?.toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'});
};

export const ProgressScreen: React.FC = () => {
  const navigation = useNavigation();
  const physicalData: BMIEntry[] = useSelector(selectUserPhysicalData) ?? [];

  const handleBack = () => {
    navigation.goBack();
    return true;
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => subscription.remove();
  }, []);

  const renderBMIItem = ({item, index}: {item: BMIEntry; index: number}) => {
    const isLatest = index === 0;
    const metric   = formatBMIMetric(item.method, item.metric);
    const metricDisplay = metric
      ? item.method === 'bodyFat' ? `${metric} fat` : `${metric} pct`
      : null;

    return (
      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <View style={styles.dateRow}>
            <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
            {isLatest && <View style={styles.latestBadge}><Text style={styles.latestText}>Latest</Text></View>}
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Weight</Text>
              <Text style={styles.statValue}>{item.weight} kg</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Height</Text>
              <Text style={styles.statValue}>{item.height} cm</Text>
            </View>
          </View>
        </View>

        <View style={[styles.bmiBlock, {borderLeftColor: item.color}]}>
          <Text style={[styles.bmiValue, {color: item.color}]}>{item.bmi}</Text>
          <View style={[styles.categoryPill, {backgroundColor: item.color + '22', borderColor: item.color}]}>
            <Text style={[styles.categoryText, {color: item.color}]}>{item.category}</Text>
          </View>
          {metricDisplay != null && (
            <Text style={[styles.metricLine, {color: item.color}]}>{metricDisplay}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIconName={'chevron-back-outline'}
        leftIconSize={25}
        onPressLeftIcon={handleBack}
        headingTitle={'Progress'}
      />

      <View style={styles.legend}>
        {[
          {label: 'Underweight', color: colors.SKY_BLUE},
          {label: 'Normal', color: colors.MINT_GREEN},
          {label: 'Overweight', color: colors.AMBER},
          {label: 'Obese', color: colors.CORAL},
        ].map(item => (
          <View key={item.label} style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: item.color}]} />
            <Text style={styles.legendLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={physicalData}
        keyExtractor={item => item.id}
        renderItem={renderBMIItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No entries yet</Text>
            <Text style={styles.emptySubtitle}>Log your BMI from the home screen to track progress</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.MIDNIGHT_NAVY,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(11),
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.DEEP_NAVY,
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    width: winWidth - 32,
  },
  cardLeft: {
    flex: 1,
    gap: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(12),
  },
  latestBadge: {
    backgroundColor: colors.LIGHT_YELLOW + '22',
    borderColor: colors.LIGHT_YELLOW,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  latestText: {
    color: colors.LIGHT_YELLOW,
    ...fonts.PoppinsBold(10),
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statItem: {
    gap: 2,
  },
  statLabel: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(11),
  },
  statValue: {
    color: colors.WHITE,
    ...fonts.PoppinsBold(14),
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.COBALT_BLUE,
  },
  bmiBlock: {
    alignItems: 'center',
    paddingLeft: 16,
    borderLeftWidth: 2,
    gap: 6,
  },
  bmiValue: {
    ...fonts.PoppinsBold(26),
  },
  categoryPill: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  categoryText: {
    ...fonts.PoppinsSemiBold(10),
  },
  metricLine: {
    ...fonts.PoppinsMedium(10),
    opacity: 0.85,
  },
  emptyState: {
    marginTop: 80,
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyTitle: {
    color: colors.WHITE,
    ...fonts.PoppinsBold(18),
  },
  emptySubtitle: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(13),
    textAlign: 'center',
  },
});