import React, { useEffect } from 'react';
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from './utils/constants';
import { signInWithGoogle } from './utils/googleLogin';

export const Profile: React.FC = () => {
  const navigation = useNavigation();

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
      console.log('User:', user?.email);
    } catch (e) {
      console.log('Login failed:', e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.homeContainer}>
      <View>
        <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
          <Text style={styles.loginText}>Login with Google</Text>
        </TouchableOpacity>
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
});
