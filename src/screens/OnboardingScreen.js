import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts } from '../theme';

const { width } = Dimensions.get('window');
const SLIDE_DURATION = 5000; // 5 seconds per slide

// ============================================================
//   SLIDE CONTENT
// ============================================================
const SLIDES = [
  {
    id: 'habits',
    bg: colors.cream,
    accent: colors.berry,
    title: 'Build habits\nthat stick',
    subtitle: 'Track the rituals that change your life, one day at a time.',
    Illustration: HabitCards,
  },
  {
    id: 'streaks',
    bg: colors.berry,
    accent: colors.pink,
    title: 'Streaks become\nlegendary',
    subtitle: 'Show up daily. Watch the magic compound.',
    Illustration: StreakHero,
    dark: true,
  },
  {
    id: 'proof',
    bg: colors.cream,
    accent: colors.berry,
    title: 'Prove every\nwin',
    subtitle: 'Snap a photo to verify each habit. Real wins, no shortcuts.',
    Illustration: PhotoProof,
  },
  {
    id: 'rewards',
    bg: colors.pink,
    accent: colors.berry,
    title: 'Real rewards.\nReal brands.',
    subtitle: 'Turn berries into gift cards from Starbucks, Spotify, Nike, and more.',
    Illustration: RewardBrands,
  },
  {
    id: 'friends',
    bg: colors.cream,
    accent: colors.berry,
    title: 'Better with\nfriends',
    subtitle: 'Compete, encourage, and grow together. The streak is just the start.',
    Illustration: FriendsPodium,
  },
];

// ============================================================
//   MAIN COMPONENT
// ============================================================
export default function OnboardingScreen({ navigation }) {
  const [index, setIndex] = useState(0);
  const [showCTA, setShowCTA] = useState(false);

  // Progress bar animation for the current slide
  const progressAnim = useRef(new Animated.Value(0)).current;
  // Slide content fade for transitions
  const contentAnim = useRef(new Animated.Value(1)).current;

  // Start / restart the progress bar whenever the slide changes
  useEffect(() => {
    if (showCTA) return;
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: SLIDE_DURATION,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) goNext();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, showCTA]);

  const transitionTo = (newIndex) => {
    Animated.timing(contentAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setIndex(newIndex);
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    });
  };

  const goNext = () => {
    if (index < SLIDES.length - 1) {
      transitionTo(index + 1);
    } else {
      setShowCTA(true);
    }
  };

  const goPrev = () => {
    if (showCTA) {
      setShowCTA(false);
      transitionTo(SLIDES.length - 1);
      return;
    }
    if (index > 0) {
      transitionTo(index - 1);
    }
  };

  // Auto-show CTA at the end
  if (showCTA) {
    return <CTAScreen navigation={navigation} onBack={goPrev} />;
  }

  const slide = SLIDES[index];

  return (
    <View style={[styles.container, { backgroundColor: slide.bg }]}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Top: progress bars + skip */}
        <View style={styles.top}>
          <View style={styles.progressBars}>
            {SLIDES.map((_, i) => (
              <View key={i} style={styles.progressTrack}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: slide.dark ? colors.pink : colors.berry,
                      width:
                        i < index
                          ? '100%'
                          : i === index
                          ? progressAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0%', '100%'],
                            })
                          : '0%',
                    },
                  ]}
                />
              </View>
            ))}
          </View>
          <Pressable onPress={() => setShowCTA(true)} hitSlop={10}>
            <Text
              style={[
                styles.skipText,
                { color: slide.dark ? colors.pink : colors.berry },
              ]}
            >
              Skip
            </Text>
          </Pressable>
        </View>

        {/* Center: illustration + copy */}
        <Animated.View
          style={[
            styles.center,
            { opacity: contentAnim },
          ]}
        >
          <View style={styles.illustrationWrap}>
            <slide.Illustration accent={slide.accent} dark={slide.dark} />
          </View>
          <Text
            style={[
              styles.title,
              { color: slide.dark ? colors.pink : colors.berry },
            ]}
          >
            {slide.title}
          </Text>
          <Text
            style={[
              styles.subtitle,
              {
                color: slide.dark ? colors.creamDark : colors.berry80,
              },
            ]}
          >
            {slide.subtitle}
          </Text>
        </Animated.View>

        {/* Bottom: hint */}
        <View style={styles.bottomHint}>
          <Text
            style={[
              styles.hintText,
              { color: slide.dark ? colors.creamDark : colors.berry60 },
            ]}
          >
            Tap to skip ahead
          </Text>
        </View>

        {/* Invisible tap zones: left half = previous, right half = next */}
        <Pressable
          style={styles.tapLeft}
          onPress={goPrev}
        />
        <Pressable
          style={styles.tapRight}
          onPress={goNext}
        />
      </SafeAreaView>
    </View>
  );
}

