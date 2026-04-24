import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Platform, Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import TodayScreen from '../screens/TodayScreen';
import QuestsScreen from '../screens/QuestsScreen';
import RewardsScreen from '../screens/RewardsScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors, fonts } from '../theme';

const Tab = createBottomTabNavigator();

const ICONS = {
  Today: 'home',
  Quests: 'checkmark-done-circle',
  Rewards: 'gift',
  Friends: 'trophy',
  Profile: 'person',
};

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBarWrap}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const iconName = ICONS[route.name];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabButton
              key={route.key}
              routeName={route.name}
              iconName={iconName}
              isFocused={isFocused}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
}

function TabButton({ routeName, iconName, isFocused, onPress }) {
  const scale = useRef(new Animated.Value(isFocused ? 1.12 : 1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: isFocused ? 1.12 : 1,
      friction: 5,
      tension: 120,
      useNativeDriver: true,
    }).start();
  }, [isFocused]);

  return (
    <Pressable
      onPress={onPress}
      style={[styles.tabBtn, isFocused && styles.tabBtnActive]}
      android_ripple={{ color: colors.pinkTranslucent, borderless: true }}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons
          name={isFocused ? iconName : `${iconName}-outline`}
          size={20}
          color={isFocused ? colors.berry : colors.pink}
        />
      </Animated.View>
      <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
        {routeName}
      </Text>
    </Pressable>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.cream },
      }}
    >
      <Tab.Screen name="Today" component={TodayScreen} />
      <Tab.Screen name="Quests" component={QuestsScreen} />
      <Tab.Screen name="Rewards" component={RewardsScreen} />
      <Tab.Screen name="Friends" component={LeaderboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarWrap: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 16,
    right: 16,
  },
  tabBar: {
    backgroundColor: colors.berry,
    borderRadius: 28,
    padding: 8,
    flexDirection: 'row',
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 2,
    alignItems: 'center',
    borderRadius: 20,
    opacity: 0.5,
  },
  tabBtnActive: {
    backgroundColor: colors.pink,
    opacity: 1,
  },
  tabLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: 10,
    color: colors.pink,
    marginTop: 4,
    letterSpacing: 0.3,
  },
  tabLabelActive: {
    color: colors.berry,
  },
});
