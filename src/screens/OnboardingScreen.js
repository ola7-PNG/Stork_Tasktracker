import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Pressable,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts } from '../theme';
import StorkLogo from '../components/StorkLogo';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    key: 'track',
    eyebrow: 'Step 01',
    title: 'Track habits that ',
    titleItalic: 'matter.',
    body: 'Build routines that actually stick. Drink water, move, read, meditate — add any habit and Stork will hold you to it.',
    visual: 'tasks',
  },
  {
    key: 'earn',
    eyebrow: 'Step 02',
    title: 'Earn berries for ',
    titleItalic: 'every win.',
    body: 'Every completed quest gives you XP and berries. Keep your streak alive to unlock multipliers and rare achievements.',
    visual: 'streak',
  },
  {
    key: 'redeem',
    eyebrow: 'Step 03',
    title: 'Redeem for ',
    titleItalic: 'real rewards.',
    body: 'Spend berries on gift cards and perks from brands you already love — Starbucks, Spotify, Sephora, Nike and more.',
    visual: 'rewards',
  },
];

// ---------- VISUAL COMPONENTS FOR EACH SLIDE ----------

function TasksVisual() {
  const rows = [
    { emoji: '💧', label: 'Drink water', xp: '+20', done: true },
    { emoji: '🧘', label: 'Meditate 10 min', xp: '+25', done: true },
    { emoji: '📚', label: 'Read 30 min', xp: '+30', done: false },
  ];
  return (
    <View style={visualStyles.tasksWrap}>
      {rows.map((r, i) => (
        <View
          key={r.label}
          style={[
            visualStyles.taskRow,
            r.done && visualStyles.taskRowDone,
            { transform: [{ rotate: `${(i - 1) * 2}deg` }] },
          ]}
        >
          <View style={[visualStyles.check, r.done && visualStyles.checkDone]}>
            {r.done && <Ionicons name="checkmark" size={14} color={colors.pink} />}
          </View>
          <Text style={visualStyles.taskEmoji}>{r.emoji}</Text>
          <Text style={[visualStyles.taskText, r.done && visualStyles.taskTextDone]}>
            {r.label}
          </Text>
          <Text style={visualStyles.taskXp}>{r.xp}</Text>
        </View>
      ))}
    </View>
  );
}

function StreakVisual() {
  return (
    <View style={visualStyles.streakWrap}>
      <LinearGradient
        colors={[colors.berry, colors.berry80]}
        style={visualStyles.streakCard}
      >
        <View style={visualStyles.streakBlob} />
        <Text style={visualStyles.streakLabel}>CURRENT STREAK</Text>
        <View style={visualStyles.streakRow}>
          <Text style={visualStyles.streakNum}>12</Text>
          <View>
            <Text style={visualStyles.streakDays}>days</Text>
            <Text style={visualStyles.streakSub}>Level 8 · 340 XP to go</Text>
          </View>
        </View>
        <View style={visualStyles.xpTrack}>
          <View style={visualStyles.xpFill} />
        </View>
      </LinearGradient>

      <View style={visualStyles.berryPill}>
        <View style={visualStyles.berryDot} />
        <Text style={visualStyles.berryPillText}>1,240 berries</Text>
      </View>
    </View>
  );
}

function RewardsVisual() {
  const brands = [
    { logo: 'sb', name: 'Starbucks', cost: '500' },
    { logo: 'sp', name: 'Spotify', cost: '1,200' },
    { logo: 'nk', name: 'Nike', cost: '1,000' },
    { logo: 'sh', name: 'Sephora', cost: '800' },
  ];
  return (
    <View style={visualStyles.rewardsWrap}>
      {brands.map((b, i) => (
        <View
          key={b.name}
          style={[
            visualStyles.rewardCard,
            { transform: [{ rotate: `${(i % 2 === 0 ? -1 : 1) * 3}deg` }] },
          ]}
        >
          <View style={visualStyles.rewardLogo}>
            <Text style={visualStyles.rewardLogoText}>{b.logo}</Text>
          </View>
          <Text style={visualStyles.rewardBrand}>{b.name}</Text>
          <Text style={visualStyles.rewardCost}>{b.cost} brr</Text>
        </View>
      ))}
    </View>
  );
}

const VISUALS = {
  tasks: TasksVisual,
  streak: StreakVisual,
  rewards: RewardsVisual,
};

// ---------- MAIN ONBOARDING ----------

