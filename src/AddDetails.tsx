import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, fonts } from './utils/constants';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserData } from './store/selectors/userSelectors';
import { addBMIEntry, getBMIHistory } from './utils/api';
import { setUserPhysicalData } from './store/slices/userSlice';
import { calcAgeAwareBMI, formatBMIMetric, BMI_METHOD_LABEL } from './utils/helpers';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from './components/Header';
import { useHealthData } from './hooks/useHealthData';

export const AddDetails: React.FC = () => {
  const navigation = useNavigation();
  const userData: any = useSelector(selectUserData);
  const dispatch = useDispatch();
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const { status: healthStatus, data: healthData, load: loadHealth } = useHealthData();
  const [showHealthInfo, setShowHealthInfo] = useState(false);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (healthStatus === 'ready') {
      if (healthData.weight) setWeight(String(healthData.weight));
      if (healthData.height) setHeight(String(healthData.height));
    }
  }, [healthStatus, healthData]);

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

          {/* Health info modal */}
          <Modal
            visible={showHealthInfo}
            transparent
            animationType="fade"
            onRequestClose={() => setShowHealthInfo(false)}>
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowHealthInfo(false)}>
              <View style={styles.modalCard}>
                <View style={styles.modalHeader}>
                  <Ionicons name="information-circle-outline" size={20} color={colors.LIGHT_YELLOW} />
                  <Text style={styles.modalTitle}>How to grant health access</Text>
                  <TouchableOpacity onPress={() => setShowHealthInfo(false)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="close" size={20} color={colors.POWDER_BLUE} />
                  </TouchableOpacity>
                </View>

                {Platform.OS === 'android' ? (
                  <>
                    <Text style={styles.modalStep}><Text style={styles.modalStepNum}>1. </Text>Tap <Text style={styles.modalBold}>Import from Health app</Text> above.</Text>
                    <Text style={styles.modalStep}><Text style={styles.modalStepNum}>2. </Text>The <Text style={styles.modalBold}>Health Connect</Text> permission screen will open.</Text>
                    <Text style={styles.modalStep}><Text style={styles.modalStepNum}>3. </Text>Allow <Text style={styles.modalBold}>Weight</Text> and <Text style={styles.modalBold}>Height</Text> to auto-fill your measurements.</Text>
                    <View style={styles.modalDivider} />
                    <Text style={styles.modalNote}>If Health Connect is not installed, install it from the <Text style={styles.modalBold}>Play Store</Text> first.</Text>
                    <Text style={styles.modalNote}>To revoke: <Text style={styles.modalBold}>Settings → Apps → Health Connect → App permissions → LetsCrackIt</Text></Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.modalStep}><Text style={styles.modalStepNum}>1. </Text>Tap <Text style={styles.modalBold}>Import from Health app</Text> above.</Text>
                    <Text style={styles.modalStep}><Text style={styles.modalStepNum}>2. </Text>The <Text style={styles.modalBold}>Health access</Text> dialog will appear.</Text>
                    <Text style={styles.modalStep}><Text style={styles.modalStepNum}>3. </Text>Enable <Text style={styles.modalBold}>Weight</Text> and <Text style={styles.modalBold}>Height</Text>, then tap <Text style={styles.modalBold}>Allow</Text>.</Text>
                    <View style={styles.modalDivider} />
                    <Text style={styles.modalNote}>To revoke: <Text style={styles.modalBold}>Settings → Privacy & Security → Health → LetsCrackIt</Text></Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Import from Health */}
          <View style={styles.healthImportRow}>
            <TouchableOpacity
              style={styles.healthImportBtn}
              onPress={loadHealth}
              activeOpacity={0.8}
              disabled={healthStatus === 'loading'}>
              {healthStatus === 'loading' ? (
                <ActivityIndicator size="small" color={colors.MIDNIGHT_NAVY} />
              ) : (
                <Ionicons name="heart-outline" size={16} color={colors.MIDNIGHT_NAVY} />
              )}
              <Text style={styles.healthImportText}>
                {healthStatus === 'loading'
                  ? 'Reading health data…'
                  : healthStatus === 'ready'
                  ? 'Health data imported'
                  : healthStatus === 'unavailable'
                  ? 'Health not available'
                  : 'Import from Health app'}
              </Text>
              {healthStatus === 'ready' && (
                <Ionicons name="checkmark-circle" size={16} color={colors.MIDNIGHT_NAVY} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowHealthInfo(true)}
              style={styles.healthInfoIcon}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="information-circle-outline" size={20} color={colors.POWDER_BLUE} />
            </TouchableOpacity>
          </View>

          {/* Inputs */}
          <View style={styles.card}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Weight</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor={colors.SLATE_BLUE}
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
                  placeholderTextColor={colors.SLATE_BLUE}
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
          {weight && height && !isNaN(parseFloat(weight)) && !isNaN(parseFloat(height)) && (() => {
            const rawBMI = parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2);
            const preview = userData?.dob && userData?.sex
              ? calcAgeAwareBMI(rawBMI, userData.dob, new Date(), userData.sex)
              : null;
            const metricStr = preview ? formatBMIMetric(preview.method, preview.metric) : null;
            const metricLabel = preview?.method ? BMI_METHOD_LABEL[preview.method] : null;
            return (
              <View style={styles.previewCard}>
                <Text style={styles.previewLabel}>Estimated BMI</Text>
                <Text style={styles.previewValue}>{rawBMI.toFixed(1)}</Text>
                {metricStr != null && metricLabel && (
                  <Text style={styles.previewMetric}>{metricLabel}  {metricStr}</Text>
                )}
              </View>
            );
          })()}

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
    backgroundColor: colors.MIDNIGHT_NAVY,
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
    backgroundColor: colors.DARK_NAVY,
    borderWidth: 1,
    borderColor: colors.NAVY_BLUE,
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
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(13),
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.DARK_NAVY,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.NAVY_BLUE,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 16,
  },
  inputWrapper: {
    paddingVertical: 16,
  },
  inputLabel: {
    color: colors.POWDER_BLUE,
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
    backgroundColor: colors.DEEP_MIDNIGHT,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.NAVY_BLUE,
  },
  unitText: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsMedium(14),
  },
  divider: {
    height: 1,
    backgroundColor: colors.NAVY_BLUE,
  },
  previewCard: {
    backgroundColor: colors.DARK_NAVY,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.NAVY_BLUE,
    paddingVertical: 20,
    alignItems: 'center',
  },
  previewLabel: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsMedium(11),
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  previewValue: {
    color: colors.LIGHT_YELLOW,
    ...fonts.PoppinsBold(40),
  },
  previewMetric: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsMedium(12),
    marginTop: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
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
    color: colors.MIDNIGHT_NAVY,
    ...fonts.PoppinsSemiBold(16),
  },
  healthImportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  healthImportBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.LIGHT_YELLOW,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  healthImportText: {
    color: colors.MIDNIGHT_NAVY,
    ...fonts.PoppinsMedium(13),
  },
  healthInfoIcon: {
    padding: 4,
  },
  // Health info modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: colors.DARK_NAVY,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.NAVY_BLUE,
    padding: 20,
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  modalTitle: {
    flex: 1,
    color: colors.WHITE,
    ...fonts.PoppinsSemiBold(13),
  },
  modalStep: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(13),
    marginBottom: 8,
    lineHeight: 20,
  },
  modalStepNum: {
    color: colors.LIGHT_YELLOW,
    ...fonts.PoppinsSemiBold(13),
  },
  modalBold: {
    color: colors.WHITE,
    ...fonts.PoppinsSemiBold(13),
  },
  modalDivider: {
    height: 1,
    backgroundColor: colors.NAVY_BLUE,
    marginVertical: 12,
  },
  modalNote: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(11),
    marginBottom: 6,
    lineHeight: 18,
    opacity: 0.85,
  },
});