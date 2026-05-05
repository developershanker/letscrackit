import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { colors, fonts } from './utils/constants';
import { saveUserProfile } from './utils/api';
import { setUserData } from './store/slices/userSlice';
import { selectUserData } from './store/selectors/userSelectors';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1923 }, (_, i) => String(CURRENT_YEAR - i));
const MONTH_KEYS = Array.from({ length: 12 }, (_, i) => String(i + 1));

const getDaysInMonth = (month: number, year: number): number => {
  if (!month) return 31;
  return new Date(year || CURRENT_YEAR, month, 0).getDate();
};

interface DropdownModalProps {
  visible: boolean;
  data: string[];
  selected: string;
  title: string;
  renderLabel: (val: string) => string;
  onSelect: (val: string) => void;
  onClose: () => void;
}

const DropdownModal: React.FC<DropdownModalProps> = ({
  visible, data, selected, title, renderLabel, onSelect, onClose,
}) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
      <View style={styles.modalBox}>
        <Text style={styles.modalTitle}>{title}</Text>
        <FlatList
          data={data}
          keyExtractor={item => item}
          style={styles.modalList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isSelected = item === selected;
            return (
              <TouchableOpacity
                style={[styles.modalItem, isSelected && styles.modalItemActive]}
                onPress={() => { onSelect(item); onClose(); }}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalItemText, isSelected && styles.modalItemTextActive]}>
                  {renderLabel(item)}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </TouchableOpacity>
  </Modal>
);

