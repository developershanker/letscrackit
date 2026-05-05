import remoteConfig from '@react-native-firebase/remote-config';
import crashlytics from '@react-native-firebase/crashlytics';
import {colors} from './constants';

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