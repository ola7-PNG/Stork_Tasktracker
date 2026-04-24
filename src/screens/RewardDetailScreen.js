import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts } from '../theme';

// Generate a fake gift-card code for the prototype
function generateCode() {
  const block = () =>
    Math.random().toString(36).substring(2, 6).toUpperCase();
  return `STORK-${block()}-${block()}`;
}

export default function RewardDetailScreen({ route, navigation }) {
  const { reward, balance = 1240 } = route.params || {};
  const [state, setState] = useState('confirm'); // 'confirm' | 'success'
  const [code] = useState(() => generateCode());
  const [copied, setCopied] = useState(false);

  const costNum = parseInt(String(reward.cost).replace(/,/g, ''), 10);
  const balanceAfter = balance - costNum;
  const canAfford = balanceAfter >= 0;

  // Animation refs
  const checkScale = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (state === 'success') {
      Animated.sequence([
        Animated.spring(checkScale, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [state]);

  const handleRedeem = () => {
    if (!canAfford) return;
    setState('success');
  };

  const handleCopy = () => {
    // Clipboard requires expo-clipboard — omitted here to avoid extra dep
    // In production, import * as Clipboard from 'expo-clipboard';
    // await Clipboard.setStringAsync(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ========== CONFIRM STATE ==========
  if (state === 'confirm') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.iconBtn}
            hitSlop={10}
          >
            <Ionicons name="close" size={22} color={colors.berry} />
          </Pressable>
          <Text style={styles.topBarTitle}>Redeem</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Brand card */}
          <LinearGradient
            colors={[colors.pink, '#F9C8DE']}
            style={styles.brandCard}
          >
            <View style={styles.brandLogoBig}>
              <Text style={styles.brandLogoBigText}>{reward.logo}</Text>
            </View>
            <Text style={styles.brandNameBig}>{reward.brand}</Text>
            <Text style={styles.brandDesc}>{reward.desc}</Text>
            <View style={styles.costChip}>
              <View style={styles.berryDot} />
              <Text style={styles.costChipText}>
                {reward.cost} berries
              </Text>
            </View>
          </LinearGradient>

          {/* Balance breakdown */}
          <View style={styles.balanceBox}>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>Your balance</Text>
              <Text style={styles.balanceValue}>
                {balance.toLocaleString()}
              </Text>
            </View>
            <View style={styles.balanceDivider} />
            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>Cost</Text>
              <Text style={[styles.balanceValue, { color: colors.berry }]}>
                −{reward.cost}
              </Text>
            </View>
            <View style={styles.balanceDivider} />
            <View style={styles.balanceRow}>
              <Text style={[styles.balanceLabel, styles.balanceLabelBold]}>
                After redemption
              </Text>
              <Text
                style={[
                  styles.balanceValue,
                  styles.balanceValueBold,
                  !canAfford && { color: '#B85278' },
                ]}
              >
                {balanceAfter.toLocaleString()}
              </Text>
            </View>
          </View>

          <Text style={styles.finePrint}>
            Redemptions are final. Your gift card code will be delivered
            instantly and is also saved to your account.
          </Text>
        </ScrollView>

        {/* Primary action */}
        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              !canAfford && styles.primaryBtnDisabled,
              pressed && canAfford && { opacity: 0.9 },
            ]}
            onPress={handleRedeem}
            disabled={!canAfford}
          >
            <Text style={styles.primaryBtnText}>
              {canAfford
                ? `Redeem for ${reward.cost} berries`
                : 'Not enough berries'}
            </Text>
            {canAfford && (
              <Ionicons name="arrow-forward" size={18} color={colors.pink} />
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ========== SUCCESS STATE ==========
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.successScroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Checkmark */}
        <Animated.View
          style={[
            styles.checkCircle,
            { transform: [{ scale: checkScale }] },
          ]}
        >
          <Ionicons name="checkmark" size={52} color={colors.pink} />
        </Animated.View>

        <Animated.View
          style={[
            styles.successHead,
            {
              opacity: contentOpacity,
              transform: [
                {
                  translateY: contentOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [12, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.successTitle}>Redeemed!</Text>
          <Text style={styles.successSub}>Your reward is ready to use</Text>
        </Animated.View>

        {/* The gift card */}
        <Animated.View
          style={{
            opacity: contentOpacity,
            transform: [
              {
                translateY: contentOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
          <LinearGradient
            colors={[colors.berry, colors.berry80]}
            style={styles.giftCard}
          >
            {/* Corner decor */}
            <View style={styles.giftCardDot1} />
            <View style={styles.giftCardDot2} />

            {/* Accepted ribbon */}
            <View style={styles.acceptedRibbon}>
              <Ionicons
                name="checkmark-circle"
                size={12}
                color={colors.berry}
              />
              <Text style={styles.acceptedRibbonText}>ACCEPTED</Text>
            </View>

            {/* Brand */}
            <View style={styles.giftBrandRow}>
              <View style={styles.giftLogo}>
                <Text style={styles.giftLogoText}>{reward.logo}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.giftBrand}>{reward.brand}</Text>
                <Text style={styles.giftDesc}>{reward.desc}</Text>
              </View>
            </View>

            <View style={styles.giftDivider} />

            {/* Code */}
            <Text style={styles.giftCodeLabel}>REDEMPTION CODE</Text>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{code}</Text>
            </View>

            {/* Perforated edge effect */}
            <View style={styles.perforation}>
              {Array.from({ length: 18 }).map((_, i) => (
                <View key={i} style={styles.perfDot} />
              ))}
            </View>

            <View style={styles.giftFooter}>
              <Text style={styles.giftFooterLabel}>VALUE</Text>
              <Text style={styles.giftFooterValue}>{reward.desc}</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Copy code */}
        <Animated.View style={{ opacity: contentOpacity, width: '100%' }}>
          <Pressable
            style={({ pressed }) => [
              styles.copyBtn,
              pressed && { opacity: 0.85 },
            ]}
            onPress={handleCopy}
          >
            <Ionicons
              name={copied ? 'checkmark' : 'copy-outline'}
              size={18}
              color={colors.berry}
            />
            <Text style={styles.copyBtnText}>
              {copied ? 'Copied!' : 'Copy code'}
            </Text>
          </Pressable>
        </Animated.View>

        {/* Saved to account note */}
        <Animated.Text style={[styles.savedNote, { opacity: contentOpacity }]}>
          💌 Also sent to your email and saved in your account
        </Animated.Text>
      </ScrollView>

      {/* Done button */}
      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            pressed && { opacity: 0.9 },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.primaryBtnText}>Done</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
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
  topBarTitle: {
    fontFamily: fonts.displaySemi,
    fontSize: 16,
    color: colors.berry,
  },

  scroll: { paddingHorizontal: 24, paddingBottom: 24 },

  // CONFIRM state
  brandCard: {
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: colors.pink,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 6,
  },
  brandLogoBig: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  brandLogoBigText: {
    fontFamily: fonts.displayBold,
    fontSize: 26,
    color: colors.berry,
  },
  brandNameBig: {
    fontFamily: fonts.displayBold,
    fontSize: 28,
    color: colors.berry,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  brandDesc: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.berry80,
    textAlign: 'center',
    marginBottom: 16,
  },
  costChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.berry,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
  },
  berryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.pink,
  },
  costChipText: {
    fontFamily: fonts.displayBold,
    fontSize: 15,
    color: colors.pink,
    letterSpacing: 0.2,
  },

  balanceBox: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceDivider: {
    height: 1,
    backgroundColor: colors.creamDark,
    marginVertical: 14,
  },
  balanceLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.berry80,
  },
  balanceLabelBold: {
    fontFamily: fonts.bodyBold,
    color: colors.berry,
  },
  balanceValue: {
    fontFamily: fonts.displaySemi,
    fontSize: 18,
    color: colors.berry80,
  },
  balanceValueBold: {
    fontFamily: fonts.displayBold,
    fontSize: 20,
    color: colors.berry,
  },
  finePrint: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.berry60,
    lineHeight: 17,
    paddingHorizontal: 6,
  },

  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: colors.cream,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.berry,
    paddingVertical: 16,
    borderRadius: 100,
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  primaryBtnDisabled: {
    opacity: 0.4,
  },
  primaryBtnText: {
    fontFamily: fonts.displayBold,
    color: colors.pink,
    fontSize: 15,
    letterSpacing: 0.2,
  },

  // SUCCESS state
  successScroll: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
  },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.berry,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  successHead: { alignItems: 'center', marginBottom: 28 },
  successTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 38,
    color: colors.berry,
    letterSpacing: -0.5,
  },
  successSub: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.berry80,
    marginTop: 6,
  },

  // Gift card
  giftCard: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  giftCardDot1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.pink,
    opacity: 0.12,
    top: -60,
    right: -50,
  },
  giftCardDot2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.pink,
    opacity: 0.08,
    bottom: -30,
    left: -30,
  },
  acceptedRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: colors.pink,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    marginBottom: 16,
  },
  acceptedRibbonText: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: colors.berry,
    letterSpacing: 1.2,
  },

  giftBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  giftLogo: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.pink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  giftLogoText: {
    fontFamily: fonts.displayBold,
    fontSize: 20,
    color: colors.berry,
  },
  giftBrand: {
    fontFamily: fonts.displayBold,
    fontSize: 20,
    color: colors.pink,
    letterSpacing: -0.3,
  },
  giftDesc: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.pink50,
    opacity: 0.75,
    marginTop: 2,
  },

  giftDivider: {
    height: 1,
    backgroundColor: 'rgba(246, 186, 214, 0.2)',
    marginBottom: 18,
  },

  giftCodeLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: colors.pink,
    letterSpacing: 1.8,
    marginBottom: 10,
  },
  codeBox: {
    borderWidth: 1.5,
    borderColor: colors.pink,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(246, 186, 214, 0.06)',
  },
  codeText: {
    fontFamily: fonts.displayBold,
    fontSize: 18,
    color: colors.white,
    letterSpacing: 2,
  },

  perforation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -8,
    marginBottom: 18,
  },
  perfDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(246, 186, 214, 0.25)',
  },

  giftFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  giftFooterLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: colors.pink,
    letterSpacing: 1.8,
  },
  giftFooterValue: {
    fontFamily: fonts.displaySemi,
    fontSize: 14,
    color: colors.pink50,
    opacity: 0.9,
  },

  // Copy button
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamDark,
    paddingVertical: 14,
    borderRadius: 100,
    marginBottom: 16,
  },
  copyBtnText: {
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    color: colors.berry,
  },
  savedNote: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.berry60,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});
