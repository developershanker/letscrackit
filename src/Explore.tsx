import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from './components/Header';
import VideoCard from './components/VideoCard';
import { colors, fonts } from './utils/constants';
import { firebaseRemoteConfigData, reportError } from './utils/helpers';
import { type HealthVideo, type VideoCategory } from './utils/types';
import { type RootStackParamList } from '../App';

const CATEGORIES: { key: VideoCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'yoga', label: 'Yoga' },
  { key: 'strength', label: 'Strength' },
  { key: 'cardio', label: 'Cardio' },
  { key: 'tutorial', label: 'Tutorial' },
];

type ExploreNav = NativeStackNavigationProp<RootStackParamList>;

export const Explore: React.FC = () => {
  const navigation = useNavigation<ExploreNav>();
  const [videos, setVideos] = useState<HealthVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<VideoCategory | 'all'>('all');

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', handleBack);
    fetchVideos();
    return () => subscription.remove();
  }, []);

  const fetchVideos = async () => {
    try {
      const data = await firebaseRemoteConfigData('videos_data');
      setVideos(data);
    } catch(error) {
      reportError(error, 'fetchVideos_Explore.tsx')
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.navigate('Home');
    return true;
  };

  const handleVideoPress = (video: HealthVideo) => {
    navigation.navigate('VideoPlayerScreen', { video });
  };

  const filtered = useMemo(
    () => activeCategory === 'all' ? videos : videos.filter(v => v.category === activeCategory),
    [videos, activeCategory],
  );

  const renderVideo = ({ item }: { item: HealthVideo }) => (
    <VideoCard video={item} onPress={handleVideoPress} />
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🎬</Text>
      <Text style={styles.emptyTitle}>No videos here yet</Text>
      <Text style={styles.emptySubtitle}>Try a different category or check back soon</Text>
    </View>
  );

  const ListHeader = (
    <View>
      <View style={styles.listHeaderText}>
        <Text style={styles.screenTitle}>Explore</Text>
        <Text style={styles.screenSubtitle}>Yoga, strength & health tutorials</Text>
      </View>

      {/* Category filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryRow}>
        {CATEGORIES.map(cat => {
          const isActive = activeCategory === cat.key;
          return (
            <Pressable
              key={cat.key}
              style={[styles.categoryChip, isActive && styles.categoryChipActive]}
              onPress={() => setActiveCategory(cat.key)}>
              <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIconName="chevron-back-outline"
        leftIconSize={25}
        onPressLeftIcon={handleBack}
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.LIGHT_YELLOW} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => `${item.id}`}
          renderItem={renderVideo}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          windowSize={5}
          initialNumToRender={4}
          removeClippedSubviews
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.MIDNIGHT_NAVY,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listHeaderText: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 16,
  },
  screenTitle: {
    color: colors.WHITE,
    ...fonts.PoppinsBold(26),
    marginBottom: 4,
  },
  screenSubtitle: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(13),
  },
  categoryRow: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.NAVY_BLUE,
    backgroundColor: colors.DARK_NAVY,
  },
  categoryChipActive: {
    backgroundColor: colors.LIGHT_YELLOW,
    borderColor: colors.LIGHT_YELLOW,
  },
  categoryChipText: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsMedium(13),
  },
  categoryChipTextActive: {
    color: colors.MIDNIGHT_NAVY,
  },
  listContent: {
    paddingBottom: 32,
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    color: colors.WHITE,
    ...fonts.PoppinsSemiBold(16),
    marginBottom: 6,
  },
  emptySubtitle: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(13),
    textAlign: 'center',
    lineHeight: 20,
  },
});