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

// Fallback sample videos — shown when Firebase Remote Config has no `videos_data` key yet.
// Replace with real video URLs or set up the Remote Config key to go live.
const SAMPLE_VIDEOS: HealthVideo[] = [
  {
    id: 1,
    title: 'Morning Yoga Flow for Flexibility',
    description: 'Start your day with this gentle 20-minute yoga flow designed to improve flexibility and calm your mind before work.',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=640',
    category: 'yoga',
    duration: '20:00',
    instructor: 'Priya Sharma',
    level: 'Beginner',
  },
  {
    id: 2,
    title: 'Full Body Strength Training — No Equipment',
    description: 'A bodyweight strength circuit targeting all major muscle groups. No gym or equipment needed — just your own bodyweight.',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=640',
    category: 'strength',
    duration: '35:00',
    instructor: 'Arjun Mehta',
    level: 'Intermediate',
  },
  {
    id: 3,
    title: 'Understanding Your BMI — Health Tutorial',
    description: 'Learn what BMI means, how it is calculated, its limitations, and how to use it alongside other metrics for a complete health picture.',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=640',
    category: 'tutorial',
    duration: '12:30',
    instructor: 'Dr. Neha Kapoor',
    level: 'Beginner',
  },
  {
    id: 4,
    title: 'HIIT Cardio Blast — 20 Minutes',
    description: 'High-intensity interval training to torch calories and improve cardiovascular endurance in just 20 minutes.',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=640',
    category: 'cardio',
    duration: '20:00',
    instructor: 'Vikram Singh',
    level: 'Intermediate',
  },
  {
    id: 5,
    title: 'Power Yoga for Strength & Balance',
    description: 'Combine the mindfulness of yoga with strength-building poses in this dynamic power yoga session.',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=640',
    category: 'yoga',
    duration: '28:00',
    instructor: 'Priya Sharma',
    level: 'Advanced',
  },
  {
    id: 6,
    title: 'Beginner Strength: Dumbbells 101',
    description: 'New to weight training? This beginner-friendly session teaches proper form for the 6 essential dumbbell exercises.',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=640',
    category: 'strength',
    duration: '18:45',
    instructor: 'Arjun Mehta',
    level: 'Beginner',
  },
  {
    id: 7,
    title: 'Heart Rate Zones Explained',
    description: 'Understand the 5 heart rate zones, how to train in each, and why zone 2 training is the most underrated health tool.',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=640',
    category: 'tutorial',
    duration: '09:15',
    instructor: 'Dr. Neha Kapoor',
    level: 'Beginner',  
},
  {
    id: 8,
    title: 'Tabata Cardio — Advanced Intervals',
    description: 'Push your limits with this 8-round Tabata protocol. 20 seconds on, 10 seconds off — designed for experienced athletes.',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=640',
    category: 'cardio',
    duration: '25:00',
    instructor: 'Vikram Singh',
    level: 'Advanced',
  },
];
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
      setVideos(data ?? SAMPLE_VIDEOS);
    } catch {
      setVideos(SAMPLE_VIDEOS);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
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