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
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
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

  const isValid = phone.trim().length >= 10;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* Header */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
          <Text style={styles.backArrowText}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerSection}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>📱</Text>
          </View>
          <Text style={styles.title}>Enter your number</Text>
          <Text style={styles.subtitle}>
            We'll send a 6-digit OTP to verify your phone number
          </Text>
        </View>

        {/* Phone input */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Phone number</Text>
          <View style={styles.inputRow}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="10-digit mobile number"
              placeholderTextColor={colors.SLATE_BLUE}
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
              returnKeyType="send"
              onSubmitEditing={handleSendOtp}
            />
          </View>
          <Text style={styles.inputHint}>India (+91) only. Include country code for other regions.</Text>
        </View>

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.LIGHT_YELLOW} />
            <Text style={styles.loaderText}>Sending OTP…</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.sendButton, !isValid && styles.sendButtonDisabled]}
            onPress={handleSendOtp}
            activeOpacity={0.85}>
            <Text style={styles.sendButtonText}>Send OTP</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
          <Text style={styles.backLinkText}>← Back to login</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.MIDNIGHT_NAVY,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  backArrow: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    marginBottom: 8,
  },
  backArrowText: {
    color: colors.WHITE,
    fontSize: 24,
  },
  headerSection: {
    marginBottom: 36,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.DARK_NAVY,
    borderWidth: 1,
    borderColor: colors.NAVY_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconEmoji: {
    fontSize: 26,
  },
  title: {
    color: colors.WHITE,
    ...fonts.PoppinsBold(26),
    marginBottom: 8,
  },
  subtitle: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(14),
    lineHeight: 22,
  },
  inputWrapper: {
    marginBottom: 24,
  },
  inputLabel: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsMedium(12),
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  countryCode: {
    backgroundColor: colors.DARK_NAVY,
    borderWidth: 1.5,
    borderColor: colors.NAVY_BLUE,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 14,
  },
  countryCodeText: {
    color: colors.WHITE,
    ...fonts.PoppinsMedium(16),
  },
  input: {
    flex: 1,
    backgroundColor: colors.DARK_NAVY,
    borderWidth: 1.5,
    borderColor: colors.NAVY_BLUE,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 16,
    color: colors.WHITE,
    ...fonts.PoppinsRegular(16),
  },
  inputHint: {
    color: colors.SLATE_BLUE,
    ...fonts.PoppinsRegular(11),
    lineHeight: 16,
  },
  loaderContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    gap: 10,
  },
  loaderText: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(14),
  },
  sendButton: {
    backgroundColor: colors.LIGHT_YELLOW,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.LIGHT_YELLOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: colors.MIDNIGHT_NAVY,
    ...fonts.PoppinsSemiBold(16),
  },
  backLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  backLinkText: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(14),
  },
});