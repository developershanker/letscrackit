import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, fonts } from './utils/constants';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserData } from './store/selectors/userSelectors';
import { addBMIEntry, getBMIHistory } from './utils/api';
import { setUserPhysicalData } from './store/slices/userSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './components/Header';

export const AddDetails: React.FC = () => {
  const navigation = useNavigation();
  const userData: any = useSelector(selectUserData);
  const dispatch = useDispatch();
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => subscription.remove();
  }, []);

  const handleBack = () => {
    navigation.goBack();
    return true;
  };

  const handleSave = async () => {
    const weightKg = parseFloat(weight);
    const heightCm = parseFloat(height);

    if (isNaN(weightKg) || isNaN(heightCm) || weightKg <= 0 || heightCm <= 0) {
      Alert.alert('Invalid Input', 'Please enter valid numeric values for weight and height.');
      return;
    }

    try {
      await addBMIEntry(weightKg, heightCm);
      Alert.alert('Saved!', 'Your BMI has been updated.');
      const bmiHistory = await getBMIHistory();
      dispatch(setUserPhysicalData(bmiHistory));
      setWeight('');
      setHeight('');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save BMI entry. Please try again.');
    }
  };

  const isReady = weight.trim().length > 0 && height.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>

        {/* Back arrow */}
        <Header
                leftIconName={'chevron-back-outline'}
                leftIconSize={25}
                onPressLeftIcon={handleBack}
              />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.headerSection}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconEmoji}>⚖️</Text>
            </View>
            <Text style={styles.title}>BMI Calculator</Text>
            <Text style={styles.subtitle}>
              Enter your measurements to calculate your Body Mass Index
            </Text>
          </View>

          {/* Inputs */}
          <View style={styles.card}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Weight</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#4a6080"
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={setWeight}
                  returnKeyType="next"
                />
                <View style={styles.unitBadge}>
                  <Text style={styles.unitText}>kg</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Height</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#4a6080"
                  keyboardType="numeric"
                  value={height}
                  onChangeText={setHeight}
                  returnKeyType="done"
                  onSubmitEditing={handleSave}
                />
                <View style={styles.unitBadge}>
                  <Text style={styles.unitText}>cm</Text>
                </View>
              </View>
            </View>
          </View>

          {/* BMI preview */}
          {weight && height && !isNaN(parseFloat(weight)) && !isNaN(parseFloat(height)) && (
            <View style={styles.previewCard}>
              <Text style={styles.previewLabel}>Estimated BMI</Text>
              <Text style={styles.previewValue}>
                {(parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2)).toFixed(1)}
              </Text>
            </View>
          )}

        </ScrollView>

        {/* Save button */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={[styles.saveButton, !isReady && styles.saveButtonDisabled]}
            onPress={handleSave}
            activeOpacity={0.85}>
            <Text style={styles.saveButtonText}>Save Details</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.APP_COLOR,
  },
  backArrow: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    paddingLeft: 20,
    marginTop: 4,
  },
  backArrowText: {
    color: colors.WHITE,
    fontSize: 24,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerSection: {
    marginBottom: 28,
    marginTop: 8,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0d1e35',
    borderWidth: 1,
    borderColor: '#1c3150',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconEmoji: {
    fontSize: 26,
  },
  title: {
    color: colors.WHITE,
    ...fonts.PoppinsBold(26),
    marginBottom: 6,
  },
  subtitle: {
    color: colors.APP_COLOR_LIGHT,
    ...fonts.PoppinsRegular(13),
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#0d1e35',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1c3150',
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 16,
  },
  inputWrapper: {
    paddingVertical: 16,
  },
  inputLabel: {
    color: colors.APP_COLOR_LIGHT,
    ...fonts.PoppinsMedium(11),
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    color: colors.WHITE,
    ...fonts.PoppinsRegular(24),
    padding: 0,
  },
  unitBadge: {
    backgroundColor: '#162840',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#1c3150',
  },
  unitText: {
    color: colors.APP_COLOR_LIGHT,
    ...fonts.PoppinsMedium(14),
  },
  divider: {
    height: 1,
    backgroundColor: '#1c3150',
  },
  previewCard: {
    backgroundColor: '#0d1e35',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1c3150',
    paddingVertical: 20,
    alignItems: 'center',
  },
  previewLabel: {
    color: colors.APP_COLOR_LIGHT,
    ...fonts.PoppinsMedium(11),
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  previewValue: {
    color: colors.LIGHT_YELLOW,
    ...fonts.PoppinsBold(40),
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
  },
  saveButton: {
    backgroundColor: colors.LIGHT_YELLOW,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.LIGHT_YELLOW,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: colors.APP_COLOR,
    ...fonts.PoppinsSemiBold(16),
  },
});