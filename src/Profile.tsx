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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, fonts } from './utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from './store/selectors/userSelectors';
import { logout } from './store/slices/userSlice';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const Profile: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData: any = useSelector(selectUserData);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => backHandler.remove();
  }, []);

  const handleBack = () => {
    navigation.goBack();
    return true;
  };

  const handleLogout = async() => {
    try {
    // Firebase sign out
    await auth().signOut();

    // Google sign out
    await GoogleSignin.signOut();

    // Clear Redux state
    dispatch(logout());

    console.log('✅ Successfully signed out');
    navigation.replace("Login")
  } catch (error) {
    console.error('❌ Logout failed:', error);
  }
  }

  const renderProfileData = () => {
    return (
      <View style={styles.profileContainer}>
        {userData?.photoURL && (
          <Image source={{ uri: userData?.photoURL }} style={styles.profileImage} />
        )}
        <Text style={styles.userStyles}>{userData?.displayName}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {renderProfileData()}
        </ScrollView>

        <View style={styles.logoutButtonContainer}>
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
    alignItems: 'center',
    flexDirection: 'row',
    padding: 16,
    paddingTop: 32,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.APP_COLOR,
  },
  userStyles: {
    color: 'white',
    ...fonts.PoppinsSemiBold(18),
    marginLeft: 16,
  },
  logoutButtonContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.APP_COLOR,
  },
  logoutButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  logOutText: {
    color: colors.APP_COLOR,
    ...fonts.PoppinsSemiBold(18),
    letterSpacing: 2,
  },
});
