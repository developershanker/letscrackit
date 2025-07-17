export const colors = {
  BLACK: '#000000',
  LIGHT_YELLOW: '#F5D184',
  WHITE: '#ffffff',
  APP_COLOR: '#010e24',
  DARK_GREY: '#363738',
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
