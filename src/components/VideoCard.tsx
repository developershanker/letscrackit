import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, fonts } from '../utils/constants';
import { type HealthVideo, type VideoCategory } from '../utils/types';

interface VideoCardProps {
  video: HealthVideo;
  onPress: (video: HealthVideo) => void;
}

const CATEGORY_COLORS: Record<VideoCategory, string> = {
  yoga: '#7c3aed',
  strength: '#dc2626',
  cardio: '#0891b2',
  tutorial: '#059669',
};

const CATEGORY_LABELS: Record<VideoCategory, string> = {
  yoga: 'Yoga',
  strength: 'Strength',
  cardio: 'Cardio',
  tutorial: 'Tutorial',
};

const LEVEL_COLORS = {
  Beginner: colors.MINT_GREEN,
  Intermediate: colors.AMBER,
  Advanced: colors.CORAL,
};

const VideoCard: React.FC<VideoCardProps> = ({ video, onPress }) => (
  <Pressable
    style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    onPress={() => onPress(video)}
    android_ripple={{ color: colors.NAVY_BLUE }}>

    {/* Thumbnail with play icon */}
    <View style={styles.thumbnailContainer}>
      {video.thumbnail ? (
        <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} resizeMode="cover" />
      ) : (
        <View style={[styles.thumbnail, styles.thumbnailFallback]} />
      )}
      <View style={styles.playIconOverlay}>
        <View style={styles.playIconCircle}>
          <Ionicons name="play" size={16} color={colors.MIDNIGHT_NAVY} />
        </View>
      </View>
      <View style={[styles.categoryBadge, { backgroundColor: CATEGORY_COLORS[video.category] }]}>
        <Text style={styles.categoryText}>{CATEGORY_LABELS[video.category]}</Text>
      </View>
      <View style={styles.durationBadge}>
        <Ionicons name="time-outline" size={10} color={colors.WHITE} />
        <Text style={styles.durationText}>{video.duration}</Text>
      </View>
    </View>

    {/* Card body */}
    <View style={styles.body}>
      <Text style={styles.title} numberOfLines={2}>{video.title}</Text>
      {!!video.description && (
        <Text style={styles.description} numberOfLines={2}>{video.description}</Text>
      )}
      <View style={styles.footer}>
        <View style={styles.instructorRow}>
          <Ionicons name="person-circle-outline" size={13} color={colors.SLATE_BLUE} />
          <Text style={styles.instructorText}>{video.instructor}</Text>
        </View>
        <View style={[styles.levelBadge, { borderColor: LEVEL_COLORS[video.level] }]}>
          <Text style={[styles.levelText, { color: LEVEL_COLORS[video.level] }]}>{video.level}</Text>
        </View>
      </View>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.DARK_NAVY,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.NAVY_BLUE,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.85,
  },
  thumbnailContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailFallback: {
    backgroundColor: colors.DEEP_MIDNIGHT,
  },
  playIconOverlay: {
    position: 'absolute',
    right: 150,
    top: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.LIGHT_YELLOW,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 3,
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    color: colors.WHITE,
    ...fonts.PoppinsMedium(10),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  durationText: {
    color: colors.WHITE,
    ...fonts.PoppinsMedium(10),
  },
  body: {
    padding: 14,
    gap: 6,
  },
  title: {
    color: colors.WHITE,
    ...fonts.PoppinsSemiBold(14),
    lineHeight: 21,
  },
  description: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(12),
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  instructorText: {
    color: colors.SLATE_BLUE,
    ...fonts.PoppinsRegular(11),
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
  },
  levelText: {
    ...fonts.PoppinsMedium(10),
  },
});

export default VideoCard;
