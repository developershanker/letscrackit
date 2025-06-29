import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, fonts } from './utils/constants';
import { signInWithGoogle } from './utils/googleLogin';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from './store/slices/userSlice';

export const Login: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => backHandler.remove();
  }, []);

  const handleBack = () => {
    navigation.goBack();
    return true;
  };

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      const user = await signInWithGoogle();
      dispatch(setUserData(user));
      navigation.navigate("TabBar")
    } catch (e) {
      console.log('Login failed:', e);
    } finally{
      setIsLoading(false)
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.homeContainer}>
      <View>
        {isLoading ? (
          <View style={styles.profileContainer}>
            <ActivityIndicator size={'large'} color={colors.WHITE} />
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
    ...fonts.PoppinsSemiBold(20),
  },
  userStyles: {
    color: 'white',
    ...fonts.PoppinsSemiBold(18),
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
