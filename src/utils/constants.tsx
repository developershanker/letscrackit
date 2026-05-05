import { Dimensions } from "react-native";

export const winWidth = Dimensions.get("window").width;
export const winHeight = Dimensions.get("window").height;

export const colors = {
  BLACK: '#000000',
  LIGHT_YELLOW: '#F5D184',
  WHITE: '#ffffff',
  APP_COLOR: '#010e24',
  APP_COLOR_LIGHT: '#b6c2d6',
  DARK_GREY: '#363738',
  CARD_BACKGROUND: '#0d1e35',
  BORDER_COLOR: '#1c3150',
  PLACEHOLDER: '#4a6080',
  DEEP_BLUE: '#1a2d4a',
  BORDER_MEDIUM: '#2a4060',
  DROPDOWN_BACKGROUND: '#162840',
  GOOGLE_BLUE: '#4285F4',
  NEAR_BLACK: '#1a1a1a',
  BMI_UNDERWEIGHT: '#60a5fa',
  BMI_NORMAL: '#4ade80',
  BMI_OVERWEIGHT: '#facc15',
  BMI_OBESE: '#f87171',
  DANGER_BORDER: '#2a1a1a',
  PAGE_BACKGROUND: '#0d1e38',
  CARD_LIGHT_BLUE: '#1e3a5f',
};

export const fontsNames = {
  RUBIK_REGULAR: 'Rubik-Regular',
  RUBIK_BOLD: 'Rubik-Bold',
  RUBIK_BOLD_ITALIC: 'Rubik-BoldItalic',
  RUBIK_EXTRA_BOLD: 'Rubik-ExtraBold',
  RUBIK_EXTRA_BOLD_ITALIC: 'Rubik-ExtraBoldItalic',
  RUBIK_LIGHT: 'Rubik-Light',
  RUBIK_LIGHT_ITALIC: 'Rubik-LightItalic',
  RUBIK_MEDIUM: 'Rubik-Medium',
  RUBIK_MEDIUM_ITALIC: 'Rubik-MediumItalic',
  RUBIK_SEMIBOLD: 'Rubik-SemiBold',
  RUBIK_SEMIBOLD_ITALIC: 'Rubik-SemiBoldItalic',
  SCHOLARLY_AMBITION_REGULAR: 'ScholarlyAmbitionRegular',
  SHORTBABY: 'ShortBaby',
  POPPINS_BOLD: 'Poppins-Bold',
  POPPINS_SEMIBOLD: 'Poppins-SemiBold',
  POPPINS_MEDIUM: 'Poppins-Medium',
  POPPINS_REGULAR: 'Poppins-Regular',
  POPPINS_LIGHT: 'Poppins-Light',
};

const Fonts = {
  RubikBold: (s = 12) => {
    return {
      fontFamily: fontsNames.RUBIK_BOLD,
      fontSize: s,
    };
  },
  RubikSemiBold: (s = 12) => {
    return {
      fontFamily: fontsNames.RUBIK_SEMIBOLD,
      fontSize: s,
    };
  },
  RubikRegular: (s = 12) => {
    return {
      fontFamily: fontsNames.RUBIK_REGULAR,
      fontSize: s,
    };
  },
  RubikMedium: (s = 12) => {
    return {
      fontFamily: fontsNames.RUBIK_MEDIUM,
      fontSize: s,
    };
  },
  PoppinsBold: (s = 12) => {
    return {
      fontFamily: fontsNames.POPPINS_BOLD,
      fontSize: s,
    };
  },
  PoppinsSemiBold: (s = 12) => {
    return {
      fontFamily: fontsNames.POPPINS_SEMIBOLD,
      fontSize: s,
    };
  },
  PoppinsRegular: (s = 12) => {
    return {
      fontFamily: fontsNames.POPPINS_REGULAR,
      fontSize: s,
    };
  },
  PoppinsMedium: (s = 12) => {
    return {
      fontFamily: fontsNames.POPPINS_MEDIUM,
      fontSize: s,
    };
  },
  PoppinsLight: (s = 12) => {
    return {
      fontFamily: fontsNames.POPPINS_LIGHT,
      fontSize: s,
    };
  },
  RubicItalics: (s = 12) => {
    return {
      fontFamily: fontsNames.RUBIK_LIGHT_ITALIC,
      fontSize: s,
    };
  },
};

export const fonts = {
  ...Fonts,
};
