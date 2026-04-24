import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts } from '../theme';

const BADGES = [
  { emoji: '🌅', title: 'Early Bird', earned: true },
  { emoji: '🔥', title: 'Streak Starter', earned: true },
  { emoji: '📚', title: 'Bookworm', earned: true },
  { emoji: '🧘', title: 'Zen Master', earned: true },
  { emoji: '💧', title: 'Hydrator', earned: true },
  { emoji: '👟', title: 'Step Machine', earned: true },
  { emoji: '⭐', title: 'Early Adopter', earned: true },
  { emoji: '🎁', title: 'First Reward', earned: true },
  { emoji: '🏆', title: 'Locked', earned: false },
  { emoji: '👑', title: 'Locked', earned: false },
  { emoji: '💎', title: 'Locked', earned: false },
  { emoji: '🌟', title: 'Locked', earned: false },
];

export default function ProfileScreen({ navigation }) {
  const handleLogout = () => {
    // Reset the root stack so back button can't re-enter the app
    navigation.getParent()?.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Settings icon */}
        <View style={styles.topBar}>
          <Pressable style={styles.iconBtn} hitSlop={6}>
            <Ionicons name="settings-outline" size={20} color={colors.berry} />
          </Pressable>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <LinearGradient
            colors={[colors.pink, colors.berry]}
            style={styles.bigAvatar}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.bigAvatarText}>O</Text>
          </LinearGradient>
          <Text style={styles.name}>
            Ola <Text style={styles.nameItalic}>Smolina</Text>
          </Text>
          <View style={styles.levelBadge}>
            <Ionicons name="star" size={11} color={colors.berry} />
            <Text style={styles.levelText}>Level 8 · Berry Champion</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>
              12<Text style={styles.statItalic}>d</Text>
            </Text>
            <Text style={styles.statLabel}>STREAK</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>247</Text>
            <Text style={styles.statLabel}>TASKS DONE</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>
              1.2<Text style={styles.statItalic}>k</Text>
            </Text>
            <Text style={styles.statLabel}>BERRIES</Text>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.sectHead}>
          <Text style={styles.sectTitle}>
            <Text style={styles.sectTitleItalic}>Achievements</Text>
          </Text>
          <Text style={styles.sectLink}>8 of 24</Text>
        </View>

        <View style={styles.badgesGrid}>
          {BADGES.map((b, i) => (
            <View
              key={i}
              style={[
                styles.badge,
                b.earned ? styles.badgeEarned : styles.badgeLocked,
              ]}
            >
              <Text style={styles.badgeEmoji}>{b.emoji}</Text>
            </View>
          ))}
        </View>

        {/* Account section */}
        <View style={[styles.sectHead, { marginTop: 28 }]}>
          <Text style={styles.sectTitle}>Account</Text>
        </View>

        <View style={styles.accountList}>
          <Pressable style={({ pressed }) => [styles.accountRow, pressed && { opacity: 0.7 }]}>
            <View style={styles.accountIcon}>
              <Ionicons name="notifications-outline" size={18} color={colors.berry} />
            </View>
            <Text style={styles.accountText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.berry60} />
          </Pressable>
          <Pressable style={({ pressed }) => [styles.accountRow, pressed && { opacity: 0.7 }]}>
            <View style={styles.accountIcon}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.berry} />
            </View>
            <Text style={styles.accountText}>Privacy &amp; security</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.berry60} />
          </Pressable>
          <Pressable style={({ pressed }) => [styles.accountRow, pressed && { opacity: 0.7 }]}>
            <View style={styles.accountIcon}>
              <Ionicons name="help-circle-outline" size={18} color={colors.berry} />
            </View>
            <Text style={styles.accountText}>Help &amp; support</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.berry60} />
          </Pressable>
        </View>

        {/* Log out */}
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.logoutBtn,
            pressed && { opacity: 0.85 },
          ]}
        >
          <Ionicons name="log-out-outline" size={20} color="#B85278" />
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  scroll: { paddingHorizontal: 24, paddingBottom: 120 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.creamDark,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  bigAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  bigAvatarText: {
    fontFamily: fonts.displayBold,
    color: colors.white,
    fontSize: 36,
  },
  name: {
    fontFamily: fonts.displaySemi,
    fontSize: 26,
    color: colors.berry,
    letterSpacing: -0.5,
  },
  nameItalic: {
    fontFamily: fonts.displayBold,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.pink,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
    marginTop: 10,
  },
  levelText: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.berry,
    letterSpacing: 0.3,
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: 22,
    paddingVertical: 18,
    marginVertical: 16,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.creamDark,
  },
  statNum: {
    fontFamily: fonts.displaySemi,
    fontSize: 26,
    color: colors.berry,
    letterSpacing: -0.5,
  },
  statItalic: {
    fontFamily: fonts.displayBold,
  },
  statLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: 10,
    color: colors.berry60,
    letterSpacing: 1,
    marginTop: 4,
  },
  sectHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 8,
    marginBottom: 14,
  },
  sectTitle: {
    fontFamily: fonts.displaySemi,
    fontSize: 22,
    color: colors.berry,
    letterSpacing: -0.5,
  },
  sectTitleItalic: {
    fontFamily: fonts.displayBold,
  },
  sectLink: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.berry60,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badge: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  badgeEarned: {
    backgroundColor: colors.pink,
    borderColor: colors.pink,
  },
  badgeLocked: {
    backgroundColor: colors.white,
    borderColor: colors.creamDark,
    opacity: 0.4,
  },
  badgeEmoji: {
    fontSize: 24,
  },

  // Account section
  accountList: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 20,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.creamDark,
  },
  accountIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.pink50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountText: {
    flex: 1,
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    color: colors.berry,
  },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FCE4EC',
    borderWidth: 1.5,
    borderColor: '#F5C3D4',
    paddingVertical: 15,
    borderRadius: 100,
    marginTop: 4,
  },
  logoutText: {
    fontFamily: fonts.displayBold,
    fontSize: 15,
    color: '#B85278',
    letterSpacing: 0.2,
  },
});
