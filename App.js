// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Lista from './Lista';
import HomePage from './HomePage';
import AddItemDialog from './AddItemDialog';
import Web from './Web';
import HomePage2 from './HomePage2';
const Stack = createStackNavigator();

export default function App() {
  
  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen name="Lista" component={Lista} />
        <Stack.Screen name="Home" component={HomePage} options={{headerShown: false}} />
        <Stack.Screen name="Second" component={AddItemDialog} />
        <Stack.Screen name="Web" component={Web} />
        <Stack.Screen name="Home2" component={HomePage2} options={{headerShown: false}} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
