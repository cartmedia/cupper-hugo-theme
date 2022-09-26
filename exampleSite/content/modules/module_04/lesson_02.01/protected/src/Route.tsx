import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { useDynamic } from 'libs/hooks';
import { tw } from 'Tailwind';
import { BooksContainer } from 'container/Books.container';
import { BookContainer } from 'container/Book.container';
import { useNavigation } from '@react-navigation/native';

export type IRootStackParams = {
  Home: undefined,
  Book: {title: string}
}

let RootStack = createStackNavigator<IRootStackParams>();

export let Routes = () => {
  let dynamic = useDynamic();

  let headerTintColor = dynamic('bg-gray-900', 'bg-gray-200')

  return (
    <RootStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: [
          tw(headerTintColor)
        ]
      }}
    >
      <RootStack.Screen
        name="Home"
        component={BooksContainer}
        options={{
          headerShown: false
        }}
      />
      <RootStack.Screen
        name="Book"
        component={BookContainer}
      />
    </RootStack.Navigator>
  )
}