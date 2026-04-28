import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
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
      // Save email locally so we can complete sign-in when the link opens the app
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
      <View style={styles.container}>
        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.subtitle}>
          We sent a sign-in link to{'\n'}
          <Text style={styles.highlight}>{email}</Text>
          {'\n\n'}Open the link on this device to sign in.
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
          <Text style={styles.backLinkText}>Back to login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.title}>Sign in with Email</Text>
      <Text style={styles.subtitle}>We'll send a magic link — no password needed</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor={colors.APP_COLOR_LIGHT}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.WHITE} style={styles.loader} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSend}>
          <Text style={styles.buttonText}>Send Magic Link</Text>
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
    lineHeight: 22,
  },
  highlight: {
    color: colors.WHITE,
    ...fonts.PoppinsMedium(14),
  },
  input: {
    backgroundColor: '#1a2d4a',
    borderWidth: 1,
    borderColor: '#2a4060',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: colors.WHITE,
    ...fonts.PoppinsRegular(16),
    marginBottom: 24,
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
  loader: { marginTop: 4 },
  backLink: { marginTop: 24, alignItems: 'center' },
  backLinkText: {
    color: colors.APP_COLOR_LIGHT,
    ...fonts.PoppinsRegular(14),
  },
});