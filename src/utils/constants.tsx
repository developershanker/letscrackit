import { Dimensions } from "react-native";

export const winWidth = Dimensions.get("window").width;
export const winHeight = Dimensions.get("window").height;

export const colors = {
  BLACK: '#000000',
  WHITE: '#ffffff',
  DARK_GREY: '#363738',
  CHARCOAL: '#1a1a1a',
  LIGHT_YELLOW: '#F5D184',
  MIDNIGHT_NAVY: '#010e24',
  DEEP_NAVY: '#0d1e38',
  DARK_NAVY: '#0d1e35',
  DEEP_MIDNIGHT: '#162840',
  DARK_OCEAN: '#1a2d4a',
  NAVY_BLUE: '#1c3150',
  OCEAN_NAVY: '#2a4060',
  COBALT_BLUE: '#1e3a5f',
  SLATE_BLUE: '#4a6080',
  POWDER_BLUE: '#b6c2d6',
  CORNFLOWER_BLUE: '#4285F4',
  SKY_BLUE: '#60a5fa',
  MINT_GREEN: '#4ade80',
  AMBER: '#facc15',
  CORAL: '#f87171',
  DARK_MAROON: '#2a1a1a',
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
