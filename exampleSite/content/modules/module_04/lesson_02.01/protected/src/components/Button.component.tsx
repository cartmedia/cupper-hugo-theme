import React from 'react';
import {View, Text, StyleProp, TouchableOpacityProps, TouchableOpacity, ViewProps} from 'react-native';
import { tw } from 'Tailwind';

interface IProps extends TouchableOpacityProps {
  title: string;
  style?: StyleProp<ViewProps>;
}

export const Button = ({title, style, ...props}: IProps) => {
  return (
    <TouchableOpacity 
      {...props} 
      // @ts-ignore
      enableFocusRing={false}
    >
      <View style={[tw('bg-cyan rounded p-3 w-24'), style]}>
        <Text style={tw('text-white')}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};
