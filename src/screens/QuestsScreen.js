import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, fonts } from '../theme';

const FILTERS = ['All', 'Daily', 'Weekly', 'Monthly', 'Special'];

const QUESTS = [
  {
    id: 1,
    category: 'Monthly',
    icon: '🏆',
    before: 'The ',
    italic: 'Iron Month',
    after: '',
    desc: 'Complete all your daily wellness quests for 30 consecutive days.',
    reward: '+500 XP',
    progress: 0.4,
    label: '12/30',
    featured: true,
  },
  {
    id: 2,
    category: 'Weekly',
    icon: '💧',
    before: '',
    italic: 'Hydration',
    after: ' hero',
    desc: 'Hit your water goal 7 days in a row this week.',
    reward: '+150 XP',
    progress: 0.71,
    label: '5/7',
  },
  {
    id: 3,
    category: 'Special',
    icon: '📖',
    before: 'Read a ',
    italic: 'whole book',
    after: '',
    desc: 'Finish one book within 14 days.',
    reward: '+200 XP',
    progress: 0.55,
    label: '170/310 pg',
  },
  {
    id: 4,
    category: 'Weekly',
    icon: '🧘',
    before: '',
    italic: 'Zen',
    after: ' week',
    desc: 'Meditate every day for 7 days straight.',
    reward: '+100 XP',
    progress: 0.28,
    label: '2/7',
  },
  {
    id: 5,
    category: 'Daily',
    icon: '✅',
    before: '',
    italic: 'Perfect day',
    after: '',
    desc: 'Complete all of today\'s quests before midnight.',
    reward: '+50 XP',
    progress: 0.6,
    label: '3/5',
  },
  {
    id: 6,
    category: 'Daily',
    icon: '👟',
    before: '',
    italic: '10k steps',
    after: ' today',
    desc: 'Hit ten thousand steps today and log them automatically.',
    reward: '+40 XP',
    progress: 0.72,
    label: '7,200',
  },
  {
    id: 7,
    category: 'Weekly',
    icon: '💪',
    before: 'Workout ',
    italic: '5 times',
    after: '',
    desc: 'Log a full workout on five different days this week.',
    reward: '+180 XP',
    progress: 0.4,
    label: '2/5',
  },
  {
    id: 8,
    category: 'Monthly',
    icon: '📚',
    before: 'Read ',
    italic: '4 books',
    after: '',
    desc: 'Finish four books in a single month.',
    reward: '+400 XP',
    progress: 0.25,
    label: '1/4',
  },
  {
    id: 9,
    category: 'Special',
    icon: '👯',
    before: 'Invite a ',
    italic: 'friend',
    after: '',
    desc: 'Get a friend to sign up and complete their first quest.',
    reward: '+250 XP',
    progress: 0,
    label: '0/1',
  },
];

export default function QuestsScreen() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered =
    activeFilter === 'All'
      ? QUESTS
      : QUESTS.filter((q) => q.category === activeFilter);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.head}>
          <Text style={styles.title}>Quests</Text>
          <Text style={styles.sub}>Bigger challenges, bigger rewards</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {FILTERS.map((f) => {
            const count =
              f === 'All' ? QUESTS.length : QUESTS.filter((q) => q.category === f).length;
            return (
              <Pressable
                key={f}
                onPress={() => setActiveFilter(f)}
                style={[
                  styles.filterPill,
                  activeFilter === f && styles.filterPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeFilter === f && styles.filterTextActive,
                  ]}
                >
                  {f}
                  <Text style={styles.filterCount}> · {count}</Text>
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.questsList}>
          {filtered.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyTitle}>No {activeFilter.toLowerCase()} quests</Text>
              <Text style={styles.emptySub}>
                Check back soon — new quests drop regularly
              </Text>
            </View>
          ) : (
            filtered.map((q) => <QuestCard key={q.id} quest={q} />)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuestCard({ quest }) {
  return (
    <View style={[styles.card, quest.featured && styles.cardFeatured]}>
      <View style={styles.cardTop}>
        <View style={styles.iconRow}>
          <Text style={styles.cardIcon}>{quest.icon}</Text>
          <View style={styles.categoryChip}>
            <Text style={styles.categoryText}>{quest.category}</Text>
          </View>
        </View>
        <View style={styles.reward}>
          <Text style={styles.rewardText}>{quest.reward}</Text>
        </View>
      </View>
      <Text style={styles.cardTitle}>
        {quest.before}
        <Text style={styles.cardTitleItalic}>{quest.italic}</Text>
        {quest.after}
      </Text>
      <Text style={styles.cardDesc}>{quest.desc}</Text>
      <View style={styles.progressRow}>
        <View style={[styles.track, quest.featured && styles.trackFeatured]}>
          <View style={[styles.fill, { width: `${quest.progress * 100}%` }]} />
        </View>
        <Text style={styles.progressLabel}>{quest.label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  scroll: { paddingHorizontal: 24, paddingBottom: 120 },
  head: { paddingTop: 20, paddingBottom: 18 },
  title: {
    fontFamily: fonts.displayBold,
    fontSize: 38,
    color: colors.berry,
    letterSpacing: -0.5,
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.berry60,
    marginTop: 6,
  },
  filters: {
    gap: 8,
    paddingBottom: 4,
    marginBottom: 20,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: 100,
  },
  filterPillActive: {
    backgroundColor: colors.berry,
    borderColor: colors.berry,
  },
  filterText: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    color: colors.berry80,
  },
  filterTextActive: { color: colors.pink },
  filterCount: {
    opacity: 0.6,
    fontFamily: fonts.body,
  },

  questsList: { gap: 12, marginTop: 4 },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: 22,
    padding: 18,
  },
  cardFeatured: {
    backgroundColor: colors.pink,
    borderColor: colors.pink,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardIcon: { fontSize: 28 },
  categoryChip: {
    backgroundColor: colors.cream,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
  },
  categoryText: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: colors.berry,
    letterSpacing: 0.5,
  },
  reward: {
    backgroundColor: colors.berry,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  rewardText: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    color: colors.pink,
    letterSpacing: 0.4,
  },
  cardTitle: {
    fontFamily: fonts.displaySemi,
    fontSize: 20,
    color: colors.berry,
    letterSpacing: -0.3,
    lineHeight: 24,
    marginBottom: 6,
  },
  cardTitleItalic: {
    fontFamily: fonts.displayBold,
  },
  cardDesc: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.berry80,
    opacity: 0.7,
    lineHeight: 16,
    marginBottom: 14,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  track: {
    flex: 1,
    height: 5,
    backgroundColor: colors.berry10,
    borderRadius: 100,
    overflow: 'hidden',
  },
  trackFeatured: {
    backgroundColor: colors.berry20,
  },
  fill: {
    height: '100%',
    backgroundColor: colors.berry,
    borderRadius: 100,
  },
  progressLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    color: colors.berry,
  },

  // Empty state
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 14 },
  emptyTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 20,
    color: colors.berry,
    marginBottom: 4,
  },
  emptySub: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.berry60,
    textAlign: 'center',
  },
});
