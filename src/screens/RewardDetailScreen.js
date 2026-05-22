import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts } from '../theme';
import { useUserStore, userStore } from '../state/userStore';

// Generate a fake redemption code like STORK-A4F2-9B1C
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const block = (n) =>
    Array.from(
      { length: n },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  return `STORK-${block(4)}-${block(4)}`;
}

export default function RewardDetailScreen({ route, navigation }) {
  const brand = route?.params?.brand;
  const { berries } = useUserStore();

  const [confirmed, setConfirmed] = useState(false);
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Animations
  const entryAnim = useRef(new Animated.Value(0)).current;
  const successAnim = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entryAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (confirmed) {
      Animated.parallel([
        Animated.timing(successAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(checkScale, {
          toValue: 1,
          friction: 5,
          tension: 110,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [confirmed]);

  if (!brand) {
    // Shouldn't normally happen — defensive fallback
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <Text style={{ padding: 24 }}>No reward selected.</Text>
      </SafeAreaView>
    );
  }

  const handleRedeem = () => {
    setErrorMsg('');
    const success = userStore.spendBerries(brand.cost, brand.name);
    if (!success) {
      setErrorMsg(
        `Not enough berries — you need ${brand.cost - berries} more.`
      );
      return;
    }
    setCode(generateCode());
    setConfirmed(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <View style={styles.handle} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {confirmed ? (
          <SuccessView
            brand={brand}
            code={code}
            successAnim={successAnim}
            checkScale={checkScale}
            onClose={() => navigation.goBack()}
          />
        ) : (
          <ConfirmView
            brand={brand}
            balance={berries}
            errorMsg={errorMsg}
            entryAnim={entryAnim}
            onRedeem={handleRedeem}
            onClose={() => navigation.goBack()}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================
//   CONFIRM VIEW
// ============================================================
function ConfirmView({ brand, balance, errorMsg, entryAnim, onRedeem, onClose }) {
  const newBalance = balance - brand.cost;
  const canAfford = newBalance >= 0;

  return (
    <Animated.View
      style={{
        opacity: entryAnim,
        transform: [
          {
            translateY: entryAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [12, 0],
            }),
          },
        ],
      }}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>CONFIRM REDEMPTION</Text>
          <Text style={styles.title}>Redeem reward</Text>
        </View>
        <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={10}>
          <Ionicons name="close" size={22} color={colors.berry} />
        </Pressable>
      </View>

      {/* Brand hero */}
      <LinearGradient colors={brand.gradient} style={styles.brandHero}>
        <Text style={styles.brandHeroEmoji}>{brand.emoji}</Text>
        <Text style={styles.brandHeroName}>{brand.name}</Text>
        <Text style={styles.brandHeroValue}>{brand.value} GIFT CARD</Text>
      </LinearGradient>

      {/* Breakdown */}
      <View style={styles.breakdown}>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Your balance</Text>
          <Text style={styles.breakdownValue}>{balance.toLocaleString()} 🫐</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Reward cost</Text>
          <Text style={[styles.breakdownValue, { color: '#B85278' }]}>
            – {brand.cost.toLocaleString()} 🫐
          </Text>
        </View>
        <View style={styles.breakdownDivider} />
        <View style={styles.breakdownRow}>
          <Text style={[styles.breakdownLabel, { fontFamily: fonts.bodyBold }]}>
            New balance
          </Text>
          <Text
            style={[
              styles.breakdownValue,
              styles.breakdownTotal,
              !canAfford && { color: '#B85278' },
            ]}
          >
            {Math.max(0, newBalance).toLocaleString()} 🫐
          </Text>
        </View>
      </View>

      {errorMsg ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size={16} color="#B85278" />
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : null}

      {/* Action */}
      <Pressable
        onPress={onRedeem}
        disabled={!canAfford}
        style={({ pressed }) => [
          styles.primaryBtn,
          !canAfford && styles.primaryBtnDisabled,
          pressed && canAfford && { opacity: 0.9 },
        ]}
      >
        <Ionicons name="gift" size={18} color={colors.pink} />
        <Text style={styles.primaryBtnText}>
          {canAfford ? 'Redeem now' : 'Not enough berries'}
        </Text>
      </Pressable>

      <Text style={styles.fineprint}>
        Once redeemed, the code is generated immediately. Berries are deducted from
        your balance and cannot be returned.
      </Text>
    </Animated.View>
  );
}

// ============================================================
//   SUCCESS VIEW
// ============================================================
function SuccessView({ brand, code, successAnim, checkScale, onClose }) {
  return (
    <Animated.View
      style={{
        opacity: successAnim,
        transform: [
          {
            translateY: successAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [12, 0],
            }),
          },
        ],
        alignItems: 'center',
      }}
    >
      {/* Animated checkmark */}
      <View style={styles.checkWrap}>
        <View style={styles.checkHalo} />
        <Animated.View
          style={[
            styles.checkCircle,
            { transform: [{ scale: checkScale }] },
          ]}
        >
          <Ionicons name="checkmark" size={40} color={colors.pink} />
        </Animated.View>
      </View>

      <Text style={styles.successEyebrow}>REWARD UNLOCKED</Text>
      <Text style={styles.successTitle}>You got it! 🎉</Text>
      <Text style={styles.successSub}>
        Your {brand.name} {brand.value} gift card is ready
      </Text>

      {/* Gift card */}
      <View style={styles.giftCardWrap}>
        <LinearGradient colors={brand.gradient} style={styles.giftCard}>
          <Text style={styles.giftCardEmoji}>{brand.emoji}</Text>
          <Text style={styles.giftCardBrand}>{brand.name}</Text>
          <Text style={styles.giftCardValue}>{brand.value}</Text>
          {/* Perforated edge */}
          <View style={styles.perfRow}>
            {Array.from({ length: 12 }).map((_, i) => (
              <View key={i} style={styles.perfDot} />
            ))}
          </View>
          <Text style={styles.giftCardCodeLabel}>YOUR CODE</Text>
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{code}</Text>
          </View>
        </LinearGradient>
      </View>

      {/* Actions */}
      <Pressable
        style={({ pressed }) => [
          styles.primaryBtn,
          { marginTop: 18, width: '100%' },
          pressed && { opacity: 0.9 },
        ]}
      >
        <Ionicons name="copy-outline" size={16} color={colors.pink} />
        <Text style={styles.primaryBtnText}>Copy code</Text>
      </Pressable>

      <Pressable
        onPress={onClose}
        style={({ pressed }) => [
          styles.secondaryBtn,
          { marginTop: 10, width: '100%' },
          pressed && { opacity: 0.7 },
        ]}
      >
        <Text style={styles.secondaryBtnText}>Done</Text>
      </Pressable>
    </Animated.View>
  );
}

// ============================================================
//   STYLES
// ============================================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  scroll: { paddingHorizontal: 24, paddingBottom: 30 },

  topBar: { alignItems: 'center', paddingTop: 8, paddingBottom: 4 },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.creamDark,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 22,
  },
  eyebrow: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: colors.berry60,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  title: {
    fontFamily: fonts.displayBold,
    fontSize: 26,
    color: colors.berry,
    letterSpacing: -0.5,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.creamDark,
  },

  // Brand hero
  brandHero: {
    borderRadius: 22,
    padding: 28,
    alignItems: 'center',
    marginBottom: 22,
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 6,
  },
  brandHeroEmoji: { fontSize: 56, marginBottom: 8 },
  brandHeroName: {
    fontFamily: fonts.displayBold,
    fontSize: 22,
    color: '#fff',
    letterSpacing: -0.5,
  },
  brandHeroValue: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1.5,
    marginTop: 6,
  },

  // Breakdown
  breakdown: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: 18,
    padding: 18,
    gap: 12,
    marginBottom: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.berry80,
  },
  breakdownValue: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.berry,
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: colors.creamDark,
    marginVertical: 4,
  },
  breakdownTotal: {
    fontFamily: fonts.displayBold,
    fontSize: 18,
  },

  // Error
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#FCE4EC',
    borderRadius: 12,
    marginBottom: 14,
  },
  errorText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: '#B85278',
    flex: 1,
  },

  // Buttons
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.berry,
    paddingVertical: 16,
    borderRadius: 100,
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 6,
  },
  primaryBtnDisabled: {
    backgroundColor: colors.creamDark,
    opacity: 0.65,
    shadowOpacity: 0,
  },
  primaryBtnText: {
    fontFamily: fonts.displayBold,
    color: colors.pink,
    fontSize: 14,
    letterSpacing: 0.3,
  },
  secondaryBtn: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.creamDark,
    paddingVertical: 14,
    borderRadius: 100,
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.berry,
  },
  fineprint: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.berry60,
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 15,
    paddingHorizontal: 8,
  },

  // Success view
  checkWrap: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  checkHalo: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(246, 186, 214, 0.25)',
  },
  checkCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.berry,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 8,
  },
  successEyebrow: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: colors.berry60,
    letterSpacing: 1.5,
    marginTop: 18,
  },
  successTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 28,
    color: colors.berry,
    letterSpacing: -0.5,
    marginTop: 4,
  },
  successSub: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.berry80,
    marginTop: 6,
    textAlign: 'center',
  },

  // Gift card
  giftCardWrap: { width: '100%', marginTop: 22 },
  giftCard: {
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 6,
  },
  giftCardEmoji: { fontSize: 36, marginBottom: 4 },
  giftCardBrand: {
    fontFamily: fonts.displayBold,
    fontSize: 18,
    color: '#fff',
    letterSpacing: -0.3,
  },
  giftCardValue: {
    fontFamily: fonts.displayBold,
    fontSize: 36,
    color: '#fff',
    letterSpacing: -1.2,
    marginTop: 2,
  },
  perfRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 14,
  },
  perfDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  giftCardCodeLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  codeBox: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    borderStyle: 'dashed',
  },
  codeText: {
    fontFamily: fonts.displayBold,
    fontSize: 16,
    color: '#fff',
    letterSpacing: 2,
  },
});