export default function OnboardingScreen({ navigation }) {
  const scrollRef = useRef(null);
  const [index, setIndex] = useState(0);

  const onScroll = (e) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) setIndex(i);
  };

  const handleNext = () => {
    if (index < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: width * (index + 1), animated: true });
    } else {
      navigation.replace('Login');
    }
  };

  const handleSkip = () => navigation.replace('Login');

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <StorkLogo width={64} />
        <Pressable onPress={handleSkip} hitSlop={16}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={styles.scroll}
      >
        {SLIDES.map((slide) => {
          const Visual = VISUALS[slide.visual];
          return (
            <View key={slide.key} style={[styles.slide, { width }]}>
              <View style={styles.visualWrap}>
                <View style={styles.decorBlob} />
                <Visual />
              </View>

              <View style={styles.textBlock}>
                <Text style={styles.eyebrow}>{slide.eyebrow}</Text>
                <Text style={styles.title}>
                  {slide.title}
                  <Text style={styles.titleItalic}>{slide.titleItalic}</Text>
                </Text>
                <Text style={styles.body}>{slide.body}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Footer — dots + next button */}
      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>
        <Pressable
          style={({ pressed }) => [styles.nextBtn, pressed && { opacity: 0.85 }]}
          onPress={handleNext}
        >
          <Text style={styles.nextBtnText}>
            {index === SLIDES.length - 1 ? 'Get started' : 'Next'}
          </Text>
          <Ionicons name="arrow-forward" size={18} color={colors.pink} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  skipText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.berry60,
  },
  scroll: { flex: 1 },
  slide: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  visualWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: 320,
  },
  decorBlob: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: colors.pink,
    opacity: 0.35,
  },
  textBlock: { paddingBottom: 20 },
  eyebrow: {
    fontFamily: fonts.bodySemi,
    fontSize: 11,
    color: colors.berry60,
    letterSpacing: 2,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 38,
    color: colors.berry,
    letterSpacing: -1,
    lineHeight: 42,
    marginBottom: 14,
  },
  titleItalic: {
    fontFamily: fonts.displayBold,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.berry80,
    lineHeight: 22,
    opacity: 0.8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  dots: { flexDirection: 'row', gap: 6 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.berry20,
  },
  dotActive: {
    width: 22,
    backgroundColor: colors.berry,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.berry,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 100,
  },
  nextBtnText: {
    fontFamily: fonts.bodySemi,
    color: colors.pink,
    fontSize: 15,
  },
});

// ---------- Visual-specific styles ----------
const visualStyles = StyleSheet.create({
  // Tasks visual
  tasksWrap: { gap: 12, width: '100%', paddingHorizontal: 20 },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.creamDark,
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  taskRowDone: {
    backgroundColor: colors.pink50,
    borderColor: colors.pink30,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: {
    backgroundColor: colors.berry,
    borderColor: colors.berry,
  },
  taskEmoji: { fontSize: 20 },
  taskText: {
    flex: 1,
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    color: colors.berry,
  },
  taskTextDone: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  taskXp: {
    fontFamily: fonts.displayBold,
    fontSize: 14,
    color: colors.berry,
  },

  // Streak visual
  streakWrap: { width: '100%', paddingHorizontal: 20, gap: 14 },
  streakCard: {
    borderRadius: 24,
    padding: 22,
    overflow: 'hidden',
  },
  streakBlob: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.pink,
    opacity: 0.2,
    top: -80,
    right: -40,
  },
  streakLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: 10,
    color: colors.pink,
    letterSpacing: 1.8,
    marginBottom: 8,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    marginBottom: 16,
  },
  streakNum: {
    fontFamily: fonts.display,
    fontSize: 64,
    color: colors.white,
    letterSpacing: -1,
    lineHeight: 60,
  },
  streakDays: {
    fontFamily: fonts.displaySemi,
    fontSize: 18,
    color: colors.pink,
  },
  streakSub: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.pink50,
    opacity: 0.75,
    marginTop: 2,
  },
  xpTrack: {
    height: 5,
    backgroundColor: colors.pinkTranslucent,
    borderRadius: 100,
    overflow: 'hidden',
  },
  xpFill: {
    width: '68%',
    height: '100%',
    backgroundColor: colors.pink,
    borderRadius: 100,
  },
  berryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-end',
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.creamDark,
  },
  berryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.pink,
  },
  berryPillText: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    color: colors.berry,
  },

  // Rewards visual
  rewardsWrap: {
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  rewardCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    width: 120,
    borderWidth: 1,
    borderColor: colors.creamDark,
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  rewardLogo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.pink50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  rewardLogoText: {
    fontFamily: fonts.displayBold,
    fontSize: 16,
    color: colors.berry,
  },
  rewardBrand: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.berry,
    marginBottom: 2,
  },
  rewardCost: {
    fontFamily: fonts.displaySemi,
    fontSize: 13,
    color: colors.berry,
    opacity: 0.7,
  },
});
