// @ts-ignore
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors, fonts} from '../utils/constants';
import DynamicIcon from '../icons/iconsList';

interface HeaderProps {
  headingTitle?: string;
  leftIconName?: string;
  rightIconName?: string;
  onPressRightIcon?: () => void;
  onPressLeftIcon?: () => void;
}

const Header: React.FC<HeaderProps> = props => {
  const {
    leftIconName,
    headingTitle,
    rightIconName,
    onPressRightIcon,
    onPressLeftIcon,
  } = props;
  return (
    <View style={styles.viewContainer}>
      <TouchableOpacity style={styles.leftIconStyles} onPress={onPressLeftIcon}>
        {leftIconName ? <DynamicIcon name={leftIconName} size={40} /> : null}
      </TouchableOpacity>
      <Text style={styles.headerStyles}>{headingTitle || ''}</Text>
      <TouchableOpacity
        style={styles.rightIconStyles}
        onPress={onPressRightIcon}>
        {rightIconName ? <DynamicIcon name={rightIconName} size={40} /> : null}
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
});
export default React.memo(Header);
