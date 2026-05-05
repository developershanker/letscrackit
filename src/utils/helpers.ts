import remoteConfig from '@react-native-firebase/remote-config';
import crashlytics from '@react-native-firebase/crashlytics';
import {colors} from './constants';
import {LMS_BOYS, LMS_GIRLS} from './lms_data';

export const initiateFirebaseConfig = async () => {
  await remoteConfig().activate();
  const areFirebaseKeysAvailable = !!Object.keys(remoteConfig().getAll())
    .length;
  if (!areFirebaseKeysAvailable) {
    try {
      await remoteConfig().fetchAndActivate();
    } catch (error) {
      reportError(error, "initiateFirebaseConfig_helpers.ts")
      try {
        await remoteConfig().setDefaults({
          DEMO_KEY: 'Default key',
        });
        await remoteConfig().activate();
      } catch (error) {
        reportError(error, "initiateFirebaseConfig_helpers.ts")
      }
    }
  }

  await fetchAndActivateAlongWithUpdateListener();
};

export const fetchAndActivateAlongWithUpdateListener = async () => {
  try {
    remoteConfig().onConfigUpdated(() => {
      remoteConfig()
        .activate()
        .then(async () => {
          await remoteConfig().fetchAndActivate();
        });
    });
  } catch (error) {
    reportError(error, "fetchAndActivateAlongWithUpdateListener_helpers.ts");
  }
};

export const firebaseRemoteConfigData = async (keyName: string) => {
  try {
    const value = remoteConfig().getValue(keyName);
    const raw = value?.asString(); // Safely get string
    return JSON.parse(raw); // ✅ Parse JSON
  } catch (e) {
    console.error('Failed to parse remote config JSON', e);
    return null;
  }
};

export const capitalizeWords = (str: string): string => {
  return str?.toLowerCase()?.split(' ')?.map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1))?.join(' ');
};


export const reportError = (error: unknown, context?: string): void => {
  const err = error instanceof Error ? error : new Error(String(error));
  if (context) crashlytics().setAttribute('context', context);
  crashlytics().recordError(err);
};

const BMI_RANGES = [
  {max: 18.5, category: 'Underweight',  color: colors.SKY_BLUE},
  {max: 25,   category: 'Normal weight', color: colors.MINT_GREEN},
  {max: 30,   category: 'Overweight',   color: colors.AMBER},
  {max: Infinity, category: 'Obese',    color: colors.CORAL},
];

export const getBMIInfo = (bmi: number) =>
  BMI_RANGES.find(range => bmi < range?.max)!;

// ─── Age helpers ─────────────────────────────────────────────────────────────

