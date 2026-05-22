import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, fonts } from '../theme';
import { useUserStore } from '../state/userStore';

const BRANDS = [
  { id: 'starbucks', name: 'Starbucks',  emoji: '☕', value: '$5',  cost: 500,  gradient: ['#1E3932', '#0F6638'] },
  { id: 'spotify',   name: 'Spotify',    emoji: '🎵', value: '1mo', cost: 1200, gradient: ['#1DB954', '#0E7B36'] },
  { id: 'nike',      name: 'Nike',       emoji: '👟', value: '10%', cost: 1000, gradient: ['#111111', '#333333'] },
  { id: 'sephora',   name: 'Sephora',    emoji: '💄', value: '15%', cost: 800,  gradient: ['#000000', '#1A1A1A'] },
  { id: 'ubereats',  name: 'Uber Eats',  emoji: '🍔', value: '$10', cost: 700,  gradient: ['#06C167', '#048B49'] },
  { id: 'netflix',   name: 'Netflix',    emoji: '🎬', value: '1mo', cost: 1500, gradient: ['#E50914', '#A50710'] },
];

export default function RewardsScreen({ navigation }) {
  // Live balance from the shared store
  const { berries } = useUserStore();

  // ==== Entrance animations ====
  const heroAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = useRef(BRANDS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(heroAnim, {
          toValue: 1,
          duration: 540,
          useNativeDriver: true,
        }),
        Animated.timing(headerAnim, {
          toValue: 1,
          duration: 540,
          delay: 120,
          useNativeDriver: true,
        }),
      ]),
      Animated.stagger(
        70,
        cardAnims.map((a) =>
          Animated.timing(a, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          })
        )
      ),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.topHead,
            {
              opacity: headerAnim,
              transform: [
                {
                  translateY: headerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [12, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.eyebrow}>YOUR BALANCE</Text>
          <Text style={styles.bigTitle}>
            <Text style={styles.bigTitleItalic}>Spend</Text> your berries
          </Text>
        </Animated.View>

        {/* Hero balance card */}
        <Animated.View
          style={{
            opacity: heroAnim,
            transform: [
              {
                translateY: heroAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [16, 0],
                }),
              },
            ],
          }}
        >
          <LinearGradient colors={[colors.berry, colors.berry80]} style={styles.hero}>
            <View style={styles.heroBlob} />
            <View style={{ flex: 1 }}>
              <Text style={styles.heroLabel}>BERRY BALANCE</Text>
              <Text style={styles.heroBalance}>
                {berries.toLocaleString()}
              </Text>
              <Text style={styles.heroSub}>Earn more by completing quests</Text>
            </View>
            <View style={styles.heroBerryIcon}>
              <Text style={{ fontSize: 36 }}>🫐</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Brand grid */}
        <View style={styles.sectHead}>
          <Text style={styles.sectTitle}>
            <Text style={styles.sectTitleItalic}>Available</Text> rewards
          </Text>
        </View>

        <View style={styles.brandGrid}>
          {BRANDS.map((brand, i) => {
            const canAfford = berries >= brand.cost;
            return (
              <Animated.View
                key={brand.id}
                style={{
                  width: '48%',
                  opacity: cardAnims[i],
                  transform: [
                    {
                      translateY: cardAnims[i].interpolate({
                        inputRange: [0, 1],
                        outputRange: [16, 0],
                      }),
                    },
                    {
                      scale: cardAnims[i].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.94, 1],
                      }),
                    },
                  ],
                }}
              >
                <Pressable
                  onPress={() => navigation.navigate('RewardDetail', { brand })}
                  style={({ pressed }) => [
                    pressed && { transform: [{ scale: 0.97 }] },
                  ]}
                >
                  <LinearGradient colors={brand.gradient} style={styles.brandCard}>
                    <Text style={styles.brandEmoji}>{brand.emoji}</Text>
                    <Text style={styles.brandName}>{brand.name}</Text>
                    <Text style={styles.brandValue}>{brand.value}</Text>
                    <View
                      style={[
                        styles.brandCostPill,
                        !canAfford && styles.brandCostPillDisabled,
                      ]}
                    >
                      <View
                        style={[
                          styles.brandCostDot,
                          !canAfford && { backgroundColor: '#FFB8B8' },
                        ]}
                      />
                      <Text style={styles.brandCostText}>{brand.cost} berries</Text>
                    </View>
                  </LinearGradient>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  scroll: { paddingHorizontal: 24, paddingBottom: 120 },

  topHead: { paddingTop: 12, paddingBottom: 18 },
  eyebrow: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: colors.berry60,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  bigTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 30,
    color: colors.berry,
    letterSpacing: -1,
  },
  bigTitleItalic: {
    fontFamily: fonts.displayItalic || fonts.displayBold,
    fontStyle: 'italic',
  },

  hero: {
    borderRadius: 24,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 6,
  },
  heroBlob: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(246, 186, 214, 0.12)',
    top: -80,
    right: -60,
  },
  heroLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: colors.creamDark,
    letterSpacing: 1.5,
  },
  heroBalance: {
    fontFamily: fonts.displayBold,
    fontSize: 42,
    color: colors.pink,
    letterSpacing: -1.5,
    marginVertical: 4,
  },
  heroSub: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.creamDark,
  },
  heroBerryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(250, 243, 238, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectHead: { marginTop: 28, marginBottom: 14 },
  sectTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 18,
    color: colors.berry,
    letterSpacing: -0.3,
  },
  sectTitleItalic: {
    fontFamily: fonts.displayItalic || fonts.displayBold,
    fontStyle: 'italic',
  },

  brandGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  brandCard: {
    borderRadius: 20,
    padding: 16,
    minHeight: 170,
    justifyContent: 'space-between',
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 4,
  },
  brandEmoji: { fontSize: 30 },
  brandName: {
    fontFamily: fonts.displayBold,
    fontSize: 14,
    color: '#fff',
    letterSpacing: -0.3,
    marginTop: 8,
  },
  brandValue: {
    fontFamily: fonts.displayBold,
    fontSize: 22,
    color: '#fff',
    letterSpacing: -0.8,
    marginTop: 2,
  },
  brandCostPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 100,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  brandCostPillDisabled: { opacity: 0.6 },
  brandCostDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.pink,
  },
  brandCostText: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: '#fff',
    letterSpacing: 0.3,
  },
});
