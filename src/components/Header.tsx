// @ts-ignore
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import {colors, fonts} from '../utils/constants';
import DynamicIcon from '../icons/iconsList';

interface HeaderProps {
  headingTitle?: string;
  leftIconName?: string;
  rightIconName?: string;
  leftIconSize?: number;
  rightIconSize?: number;
  onPressRightIcon?: () => void;
  onPressLeftIcon?: () => void;
  leftIconImage?: string
}

const Header: React.FC<HeaderProps> = props => {
  const {
    leftIconName,
    headingTitle,
    rightIconName,
    leftIconSize,
    rightIconSize,
    onPressRightIcon,
    onPressLeftIcon,
    leftIconImage
  } = props;
  return (
    <View style={styles.viewContainer}>
      <TouchableOpacity style={styles.leftIconStyles} onPress={onPressLeftIcon}>
        {leftIconName ? (
          <DynamicIcon name={leftIconName} size={leftIconSize || 40} />
        ) : leftIconImage ? (
           <Image source={{ uri: leftIconImage }} style={styles.profileImage} />
        ) : null}
      </TouchableOpacity>
      <Text style={styles.headerStyles}>{headingTitle || ''}</Text>
      <TouchableOpacity
        style={styles.rightIconStyles}
        onPress={onPressRightIcon}>
        {rightIconName ? (
          <DynamicIcon name={rightIconName} size={rightIconSize || 40} />
        ) : null}
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  viewContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  leftIconStyles: {width: '33%', alignItems: 'flex-start'},
  rightIconStyles: {width: '33%', alignItems: 'flex-end'},
  headerStyles: {
    ...fonts.PoppinsSemiBold(16),
    width: '33%',
    color: colors.WHITE,
    alignItems: 'center',
    textAlign: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.APP_COLOR,
  },
});
export default React.memo(Header);
