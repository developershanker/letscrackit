import DeviceInfo from 'react-native-device-info';

export const APP_VERSION  = DeviceInfo.getVersion();     // reads versionName from build.gradle
export const BUILD_NUMBER = DeviceInfo.getBuildNumber();  // reads versionCode from build.gradle
