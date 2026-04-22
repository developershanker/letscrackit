// @ts-ignore
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface DynamicIconProps {
  name?: string;
  size?: number;
  color?: string;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({
  name = 'chevron-back-outline',
  size = 30,
  color = '#fff',
}) => {
  return <Ionicons name={name} size={size} color={color} />;
};

export default DynamicIcon;
