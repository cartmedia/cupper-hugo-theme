import React, { useState } from 'react';
import {View, Text, StyleProp, TouchableOpacityProps, TouchableOpacity, ViewProps} from 'react-native';
import { tw } from 'Tailwind';

interface IProps extends TouchableOpacityProps {
  title: string;
  style?: StyleProp<ViewProps>;
}

export const Button = ({title, style, ...props}: IProps) => {
  let [isHovered, setIsHovered] = useState(false)

  let bgColor = isHovered ? 'bg-blue-500' : 'bg-cyan'

  return (
    <TouchableOpacity 
      {...props}
      // @ts-ignore
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <View style={[tw(`${bgColor} rounded p-3 w-24 items-center`), style]}>
        <Text style={tw('text-white')}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};