// ============================================================
//   FINAL CTA SCREEN
// ============================================================
function CTAScreen({ navigation, onBack }) {
  const fade = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(lift, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.cream }]}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <Pressable onPress={onBack} style={styles.ctaBack} hitSlop={10}>
          <Ionicons name="chevron-back" size={22} color={colors.berry} />
        </Pressable>

        <Animated.View
          style={[
            styles.ctaCenter,
            {
              opacity: fade,
              transform: [{ translateY: lift }],
            },
          ]}
        >
          <View style={styles.ctaLogo}>
            <Text style={styles.ctaLogoEmoji}>🪶</Text>
          </View>
          <Text style={styles.ctaEyebrow}>Welcome to</Text>
          <Text style={styles.ctaTitle}>
            <Text style={styles.ctaTitleItalic}>Stork</Text>
          </Text>
          <Text style={styles.ctaSubtitle}>
            Your habits, supercharged.{'\n'}Let's make today count.
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.ctaActions,
            { opacity: fade, transform: [{ translateY: lift }] },
          ]}
        >
          <Pressable
            style={({ pressed }) => [
              styles.ctaPrimary,
              pressed && { opacity: 0.9 },
            ]}
            onPress={() => navigation.replace('SignUp')}
          >
            <Text style={styles.ctaPrimaryText}>Get started</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.replace('Login')}
            hitSlop={8}
          >
            <Text style={styles.ctaSecondaryText}>I already have an account</Text>
          </Pressable>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

// ============================================================
//   ILLUSTRATIONS — built with Views, no images needed
// ============================================================

function HabitCards({ accent }) {
  return (
    <View style={ill.habitsContainer}>
      {[
        { emoji: '💧', title: 'Drink water', done: true, rotate: -4 },
        { emoji: '🧘', title: 'Meditate', done: true, rotate: 2 },
        { emoji: '📚', title: 'Read 30 min', done: false, rotate: -2 },
      ].map((t, i) => (
        <View
          key={i}
          style={[
            ill.habitCard,
            {
              transform: [{ rotate: `${t.rotate}deg` }, { translateY: i * -4 }],
              zIndex: 3 - i,
            },
          ]}
        >
          <View
            style={[
              ill.habitCheck,
              t.done && { backgroundColor: colors.berry, borderColor: colors.berry },
            ]}
          >
            {t.done && <Ionicons name="checkmark" size={12} color={colors.pink} />}
          </View>
          <Text style={ill.habitEmoji}>{t.emoji}</Text>
          <Text
            style={[
              ill.habitText,
              t.done && { textDecorationLine: 'line-through', opacity: 0.5 },
            ]}
          >
            {t.title}
          </Text>
          <Text style={ill.habitXp}>+20</Text>
        </View>
      ))}
    </View>
  );
}

