import remoteConfig from '@react-native-firebase/remote-config';

export const initiateFirebaseConfig = async () => {
  await remoteConfig().activate();
  const areFirebaseKeysAvailable = !!Object.keys(remoteConfig().getAll())
    .length;
  if (!areFirebaseKeysAvailable) {
    try {
      await remoteConfig().fetchAndActivate();
    } catch (e) {
      console.log('e fetchAndActivate', e);
      try {
        await remoteConfig().setDefaults({
          DEMO_KEY: 'Default key',
        });
        await remoteConfig().activate();
      } catch (e) {
        console.log('e setDefaults', e);
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
    console.log('error fetchAndActivateAlongWithUpdateListener', error);
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

