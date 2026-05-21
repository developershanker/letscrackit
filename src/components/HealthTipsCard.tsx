import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, fonts } from '../utils/constants';

interface Props {
  tips: string[];
  loading: boolean;
  error: boolean;
  categoryColor: string;
  onRetry: () => void;
}

const TipItem: React.FC<{ tip: string; index: number; color: string }> = ({
  tip,
  index,
  color,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 350,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.tipRow, { opacity, transform: [{ translateY }] }]}>
      <View style={[styles.tipIndex, { backgroundColor: color + '22', borderColor: color + '55' }]}>
        <Text style={[styles.tipIndexText, { color }]}>
          {String(index + 1).padStart(2, '0')}
        </Text>
      </View>
      <Text style={styles.tipText}>{tip}</Text>
    </Animated.View>
  );
};

const SkeletonLine: React.FC<{ width: string | number; marginTop?: number }> = ({
  width,
  marginTop = 0,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.skeletonLine,
        { width: width as any, marginTop, opacity },
      ]}
    />
  );
};

export const HealthTipsCard: React.FC<Props> = ({
  tips,
  loading,
  error,
  categoryColor,
  onRetry,
}) => {
  const color = categoryColor || colors.MINT_GREEN;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="sparkles" size={15} color={color} />
          <Text style={[styles.headerTitle, { color }]}>AI Health Tips</Text>
        </View>
        {error && !loading && (
          <TouchableOpacity onPress={onRetry} style={styles.retryBtn} activeOpacity={0.7}>
            <Ionicons name="refresh-outline" size={13} color={colors.POWDER_BLUE} />
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.subtitle}>Personalized based on your current BMI</Text>

      <View style={styles.divider} />

      {loading && (
        <View style={styles.skeletonBlock}>
          {[0.92, 0.75, 0.85, 0.68, 0.80].map((w, i) => (
            <View key={i} style={styles.skeletonRow}>
              <Animated.View style={[styles.skeletonBadge, { opacity: new Animated.Value(0.4) }]} />
              <View style={{ flex: 1, gap: 5 }}>
                <SkeletonLine width={`${w * 100}%`} />
                {w > 0.8 && <SkeletonLine width="60%" marginTop={0} />}
              </View>
            </View>
          ))}
          <View style={styles.loadingFooter}>
            <ActivityIndicator size="small" color={color} />
            <Text style={[styles.loadingText, { color }]}>Generating your tips…</Text>
          </View>
        </View>
      )}

      {error && !loading && (
        <View style={styles.errorBlock}>
          <Ionicons name="cloud-offline-outline" size={28} color={colors.SLATE_BLUE} />
          <Text style={styles.errorText}>Couldn't load tips right now</Text>
          <TouchableOpacity onPress={onRetry} style={styles.retryBtnLarge} activeOpacity={0.8}>
            <Text style={styles.retryBtnText}>Try again</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && tips.length > 0 && (
        <View style={styles.tipsBlock}>
          {tips.map((tip, i) => (
            <TipItem key={i} tip={tip} index={i} color={color} />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.DARK_NAVY,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.NAVY_BLUE,
    padding: 18,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    ...fonts.PoppinsMedium(11),
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  subtitle: {
    color: colors.SLATE_BLUE,
    ...fonts.PoppinsRegular(11),
    marginBottom: 14,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.NAVY_BLUE,
    marginBottom: 14,
  },
  // Skeleton
  skeletonBlock: {
    gap: 14,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  skeletonBadge: {
    width: 32,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.NAVY_BLUE,
  },
  skeletonLine: {
    height: 10,
    borderRadius: 6,
    backgroundColor: colors.NAVY_BLUE,
  },
  loadingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.NAVY_BLUE,
  },
  loadingText: {
    ...fonts.PoppinsRegular(12),
  },
  // Error
  errorBlock: {
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  errorText: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(13),
    textAlign: 'center',
  },
  retryBtnLarge: {
    borderWidth: 1,
    borderColor: colors.NAVY_BLUE,
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 20,
    marginTop: 4,
  },
  retryBtnText: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsMedium(12),
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  retryText: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(11),
  },
  // Tips list
  tipsBlock: {
    gap: 14,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipIndex: {
    width: 34,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  tipIndexText: {
    ...fonts.PoppinsBold(11),
    letterSpacing: 0.5,
  },
  tipText: {
    flex: 1,
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(13),
    lineHeight: 20,
    paddingTop: 5,
  },
});
