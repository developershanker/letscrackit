import React, { useEffect } from 'react';
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Pressable } from 'react-native';
import VideoPlayer from './VideoPlayer';
import { colors, fonts } from '../utils/constants';
import { type RootStackParamList } from '../../App';
import { type VideoCategory, type VideoLevel } from '../utils/types';

const CATEGORY_COLORS: Record<VideoCategory, string> = {
  yoga: '#7c3aed',
  strength: '#dc2626',
  cardio: '#0891b2',
  tutorial: '#059669',
};

const LEVEL_COLORS: Record<VideoLevel, string> = {
  Beginner: colors.MINT_GREEN,
  Intermediate: colors.AMBER,
  Advanced: colors.CORAL,
};

export const VideoPlayerScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'VideoPlayerScreen'>>();
  const { video } = route?.params;

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });
    return () => sub.remove();
  }, [navigation]);
  return (
    <SafeAreaView style={styles.container}>
      {/* Back button */}
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back-outline" size={25} color={colors.WHITE} />
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Player */}
        <VideoPlayer
          uri={video?.uri}
          thumbnail={video?.thumbnail}
          style={styles.player}
          autoPlay={false}
        />

        {/* Meta */}
        <View style={styles.meta}>
          {/* Badges row */}
          <View style={styles.badgesRow}>
            <View style={[styles.categoryBadge, { backgroundColor: CATEGORY_COLORS?.[video?.category] || colors.AMBER }]}>
              <Text style={styles.categoryText}>{video?.category.toUpperCase()}</Text>
            </View>
            <View style={[styles.levelBadge, { borderColor: LEVEL_COLORS?.[video?.level] || colors.AMBER}]}>
              <Text style={[styles.levelText, { color: LEVEL_COLORS?.[video?.level] || colors.AMBER }]}>{video?.level}</Text>
            </View>
            <View style={styles.durationBadge}>
              <Ionicons name="time-outline" size={12} color={colors.POWDER_BLUE} />
              <Text style={styles.durationText}>{video?.duration}</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>{video?.title}</Text>

          {/* Instructor */}
          <View style={styles.instructorRow}>
            <Ionicons name="person-circle-outline" size={16} color={colors.SLATE_BLUE} />
            <Text style={styles.instructorText}>{video?.instructor}</Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Description */}
          {!!video?.description && (
            <Text style={styles.description}>{video?.description}</Text>
          )}
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
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  player: {
    borderRadius: 0,
    marginHorizontal: 0,
  },
  meta: {
    padding: 20,
    gap: 12,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    color: colors.WHITE,
    ...fonts.PoppinsMedium(10),
    letterSpacing: 0.5,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  levelText: {
    ...fonts.PoppinsMedium(11),
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(12),
  },
  title: {
    color: colors.WHITE,
    ...fonts.PoppinsBold(20),
    lineHeight: 28,
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  instructorText: {
    color: colors.SLATE_BLUE,
    ...fonts.PoppinsRegular(13),
  },
  divider: {
    height: 1,
    backgroundColor: colors.NAVY_BLUE,
  },
  description: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(14),
    lineHeight: 22,
  },
});