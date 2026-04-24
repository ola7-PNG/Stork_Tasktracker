import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts } from '../theme';

const REWARDS = [
  { id: 1, logo: 'sb', brand: 'Starbucks', desc: '$5 gift card for any drink', cost: '500' },
  { id: 2, logo: 'sp', brand: 'Spotify', desc: '1 month Premium free', cost: '1,200' },
  { id: 3, logo: 'nk', brand: 'Nike', desc: '10% off your next order', cost: '1,000' },
  { id: 4, logo: 'sh', brand: 'Sephora', desc: '15% off sitewide', cost: '800' },
  { id: 5, logo: 'ue', brand: 'Uber Eats', desc: '$10 off your next order', cost: '700' },
  { id: 6, logo: 'nx', brand: 'Netflix', desc: '1 month subscription', cost: '1,500' },
];

export default function RewardsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.head}>
          <Text style={styles.title}>
            <Text style={styles.titleItalic}>Rewards</Text>
          </Text>
          <Text style={styles.sub}>Redeem your berries for real-world perks</Text>
        </View>

        {/* Balance banner */}
        <LinearGradient
          colors={[colors.berry, colors.berry80]}
          style={styles.balance}
        >
          <View style={styles.balanceBlob} />
          <Text style={styles.balanceLabel}>YOUR BALANCE</Text>
          <Text style={styles.balanceAmount}>
            1,240
            <Text style={styles.balanceDot}> ·</Text>
          </Text>
          <Text style={styles.balanceSub}>berries earned this month</Text>
        </LinearGradient>

        <View style={styles.sectHead}>
          <Text style={styles.sectTitle}>
            Shop <Text style={styles.sectTitleItalic}>rewards</Text>
          </Text>
          <Pressable hitSlop={6}>
            <Text style={styles.sectLink}>Filter</Text>
          </Pressable>
        </View>

        <View style={styles.grid}>
          {REWARDS.map((r) => (
            <RewardCard
              key={r.id}
              reward={r}
              onPress={() =>
                navigation.navigate('RewardDetail', { reward: r, balance: 1240 })
              }
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function RewardCard({ reward, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && { transform: [{ translateY: -2 }] },
      ]}
    >
      <View style={styles.logo}>
        <Text style={styles.logoText}>{reward.logo}</Text>
      </View>
      <Text style={styles.brand}>{reward.brand}</Text>
      <Text style={styles.desc}>{reward.desc}</Text>
      <View style={styles.costRow}>
        <Text style={styles.cost}>
          {reward.cost}
          <Text style={styles.costLabel}> BRR</Text>
        </Text>
        <View style={styles.go}>
          <Ionicons name="arrow-forward" size={14} color={colors.pink} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  scroll: { paddingHorizontal: 24, paddingBottom: 120 },
  head: { paddingTop: 20, paddingBottom: 18 },
  title: {
    fontFamily: fonts.display,
    fontSize: 38,
    color: colors.berry,
    letterSpacing: -0.5,
  },
  titleItalic: {
    fontFamily: fonts.displayBold,
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.berry60,
    marginTop: 6,
  },
  balance: {
    borderRadius: 28,
    padding: 22,
    marginBottom: 22,
    overflow: 'hidden',
  },
  balanceBlob: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.pink,
    opacity: 0.2,
    top: -60,
    right: -80,
  },
  balanceLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: 11,
    color: colors.pink,
    letterSpacing: 1.8,
    marginBottom: 4,
  },
  balanceAmount: {
    fontFamily: fonts.display,
    fontSize: 48,
    color: colors.white,
    letterSpacing: -0.8,
    lineHeight: 52,
  },
  balanceDot: {
    fontFamily: fonts.displayBold,
    color: colors.pink,
  },
  balanceSub: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.pink,
    opacity: 0.7,
    marginTop: 8,
  },
  sectHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '48.5%',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: 20,
    padding: 16,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.pink50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontFamily: fonts.displayBold,
    fontSize: 18,
    color: colors.berry,
  },
  brand: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.berry,
    marginBottom: 2,
  },
  desc: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.berry60,
    lineHeight: 14,
    marginBottom: 12,
    minHeight: 28,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cost: {
    fontFamily: fonts.displayBold,
    fontSize: 16,
    color: colors.berry,
  },
  costLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 9,
    color: colors.pink,
    letterSpacing: 0.8,
  },
  go: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.berry,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