function StreakHero() {
  return (
    <View style={ill.streakContainer}>
      <View style={ill.streakHalo} />
      <Text style={ill.streakFlame}>🔥</Text>
      <Text style={ill.streakNum}>87</Text>
      <Text style={ill.streakLabel}>days strong</Text>
      <View style={ill.streakBerries}>
        <View style={ill.berryDot} />
        <Text style={ill.berryText}>1,240 berries</Text>
      </View>
    </View>
  );
}

function PhotoProof() {
  return (
    <View style={ill.proofContainer}>
      <View style={ill.proofPhoto}>
        <Text style={ill.proofPhotoEmoji}>💧</Text>
      </View>
      <View style={ill.proofVerified}>
        <Ionicons name="checkmark-circle" size={14} color={colors.berry} />
        <Text style={ill.proofVerifiedText}>Verified</Text>
      </View>
      <View style={ill.proofCamera}>
        <Ionicons name="camera" size={22} color={colors.pink} />
      </View>
    </View>
  );
}

function RewardBrands() {
  const brands = [
    { name: 'Starbucks', emoji: '☕', value: '$5' },
    { name: 'Spotify', emoji: '🎵', value: '1 mo' },
    { name: 'Nike', emoji: '👟', value: '10%' },
  ];
  return (
    <View style={ill.rewardContainer}>
      {brands.map((b, i) => (
        <View
          key={i}
          style={[
            ill.rewardCard,
            {
              transform: [
                { translateX: (i - 1) * 24 },
                { translateY: (i === 1 ? -8 : 0) },
                { rotate: `${(i - 1) * 4}deg` },
              ],
              zIndex: i === 1 ? 3 : 1,
            },
          ]}
        >
          <Text style={ill.rewardEmoji}>{b.emoji}</Text>
          <Text style={ill.rewardName}>{b.name}</Text>
          <Text style={ill.rewardValue}>{b.value}</Text>
        </View>
      ))}
    </View>
  );
}

function FriendsPodium() {
  const podium = [
    { name: 'Jay', initial: 'J', height: 60, rank: 2, gradient: ['#A8D8EA', '#7FB6CC'] },
    { name: 'Mia', initial: 'M', height: 80, rank: 1, gradient: ['#F6BAD6', '#E89BC4'] },
    { name: 'Ola', initial: 'O', height: 45, rank: 3, gradient: ['#FFD3A5', '#FD9853'] },
  ];
  return (
    <View style={ill.podiumContainer}>
      {podium.map((p, i) => (
        <View key={i} style={ill.podiumCol}>
          <LinearGradient colors={p.gradient} style={ill.podiumAvatar}>
            <Text style={ill.podiumInitial}>{p.initial}</Text>
          </LinearGradient>
          <Text style={ill.podiumName}>{p.name}</Text>
          <View style={[ill.podiumBase, { height: p.height }]}>
            <Text style={ill.podiumRank}>{p.rank}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

// ============================================================
//   STYLES
// ============================================================

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },

  // Top progress bars + skip
  top: {
    paddingHorizontal: 16,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    zIndex: 10,
  },
  progressBars: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
  },
  progressTrack: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(0,0,0,0.12)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  skipText: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 0.5,
  },

  // Center content
  center: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationWrap: {
    width: '100%',
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  title: {
    fontFamily: fonts.displayBold,
    fontSize: 36,
    textAlign: 'center',
    letterSpacing: -1,
    lineHeight: 40,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 16,
    paddingHorizontal: 8,
  },

  // Bottom hint
  bottomHint: { alignItems: 'center', paddingBottom: 20 },
  hintText: {
    fontFamily: fonts.body,
    fontSize: 11,
    letterSpacing: 0.3,
  },

  // Invisible tap zones
  tapLeft: {
    position: 'absolute',
    left: 0,
    top: 40,
    bottom: 60,
    width: width * 0.3,
  },
  tapRight: {
    position: 'absolute',
    right: 0,
    top: 40,
    bottom: 60,
    width: width * 0.7,
  },

  // CTA screen
  ctaBack: {
    position: 'absolute',
    top: 16,
    left: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.creamDark,
    zIndex: 5,
  },
  ctaCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  ctaLogo: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: colors.pink,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
  },
  ctaLogoEmoji: { fontSize: 50 },
  ctaEyebrow: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.berry60,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  ctaTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 56,
    color: colors.berry,
    letterSpacing: -2,
  },
  ctaTitleItalic: {
    fontFamily: fonts.displayItalic || fonts.displayBold,
    fontStyle: 'italic',
  },
  ctaSubtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.berry80,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
  },
  ctaActions: {
    paddingHorizontal: 24,
    paddingBottom: 30,
    gap: 16,
    alignItems: 'center',
  },
  ctaPrimary: {
    width: '100%',
    backgroundColor: colors.berry,
    paddingVertical: 18,
    borderRadius: 100,
    alignItems: 'center',
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8,
  },
  ctaPrimaryText: {
    fontFamily: fonts.displayBold,
    fontSize: 16,
    color: colors.pink,
    letterSpacing: 0.3,
  },
  ctaSecondaryText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.berry80,
    textDecorationLine: 'underline',
  },
});

