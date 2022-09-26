import React from 'react';
import {Routes} from 'Route';
import {root, StoreProvider} from 'Store';
import {NavigationContainer} from '@react-navigation/native';

export const App = () => {
  return (
    <StoreProvider value={root}>
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </StoreProvider>
  );
};
