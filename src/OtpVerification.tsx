import React, { useRef, useState } from 'react';
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
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import { colors, fonts } from './utils/constants';
import { verifyPhoneOtp, sendPhoneOtp, getBMIHistory } from './utils/api';
import { setUserData, setUserPhysicalData } from './store/slices/userSlice';
import { RootStackParamList } from '../App';

type OtpRoute = RouteProp<RootStackParamList, 'OtpVerification'>;

const OTP_LENGTH = 6;

export const OtpVerification: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<OtpRoute>();
  const dispatch = useDispatch();
  const { confirmation, phoneNumber } = route.params;

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [currentConfirmation, setCurrentConfirmation] =
    useState<FirebaseAuthTypes.ConfirmationResult>(confirmation);

  const inputs = useRef<(TextInput | null)[]>([]);

  const handleDigitChange = (text: string, index: number) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(-1);
    const updated = [...digits];
    updated[index] = cleaned;
    setDigits(updated);
    if (cleaned && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otp = digits.join('');
    if (otp.length < OTP_LENGTH) {
      Alert.alert('Incomplete OTP', 'Please enter all 6 digits.');
      return;
    }
    setIsLoading(true);
    try {
      const user = await verifyPhoneOtp(currentConfirmation, otp);
      dispatch(setUserData(user));
      const physicalData = await getBMIHistory();
      dispatch(setUserPhysicalData(physicalData));
      navigation.navigate('TabBar');
    } catch (e: any) {
      Alert.alert('Invalid OTP', e?.message ?? 'The OTP entered is incorrect. Please try again.');
      setDigits(Array(OTP_LENGTH).fill(''));
      inputs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const newConfirmation = await sendPhoneOtp(phoneNumber);
      setCurrentConfirmation(newConfirmation);
      setDigits(Array(OTP_LENGTH).fill(''));
      inputs.current[0]?.focus();
      Alert.alert('OTP Sent', 'A new OTP has been sent to your number.');
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to resend OTP.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to{'\n'}
        <Text style={styles.phone}>{phoneNumber}</Text>
      </Text>

      <View style={styles.otpRow}>
        {digits.map((digit, i) => (
          <TextInput
            key={i}
            ref={ref => { inputs.current[i] = ref; }}
            style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
            value={digit}
            onChangeText={text => handleDigitChange(text, i)}
            onKeyPress={e => handleKeyPress(e, i)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
          />
        ))}
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.WHITE} style={styles.loader} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleVerify}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      )}

      <View style={styles.resendRow}>
        <Text style={styles.resendLabel}>Didn't receive it? </Text>
        {isResending ? (
          <ActivityIndicator size="small" color={colors.LIGHT_YELLOW} />
        ) : (
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendLink}>Resend OTP</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
        <Text style={styles.backLinkText}>Change number</Text>
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
    marginBottom: 36,
    lineHeight: 22,
  },
  phone: {
    color: colors.WHITE,
    ...fonts.PoppinsMedium(14),
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  otpBox: {
    width: 46,
    height: 56,
    borderWidth: 1.5,
    borderColor: '#2a4060',
    borderRadius: 10,
    backgroundColor: '#1a2d4a',
    color: colors.WHITE,
    textAlign: 'center',
    ...fonts.PoppinsBold(22),
  },
  otpBoxFilled: {
    borderColor: colors.LIGHT_YELLOW,
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
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  resendLabel: {
    color: colors.APP_COLOR_LIGHT,
    ...fonts.PoppinsRegular(14),
  },
  resendLink: {
    color: colors.LIGHT_YELLOW,
    ...fonts.PoppinsMedium(14),
  },
  backLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  backLinkText: {
    color: colors.APP_COLOR_LIGHT,
    ...fonts.PoppinsRegular(14),
  },
});