// ============================================================
//   ILLUSTRATION STYLES
// ============================================================
const ill = StyleSheet.create({
  // Habit cards
  habitsContainer: {
    width: 240,
    alignItems: 'center',
    gap: 8,
  },
  habitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    width: 240,
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  habitCheck: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitEmoji: { fontSize: 18 },
  habitText: {
    flex: 1,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.berry,
  },
  habitXp: {
    fontFamily: fonts.displayBold,
    fontSize: 12,
    color: colors.berry,
  },

  // Streak hero
  streakContainer: {
    alignItems: 'center',
  },
  streakHalo: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(246, 186, 214, 0.15)',
    top: -10,
  },
  streakFlame: { fontSize: 40, marginBottom: -8 },
  streakNum: {
    fontFamily: fonts.displayBold,
    fontSize: 120,
    color: colors.pink,
    letterSpacing: -6,
    lineHeight: 130,
  },
  streakLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.creamDark,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  streakBerries: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(250, 243, 238, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    marginTop: 16,
  },
  berryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.pink,
  },
  berryText: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.pink,
  },

  // Photo proof
  proofContainer: { alignItems: 'center' },
  proofPhoto: {
    width: 180,
    height: 220,
    borderRadius: 24,
    backgroundColor: colors.pink,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.white,
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  proofPhotoEmoji: { fontSize: 90 },
  proofVerified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    marginTop: -16,
    borderWidth: 2,
    borderColor: colors.pink,
  },
  proofVerifiedText: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    color: colors.berry,
    letterSpacing: 0.3,
  },
  proofCamera: {
    position: 'absolute',
    bottom: 30,
    right: -20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.berry,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '8deg' }],
  },

  // Reward brands
  rewardContainer: {
    flexDirection: 'row',
    width: 280,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardCard: {
    position: 'absolute',
    width: 110,
    height: 140,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: colors.berry,
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 4,
  },
  rewardEmoji: { fontSize: 36 },
  rewardName: {
    fontFamily: fonts.displayBold,
    fontSize: 13,
    color: colors.berry,
    letterSpacing: -0.2,
  },
  rewardValue: {
    fontFamily: fonts.displayBold,
    fontSize: 18,
    color: colors.berry,
    letterSpacing: -0.5,
  },

  // Podium
  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    height: 200,
  },
  podiumCol: { alignItems: 'center', width: 60 },
  podiumAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  podiumInitial: {
    fontFamily: fonts.displayBold,
    fontSize: 20,
    color: colors.white,
  },
  podiumName: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    color: colors.berry,
    marginBottom: 6,
  },
  podiumBase: {
    width: 56,
    backgroundColor: colors.berry,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 6,
  },
  podiumRank: {
    fontFamily: fonts.displayBold,
    fontSize: 14,
    color: colors.pink,
  },
});
