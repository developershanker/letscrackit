import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, fonts } from './utils/constants';
import { sendEmailLink } from './utils/api';

export const EmailAuth: React.FC = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed.includes('@')) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }
    setIsLoading(true);
    try {
      await sendEmailLink(trimmed);
      await AsyncStorage.setItem('emailForSignIn', trimmed);
      setSent(true);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to send link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successCard}>
          <View style={styles.successIconCircle}>
            <Text style={styles.successIcon}>✉</Text>
          </View>
          <Text style={styles.title}>Check your inbox</Text>
          <Text style={styles.subtitle}>
            We sent a sign-in link to
          </Text>
          <Text style={styles.emailHighlight}>{email}</Text>
          <Text style={styles.subtitle}>Open the link on this device to sign in.</Text>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back to login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
            <Text style={styles.iconEmoji}>✉</Text>
          </View>
          <Text style={styles.title}>Sign in with Email</Text>
          <Text style={styles.subtitle}>
            We'll send a magic link — no password needed
          </Text>
        </View>

        {/* Input */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Email address</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor=colors.SLATE_BLUE
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
        </View>

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.LIGHT_YELLOW} />
            <Text style={styles.loaderText}>Sending magic link…</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.sendButton, !email.includes('@') && styles.sendButtonDisabled]}
            onPress={handleSend}
            activeOpacity={0.85}>
            <Text style={styles.sendButtonText}>Send Magic Link</Text>
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
  input: {
    backgroundColor: colors.DARK_NAVY,
    borderWidth: 1.5,
    borderColor: colors.NAVY_BLUE,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 16,
    color: colors.WHITE,
    ...fonts.PoppinsRegular(16),
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
  // Success state
  successCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.DARK_NAVY,
    borderWidth: 1.5,
    borderColor: colors.LIGHT_YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successIcon: {
    fontSize: 36,
  },
  emailHighlight: {
    color: colors.LIGHT_YELLOW,
    ...fonts.PoppinsSemiBold(15),
    marginTop: 4,
    marginBottom: 8,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 36,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.NAVY_BLUE,
  },
  backButtonText: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(14),
  },
});