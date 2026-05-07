import {
  BackHandler,
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { colors, fonts } from './utils/constants';
import { useNavigation } from '@react-navigation/native';
import Header from './components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { firebaseRemoteConfigData, reportError } from './utils/helpers';
import { HealthArticle } from './utils/types';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const Discover: React.FC = () => {
  const navigation = useNavigation();
  const [articles, setArticles] = useState<HealthArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', handleBack);
    fetchArticles();
    return () => subscription.remove();
  }, []);

  const fetchArticles = async () => {
    try {
      const data = await firebaseRemoteConfigData('articles_data');
      setArticles(data ?? []);
    } catch (error) {
      reportError(error, 'fetchArticles_Discover.tsx');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
    return true;
  };

  const openLink = (item: HealthArticle) => {
    Linking.canOpenURL(item.link)
      .then(() => Linking.openURL(item.link))
      .catch(error => reportError(error, 'openLink_Discover.tsx'));
  };

  const renderArticleCard = ({ item }: { item: HealthArticle }) => (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => openLink(item)}
      android_ripple={{ color: colors.NAVY_BLUE }}>

      {/* Cover image */}
      {!!item.image && (
        <Image
          source={{ uri: item.image }}
          style={styles.cardImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.cardBody}>
        {/* Heading */}
        <Text style={styles.cardHeading} numberOfLines={2}>
          {item.heading}
        </Text>

        {/* Details */}
        {!!item.details && (
          <Text style={styles.cardDetails} numberOfLines={3}>
            {item.details}
          </Text>
        )}

        {/* Footer: author + read more */}
        <View style={styles.cardFooter}>
          {!!item.author && (
            <View style={styles.authorRow}>
              <Ionicons name="person-circle-outline" size={14} color={colors.SLATE_BLUE} />
              <Text style={styles.authorText}>{item.author}</Text>
            </View>
          )}
          <View style={styles.readMoreRow}>
            <Text style={styles.readMoreText}>Read more</Text>
            <Ionicons name="arrow-forward" size={12} color={colors.LIGHT_YELLOW} />
          </View>
        </View>
      </View>
    </Pressable>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📰</Text>
      <Text style={styles.emptyTitle}>No articles yet</Text>
      <Text style={styles.emptySubtitle}>Check back soon for health tips and reads</Text>
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
          data={articles}
          keyExtractor={(item: HealthArticle) => `${item.id}`}
          renderItem={renderArticleCard}
          ListEmptyComponent={renderEmpty}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Text style={styles.screenTitle}>Discover</Text>
              <Text style={styles.screenSubtitle}>Health reads curated for you</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          windowSize={10}
          initialNumToRender={5}
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
  listHeader: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 20,
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
  listContent: {
    paddingBottom: 32,
    gap: 16,
  },
  // Card
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
  cardImage: {
    width: '100%',
    height: 180,
    backgroundColor: colors.DEEP_MIDNIGHT,
  },
  cardBody: {
    padding: 16,
    gap: 8,
  },
  cardHeading: {
    color: colors.WHITE,
    ...fonts.PoppinsSemiBold(15),
    lineHeight: 22,
  },
  cardDetails: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(13),
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  authorText: {
    color: colors.SLATE_BLUE,
    ...fonts.PoppinsRegular(11),
  },
  readMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readMoreText: {
    color: colors.LIGHT_YELLOW,
    ...fonts.PoppinsMedium(12),
  },
  // Empty state
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
