import {
    BackHandler,
    SafeAreaView,
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
  import * as React from 'react';
  import {useEffect, useState} from 'react';
  import Header from './components/Header';
  import {colors, fonts} from './utils/constants';
  import {useNavigation} from '@react-navigation/native';
  import {capitalizeWords} from './utils/helpers';
  import {useSelector} from 'react-redux';
  import {selectUserData} from './store/selectors/userSelectors';
  import {addBMIEntry, getBMIHistory} from './utils/api';
  import { useDispatch } from 'react-redux';
import { setUserPhysicalData } from './store/slices/userSlice';
  
  export const AddDetails: React.FC = () => {
    const navigation = useNavigation();
    const userData: any = useSelector(selectUserData);
    const dispatch = useDispatch();
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
  
    useEffect(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBack);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBack);
      };
    }, []);
  
    const handleBack = () => {
      BackHandler.exitApp();
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
        Alert.alert('Success', 'BMI entry saved successfully!');
        const bmiHistory = await getBMIHistory();
        dispatch(setUserPhysicalData(bmiHistory));
        setWeight('');
        setHeight('');
        navigation.goBack();
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to save BMI entry.');
      }
    };
  
    return (
      <SafeAreaView style={styles.homeContainer}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1}}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.headingText}>{capitalizeWords('Add Details')}</Text>
            <Text style={styles.headingText2}>
              {capitalizeWords('Add your details to get started')}
            </Text>
  
            <View style={styles.addDetailsContainer}>
              <Text style={styles.addDetailsText}>Weight (kg)</Text>
              <TextInput
                style={styles.addDetailsInput}
                placeholder="Enter your weight in kg"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholderTextColor={colors.APP_COLOR_LIGHT}
              />
            </View>
  
            <View style={styles.addDetailsContainer}>
              <Text style={styles.addDetailsText}>Height (cm)</Text>
              <TextInput
                style={styles.addDetailsInput}
                placeholder="Enter your height in cm"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                placeholderTextColor={colors.APP_COLOR_LIGHT}
              />
            </View>
          </ScrollView>
  
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Details</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    homeContainer: {
      flex: 1,
      backgroundColor: colors.APP_COLOR,
    },
    scrollContainer: {
      paddingBottom: 100,
    },
    headingText: {
      ...fonts.RubicItalics(20),
      color: colors.WHITE,
      textAlign: 'center',
      width: '86%',
      alignSelf: 'center',
      lineHeight: 24,
      marginTop: 20,
    },
    headingText2: {
      ...fonts.RubikSemiBold(20),
      color: colors.WHITE,
      textAlign: 'center',
      width: '86%',
      alignSelf: 'center',
      padding: 16,
    },
    addDetailsContainer: {
      marginHorizontal: 24,
      marginTop: 16,
    },
    addDetailsText: {
      ...fonts.RubikSemiBold(16),
      color: colors.WHITE,
      marginBottom: 8,
    },
    addDetailsInput: {
      backgroundColor: colors.WHITE,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: colors.APP_COLOR,
      ...fonts.RubikSemiBold(16),
    },
    saveButton: {
      backgroundColor: colors.WHITE,
      paddingVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 24,
      borderRadius: 8,
      marginBottom: 20,
    },
    saveButtonText: {
      color: colors.APP_COLOR,
      ...fonts.RubikSemiBold(18),
    },
  });
  