export const getAgeInYears = (dob: string, entryDate: Date): number => {
  const birth = new Date(dob);
  return (entryDate.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
};

export const getAgeInMonths = (dob: string, entryDate: Date): number => {
  const birth = new Date(dob);
  const years = entryDate.getFullYear() - birth.getFullYear();
  const months = entryDate.getMonth() - birth.getMonth();
  return years * 12 + months;
};

// ─── Adult path: Deurenberg body fat % ───────────────────────────────────────

export const calcBodyFatPct = (
  bmi: number,
  ageYears: number,
  sex: 'male' | 'female',
): number => {
  const sexFactor = sex === 'male' ? 1 : 0;
  const pct = 1.20 * bmi + 0.23 * ageYears - 10.8 * sexFactor - 5.4;
  return parseFloat(pct.toFixed(1));
};

const BODY_FAT_RANGES = {
  male:   [
    { max: 8,        category: 'Underweight', color: colors.SKY_BLUE },
    { max: 20,       category: 'Healthy',     color: colors.MINT_GREEN },
    { max: 25,       category: 'Overweight',  color: colors.AMBER },
    { max: Infinity, category: 'Obese',       color: colors.CORAL },
  ],
  female: [
    { max: 13,       category: 'Underweight', color: colors.SKY_BLUE },
    { max: 26,       category: 'Healthy',     color: colors.MINT_GREEN },
    { max: 32,       category: 'Overweight',  color: colors.AMBER },
    { max: Infinity, category: 'Obese',       color: colors.CORAL },
  ],
};

export const getBodyFatCategory = (pct: number, sex: 'male' | 'female') =>
  BODY_FAT_RANGES[sex].find(r => pct < r.max)!;

// ─── Teen path: CDC BMI-for-age percentile ───────────────────────────────────

// Abramowitz & Stegun approximation — max error < 7.5e-8
const normCDF = (z: number): number => {
  if (z < -6) return 0;
  if (z >  6) return 1;
  const coeffs = [0.319381530, -0.356563782, 1.781477937, -1.821255978, 1.330274429];
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  let poly = 0;
  let tPow = t;
  for (const c of coeffs) { poly += c * tPow; tPow *= t; }
  const pdf = Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
  const cdf = 1 - pdf * poly;
  return z >= 0 ? cdf : 1 - cdf;
};

export const calcBMIPercentile = (
  bmi: number,
  ageMonths: number,
  sex: 'male' | 'female',
): number => {
  const table = sex === 'male' ? LMS_BOYS : LMS_GIRLS;
  const entry = table.reduce((prev, curr) =>
    Math.abs(curr.ageMonths - ageMonths) < Math.abs(prev.ageMonths - ageMonths) ? curr : prev,
  );
  const { L, M, S } = entry;
  const z = L !== 0
    ? (Math.pow(bmi / M, L) - 1) / (L * S)
    : Math.log(bmi / M) / S;
  return Math.min(99, Math.max(1, Math.round(normCDF(z) * 100)));
};

export const getPercentileCategory = (percentile: number) => {
  if (percentile <  5) return { category: 'Underweight', color: colors.SKY_BLUE };
  if (percentile < 85) return { category: 'Healthy',     color: colors.MINT_GREEN };
  if (percentile < 95) return { category: 'Overweight',  color: colors.AMBER };
  return                      { category: 'Obese',       color: colors.CORAL };
};

// ─── Shared metric formatter ─────────────────────────────────────────────────

export const formatBMIMetric = (
  method: 'bodyFat' | 'percentile' | 'simple',
  metric: number | null,
): string | null => {
  if (metric == null || method === 'simple') return null;
  if (method === 'bodyFat') return `${metric}%`;
  const suffix = metric === 11 || metric === 12 || metric === 13 ? 'th'
    : metric % 10 === 1 ? 'st'
    : metric % 10 === 2 ? 'nd'
    : metric % 10 === 3 ? 'rd' : 'th';
  return `${metric}${suffix}`;
};

export const BMI_METHOD_LABEL: Record<'bodyFat' | 'percentile' | 'simple', string> = {
  bodyFat:    'Body Fat',
  percentile: 'Percentile',
  simple:     '',
};

// ─── Router: picks method based on age ───────────────────────────────────────

export interface AgeAwareBMIResult {
  method: 'bodyFat' | 'percentile';
  metric: number;      // body fat % for adults, percentile for teens
  category: string;
  color: string;
}

export const calcAgeAwareBMI = (
  bmi: number,
  dob: string,
  entryDate: Date,
  sex: 'male' | 'female',
): AgeAwareBMIResult => {
  const ageYears = getAgeInYears(dob, entryDate);

  if (ageYears < 20) {
    const ageMonths  = getAgeInMonths(dob, entryDate);
    const percentile = calcBMIPercentile(bmi, ageMonths, sex);
    const { category, color } = getPercentileCategory(percentile);
    return { method: 'percentile', metric: percentile, category, color };
  }

  const bodyFatPct = calcBodyFatPct(bmi, ageYears, sex);
  const { category, color } = getBodyFatCategory(bodyFatPct, sex);
  return { method: 'bodyFat', metric: bodyFatPct, category, color };
};