export const OnboardingDetails: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector(selectUserData) as any;

  const isEditMode = !!(userData?.dob && userData?.sex);

  // Parse existing DOB into parts if editing
  const initParts = (() => {
    if (!userData?.dob) return { d: '', m: '', y: '' };
    const [y, m, d] = userData.dob.split('-');
    return { d: String(parseInt(d)), m: String(parseInt(m)), y };
  })();

  const [day, setDay] = useState(initParts.d);
  const [month, setMonth] = useState(initParts.m);
  const [year, setYear] = useState(initParts.y);
  const [sex, setSex] = useState<'male' | 'female' | ''>(userData?.sex ?? '');
  const [openDropdown, setOpenDropdown] = useState<'day' | 'month' | 'year' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const daysInMonth = getDaysInMonth(month ? parseInt(month) : 0, year ? parseInt(year) : 0);
  const DAYS = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));

  const isReady = !!(day && month && year && sex);

  const handleMonthSelect = (val: string) => {
    setMonth(val);
    const newMax = getDaysInMonth(parseInt(val), year ? parseInt(year) : 0);
    if (day && parseInt(day) > newMax) setDay('');
  };

  const handleYearSelect = (val: string) => {
    setYear(val);
    const newMax = getDaysInMonth(month ? parseInt(month) : 0, parseInt(val));
    if (day && parseInt(day) > newMax) setDay('');
  };

  const handleSave = async () => {
    const dob = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    setIsLoading(true);
    try {
      await saveUserProfile(dob, sex as 'male' | 'female');
      dispatch(setUserData({ ...userData, dob, sex, profileComplete: true }));
      isEditMode ? navigation.goBack() : navigation.navigate('TabBar' as never);
    } catch {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.headerSection}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>👤</Text>
          </View>
          <Text style={styles.title}>{isEditMode ? 'Update Profile' : 'About You'}</Text>
          <Text style={styles.subtitle}>
            {isEditMode
              ? 'Update your date of birth or biological sex below.'
              : 'We need a few details to give you the most accurate BMI analysis based on your age.'}
          </Text>
        </View>

        {/* Date of Birth */}
        <Text style={styles.sectionLabel}>Date of Birth</Text>
        <View style={styles.dobRow}>
          <TouchableOpacity
            style={[styles.dropdownBtn, styles.dropdownDay]}
            onPress={() => setOpenDropdown('day')}
            activeOpacity={0.8}
          >
            <Text style={[styles.dropdownText, !day && styles.dropdownPlaceholder]}>
              {day || 'Day'}
            </Text>
            <Text style={styles.dropdownArrow}>▾</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dropdownBtn, styles.dropdownMonth]}
            onPress={() => setOpenDropdown('month')}
            activeOpacity={0.8}
          >
            <Text style={[styles.dropdownText, !month && styles.dropdownPlaceholder]}>
              {month ? MONTHS[parseInt(month) - 1] : 'Month'}
            </Text>
            <Text style={styles.dropdownArrow}>▾</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dropdownBtn, styles.dropdownYear]}
            onPress={() => setOpenDropdown('year')}
            activeOpacity={0.8}
          >
            <Text style={[styles.dropdownText, !year && styles.dropdownPlaceholder]}>
              {year || 'Year'}
            </Text>
            <Text style={styles.dropdownArrow}>▾</Text>
          </TouchableOpacity>
        </View>

        {/* Biological Sex */}
        <Text style={[styles.sectionLabel, styles.sexLabel]}>Biological Sex</Text>
        <View style={styles.sexRow}>
          <TouchableOpacity
            style={[styles.sexBtn, sex === 'male' && styles.sexBtnActive]}
            onPress={() => setSex('male')}
            activeOpacity={0.8}
          >
            <Text style={styles.sexEmoji}>♂</Text>
            <Text style={[styles.sexText, sex === 'male' && styles.sexTextActive]}>Male</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sexBtn, sex === 'female' && styles.sexBtnActive]}
            onPress={() => setSex('female')}
            activeOpacity={0.8}
          >
            <Text style={styles.sexEmoji}>♀</Text>
            <Text style={[styles.sexText, sex === 'female' && styles.sexTextActive]}>Female</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.mandatoryNote}>
          Both fields are required for accurate BMI analysis.
        </Text>

      </ScrollView>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[styles.saveButton, (!isReady || isLoading) && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!isReady || isLoading}
          activeOpacity={0.85}
        >
          {isLoading
            ? <ActivityIndicator color={colors.MIDNIGHT_NAVY} />
            : <Text style={styles.saveButtonText}>{isEditMode ? 'Save Changes' : 'Continue'}</Text>
          }
        </TouchableOpacity>
      </View>

      <DropdownModal
        visible={openDropdown === 'day'}
        data={DAYS}
        selected={day}
        title="Select Day"
        renderLabel={v => v}
        onSelect={setDay}
        onClose={() => setOpenDropdown(null)}
      />
      <DropdownModal
        visible={openDropdown === 'month'}
        data={MONTH_KEYS}
        selected={month}
        title="Select Month"
        renderLabel={v => MONTHS[parseInt(v) - 1]}
        onSelect={handleMonthSelect}
        onClose={() => setOpenDropdown(null)}
      />
      <DropdownModal
        visible={openDropdown === 'year'}
        data={YEARS}
        selected={year}
        title="Select Year"
        renderLabel={v => v}
        onSelect={handleYearSelect}
        onClose={() => setOpenDropdown(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.MIDNIGHT_NAVY,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 16,
  },
  headerSection: {
    marginBottom: 32,
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
  sectionLabel: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsMedium(11),
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  sexLabel: {
    marginTop: 28,
  },
  dobRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.DARK_NAVY,
    borderWidth: 1,
    borderColor: colors.NAVY_BLUE,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  dropdownDay: {
    flex: 1,
  },
  dropdownMonth: {
    flex: 2,
  },
  dropdownYear: {
    flex: 1.5,
  },
  dropdownText: {
    color: colors.WHITE,
    ...fonts.PoppinsMedium(14),
    flex: 1,
  },
  dropdownPlaceholder: {
    color: colors.SLATE_BLUE,
  },
  dropdownArrow: {
    color: colors.SLATE_BLUE,
    fontSize: 12,
    marginLeft: 4,
  },
  sexRow: {
    flexDirection: 'row',
    gap: 12,
  },
  sexBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.DARK_NAVY,
    borderWidth: 1,
    borderColor: colors.NAVY_BLUE,
    borderRadius: 10,
    paddingVertical: 16,
  },
  sexBtnActive: {
    borderColor: colors.LIGHT_YELLOW,
    backgroundColor: colors.DEEP_MIDNIGHT,
  },
  sexEmoji: {
    color: colors.POWDER_BLUE,
    fontSize: 18,
  },
  sexText: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsMedium(15),
  },
  sexTextActive: {
    color: colors.LIGHT_YELLOW,
  },
  mandatoryNote: {
    color: colors.SLATE_BLUE,
    ...fonts.PoppinsRegular(12),
    marginTop: 20,
    textAlign: 'center',
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
    opacity: 0.45,
  },
  saveButtonText: {
    color: colors.MIDNIGHT_NAVY,
    ...fonts.PoppinsSemiBold(16),
  },
  // Modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  modalBox: {
    backgroundColor: colors.DARK_OCEAN,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.NAVY_BLUE,
    maxHeight: 360,
    overflow: 'hidden',
  },
  modalTitle: {
    color: colors.WHITE,
    ...fonts.PoppinsSemiBold(15),
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.NAVY_BLUE,
  },
  modalList: {
    paddingVertical: 6,
  },
  modalItem: {
    paddingHorizontal: 20,
    paddingVertical: 13,
  },
  modalItemActive: {
    backgroundColor: colors.NAVY_BLUE,
  },
  modalItemText: {
    color: colors.POWDER_BLUE,
    ...fonts.PoppinsRegular(15),
  },
  modalItemTextActive: {
    color: colors.LIGHT_YELLOW,
    ...fonts.PoppinsMedium(15),
  },
});