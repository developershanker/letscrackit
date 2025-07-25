import React, { useEffect } from 'react';
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  SafeAreaView,
  Pressable,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, fonts } from './utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData, selectUserPhysicalData } from './store/selectors/userSelectors';
import { logout } from './store/slices/userSlice';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { capitalizeWords, getCategory } from './utils/helpers';

export const Profile: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData: any = useSelector(selectUserData);
  const userPhysicalData: any[] = useSelector(selectUserPhysicalData) ?? [];

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  const handleLogout = async () => {
    try {
      await auth().signOut();
      await GoogleSignin.signOut();
      dispatch(logout());
      console.log('✅ Successfully signed out');
      navigation.replace('Login');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      Alert.alert('Logout Failed', 'Something went wrong while signing out.');
    }
  };

  const renderProfileHeader = () => (
    <View style={styles.profileContainer}>
      {userData?.photoURL ? (
        <Image source={{ uri: userData.photoURL }} style={styles.profileImage} />
      ) : (
        <View style={[styles.profileImage, styles.imageFallback]}>
          <Text style={{ color: colors.APP_COLOR, fontSize: 32 }}>
            {userData?.displayName?.[0]?.toUpperCase() || 'U'}
          </Text>
        </View>
      )}
      <View style={styles.profileTextContainer}>
        <Text style={styles.userStyles}>{capitalizeWords(userData?.displayName)}</Text>
        <Text style={styles.userEmailStyles}>{userData?.email}</Text>
      </View>
    </View>
  );
  const renderBMIBlock = () => {
    const latestEntry = userPhysicalData?.[0];
    const bmi = latestEntry?.bmi;

    return (
      <View style={styles.bmiContainer}>
        <Text style={styles.bmiText}>Body Mass Index</Text>
        <Text style={styles.bmiValueText}>{bmi ?? '--'}</Text>
        <Text style={styles.bmiCategoryText}>{bmi ? getCategory(bmi) : 'No data'}</Text>
      </View>
    );
  };
  const renderAddOrUpdateButton = () => {
    const hasData = userPhysicalData?.length > 0;
    const label = hasData ? 'Update Details' : 'Add Details';
  
    return (
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate('AddDetails')}>
        <Text style={styles.actionButtonText}>{label}</Text>
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
  {renderProfileHeader()}
  {userPhysicalData.length > 0 ? renderBMIBlock() : null}
</ScrollView>

{/* Always show Add/Update button */}
<View style={styles.bottomButtonContainer}>
  {renderAddOrUpdateButton()}
  <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
    <Text style={styles.logOutText}>LOGOUT</Text>
  </TouchableOpacity>
</View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.APP_COLOR,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: colors.APP_COLOR,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageFallback: {
    backgroundColor: 'white',
  },
  profileTextContainer: {
    marginLeft: 16,
    flexDirection: 'column',
    gap: 8,
  },
  userStyles: {
    color: 'white',
    ...fonts.RubikSemiBold(18),
    lineHeight: 24,
  },
  userEmailStyles: {
    color: 'white',
    ...fonts.RubicItalics(16),
  },
  bmiContainer: {
    marginTop: 32,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  bmiText: {
    color: 'white',
    ...fonts.RubikSemiBold(20),
    marginBottom: 8,
  },
  bmiValueText: {
    color: 'white',
    ...fonts.RubikSemiBold(48),
  },
  bmiCategoryText: {
    color: 'white',
    ...fonts.RubikSemiBold(16),
    marginTop: 4,
  },
  addDetailsContainer: {
    marginTop: 40,
    backgroundColor: 'white',
    marginHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  addDetailsText: {
    color: colors.APP_COLOR,
    ...fonts.PoppinsSemiBold(16),
    letterSpacing: 1,
  },
  logoutButtonContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.APP_COLOR,
  },
  logoutButton: {
    backgroundColor: colors.APP_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  logOutText: {
    color: colors.WHITE,
    ...fonts.PoppinsSemiBold(18),
    letterSpacing: 2,
  },
  bottomButtonContainer: {
    padding: 16,
    backgroundColor: colors.APP_COLOR,
  },
  actionButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: colors.APP_COLOR,
    ...fonts.PoppinsSemiBold(16),
  },  
});
