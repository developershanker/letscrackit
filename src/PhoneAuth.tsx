import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { colors, fonts } from './utils/constants';
import { sendPhoneOtp } from './utils/api';

export const PhoneAuth: React.FC = () => {
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    const trimmed = phone.trim();
    if (trimmed.length < 10) {
      Alert.alert('Invalid number', 'Please enter a valid phone number.');
      return;
    }

    const fullNumber = trimmed.startsWith('+') ? trimmed : `+91${trimmed}`;

    setIsLoading(true);
    try {
      const confirmation = await sendPhoneOtp(fullNumber);
      navigation.navigate('OtpVerification', { confirmation, phoneNumber: fullNumber });
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.title}>Enter your number</Text>
      <Text style={styles.subtitle}>We'll send a 6-digit OTP to verify your email</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Phone number"
          placeholderTextColor={colors.APP_COLOR_LIGHT}
          keyboardType="phone-pad"
          maxLength={13}
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.WHITE} style={styles.loader} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
          <Text style={styles.buttonText}>Send OTP</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
        <Text style={styles.backLinkText}>Back to login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.APP_COLOR,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  title: {
    color: colors.WHITE,
    ...fonts.PoppinsBold(26),
    marginBottom: 8,
  },
  subtitle: {
    color: colors.APP_COLOR_LIGHT,
    ...fonts.PoppinsRegular(14),
    marginBottom: 32,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  countryCode: {
    backgroundColor: '#1a2d4a',
    borderWidth: 1,
    borderColor: '#2a4060',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginRight: 10,
  },
  countryCodeText: {
    color: colors.WHITE,
    ...fonts.PoppinsMedium(16),
  },
  input: {
    flex: 1,
    backgroundColor: '#1a2d4a',
    borderWidth: 1,
    borderColor: '#2a4060',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: colors.WHITE,
    ...fonts.PoppinsRegular(16),
  },
  button: {
    backgroundColor: colors.LIGHT_YELLOW,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.APP_COLOR,
    ...fonts.PoppinsSemiBold(16),
  },
  loader: {
    marginTop: 4,
  },
  backLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  backLinkText: {
    color: colors.APP_COLOR_LIGHT,
    ...fonts.PoppinsRegular(14),
  },
});