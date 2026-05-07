import {BackHandler, FlatList, Linking, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import * as React from 'react';
import {useEffect} from 'react';
import {colors, fonts} from './utils/constants';
import {useNavigation} from '@react-navigation/native';
import Header from './components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { firebaseRemoteConfigData, reportError } from './utils/helpers';
import { HealthArticle } from './utils/types';

export const Discover: React.FC = () => {
  const navigation = useNavigation();
  const [articles, setArticles] = React.useState<HealthArticle[]>([])
  
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBack
      );
    fetchArticles();
    return () => subscription.remove();
  }, []);

  const fetchArticles = async() => {
      const data = await firebaseRemoteConfigData('articles_data');
      setArticles(data)
  }
  const handleBack = () => {
    navigation.goBack();
    return true;
  };

  const renderArticleCard = ({item, index}: {item:HealthArticle, index: number}) =>{
    return(
      <Pressable style={styles.articleCardStyles} onPress={()=>{
        Linking.canOpenURL(item?.link).then(()=>{
          Linking.openURL(item.link)
        }).catch((error)=>{
          reportError(error, 'renderArticleCard_onPress_Discover.tsx')
        })
      }}>
        <Text style={styles.headingText}>
          {item?.heading}
        </Text>
      </Pressable>
    )
  }
  return (
    <SafeAreaView style={styles.homeContainer}>
      <Header
        leftIconName={'chevron-back-outline'}
        leftIconSize={25}
        onPressLeftIcon={handleBack}
      />
      <FlatList data={articles} keyExtractor={(item: HealthArticle)=> `${item?.id}`} 
      renderItem={renderArticleCard} 
      windowSize={20}
      initialNumToRender={5}
      removeClippedSubviews
      contentContainerStyle={styles.articlesContentContainerStyle}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: colors.MIDNIGHT_NAVY,
  },
  headingText: {
    color: colors.LIGHT_YELLOW,
    ...fonts.PoppinsSemiBold(12),
  },
  articleCardStyles:{
    backgroundColor: colors.DEEP_NAVY,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.LIGHT_YELLOW,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: colors.LIGHT_YELLOW,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 10,
    marginHorizontal: 16,
  },
  articlesContentContainerStyle: {gap: 24}
});
