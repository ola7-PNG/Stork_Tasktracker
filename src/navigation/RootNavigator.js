import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import RewardDetailScreen from '../screens/RewardDetailScreen';
import FriendProfileScreen from '../screens/FriendProfileScreen';
import AddQuestScreen from '../screens/AddQuestScreen';
import ProofSubmissionScreen from '../screens/ProofSubmissionScreen';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#FAF3EE' },
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen
        name="FriendProfile"
        component={FriendProfileScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="RewardDetail"
        component={RewardDetailScreen}
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="AddQuest"
        component={AddQuestScreen}
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="ProofSubmission"
        component={ProofSubmissionScreen}
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
    </Stack.Navigator>
  );
}
