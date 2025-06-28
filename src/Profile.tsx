import React, { useEffect } from 'react';
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from './utils/constants';
import { signInWithGoogle } from './utils/googleLogin';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from './store/slices/userSlice';
import { selectUserData } from './store/selectors/userSelectors';

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

  const handleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      dispatch(setUserData(user));
      console.log('User:', user);
    } catch (e) {
      console.log('Login failed:', e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.homeContainer}>
      <View>
        {userData?.emailVerified ? (
          <View style={styles.profileContainer}>
            {userData?.photoURL && (
              <Image source={{ uri: userData.photoURL }} style={styles.profileImage} />
            )}
            <Text style={styles.userStyles}>{userData?.displayName}</Text>
          </View>
        ) : (
          <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
            <Text style={styles.loginText}>Login with Google</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  homeContainer: {
    flexGrow: 1,
    backgroundColor: colors.APP_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
  },
  loginText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userStyles: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    textAlign: 'center',
  },
  profileContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
  },
});
