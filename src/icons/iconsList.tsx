// @ts-ignore
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '../utils/constants';

interface DynamicIconProps {
  name?: string;
  size?: number;
  color?: string;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({
  name = 'chevron-back-outline',
  size = 30,
  color = colors.WHITE,
}) => {
  return <Ionicons name={name} size={size} color={color} />;
};

export default DynamicIcon;
