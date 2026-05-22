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
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts } from '../theme';
import { FRIENDS, AVATAR_GRADIENTS } from '../data/friends';

export default function FriendProfileScreen({ route, navigation }) {
  const friendId = route?.params?.friendId ?? 1;
  const friend = FRIENDS.find((f) => f.id === friendId) ?? FRIENDS[0];

  const gradient = AVATAR_GRADIENTS[friend.name] || ['#F6BAD6', '#E89BC4'];

  const heroAnim = useRef(new Animated.Value(0)).current;
  const sectionAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(140, [
      Animated.timing(heroAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(sectionAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  // === NEW: open challenge picker for this friend ===
  const handleChallenge = () => {
    navigation.navigate('ChallengeCreate', { friendId: friend.id });
  };

  const doneCount = friend.todayTasks.filter((t) => t.done).length;
  const totalToday = friend.todayTasks.length;
  const progressPct = totalToday > 0 ? Math.round((doneCount / totalToday) * 100) : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn} hitSlop={8}>
          <Ionicons name="chevron-back" size={22} color={colors.berry} />
        </Pressable>
        <Text style={styles.topBarTitle}>{friend.name}</Text>
        <Pressable style={styles.iconBtn} hitSlop={8}>
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.berry} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
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
          <View style={styles.hero}>
            <LinearGradient colors={gradient} style={styles.bigAvatar}>
              <Text style={styles.bigAvatarInitial}>{friend.name[0]}</Text>
            </LinearGradient>
            <Text style={styles.name}>{friend.name}</Text>
            <Text style={styles.handle}>{friend.handle}</Text>

            <View style={styles.heroBadges}>
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>LEVEL {friend.level}</Text>
              </View>
              <View style={styles.streakPill}>
                <Text style={styles.streakPillEmoji}>🔥</Text>
                <Text style={styles.streakPillText}>{friend.streak}-day streak</Text>
              </View>
            </View>

            {friend.bio && <Text style={styles.bio}>{friend.bio}</Text>}
          </View>
        </Animated.View>

        {/* Quick stats */}
        <Animated.View
          style={[
            styles.statsRow,
            {
              opacity: sectionAnim,
              transform: [
                {
                  translateY: sectionAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [12, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{friend.stats.totalQuests}</Text>
            <Text style={styles.statLabel}>QUESTS</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{friend.stats.perfectDays}</Text>
            <Text style={styles.statLabel}>PERFECT</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{friend.stats.longestStreak}</Text>
            <Text style={styles.statLabel}>LONGEST</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{friend.stats.thisWeek}</Text>
            <Text style={styles.statLabel}>WEEK</Text>
          </View>
        </Animated.View>

        {/* Highlights */}
        <View style={styles.sectHead}>
          <Text style={styles.sectTitle}>
            <Text style={styles.sectTitleItalic}>Best of</Text> {friend.name}
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.highlightsRow}
        >
          {friend.highlights.map((h, i) => (
            <LinearGradient
              key={i}
              colors={i === 0 ? [colors.berry, colors.berry80] : [colors.white, colors.cream]}
              style={[
                styles.highlightCard,
                i !== 0 && { borderWidth: 1, borderColor: colors.creamDark },
              ]}
            >
              <Text style={styles.highlightEmoji}>{h.emoji}</Text>
              <Text style={[styles.highlightTitle, i === 0 && { color: colors.pink }]}>
                {h.title}
              </Text>
              <Text style={[styles.highlightSub, i === 0 && { color: colors.creamDark }]}>
                {h.sub}
              </Text>
            </LinearGradient>
          ))}
        </ScrollView>

        {/* Today's progress */}
        <View style={styles.sectHead}>
          <Text style={styles.sectTitle}>
            <Text style={styles.sectTitleItalic}>Today's</Text> progress
          </Text>
        </View>
        <View style={styles.progressCard}>
          <View style={styles.progressTop}>
            <View>
              <Text style={styles.progressLabel}>QUESTS COMPLETED</Text>
              <Text style={styles.progressBig}>
                {doneCount}
                <Text style={styles.progressBigSlash}>/{totalToday}</Text>
              </Text>
            </View>
            <View style={styles.progressRing}>
              <Text style={styles.progressRingText}>{progressPct}%</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
          </View>
          <View style={{ gap: 8 }}>
            {friend.todayTasks.map((task, i) => (
              <View key={i} style={styles.miniTask}>
                <View
                  style={[
                    styles.miniCheck,
                    task.done && { backgroundColor: colors.berry, borderColor: colors.berry },
                  ]}
                >
                  {task.done && (
                    <Ionicons name="checkmark" size={10} color={colors.pink} />
                  )}
                </View>
                <Text style={styles.miniTaskEmoji}>{task.emoji}</Text>
                <Text
                  style={[
                    styles.miniTaskTitle,
                    task.done && { textDecorationLine: 'line-through', opacity: 0.5 },
                  ]}
                >
                  {task.title}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.sectHead}>
          <Text style={styles.sectTitle}>
            <Text style={styles.sectTitleItalic}>Achievements</Text>
          </Text>
          <Text style={styles.sectMeta}>
            {friend.badges.filter((b) => b.earned).length}/{friend.badges.length} earned
          </Text>
        </View>
        <View style={styles.badgesGrid}>
          {friend.badges.map((b, i) => (
            <View
              key={i}
              style={[styles.badge, b.earned ? styles.badgeEarned : styles.badgeLocked]}
            >
              <Text style={[styles.badgeEmoji, !b.earned && { opacity: 0.3 }]}>
                {b.emoji}
              </Text>
              <Text
                style={[styles.badgeTitle, !b.earned && { color: colors.berry40 }]}
                numberOfLines={1}
              >
                {b.title}
              </Text>
            </View>
          ))}
        </View>

        {/* Favorite habits */}
        <View style={styles.sectHead}>
          <Text style={styles.sectTitle}>
            <Text style={styles.sectTitleItalic}>Favorite</Text> habits
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.habitsRow}
        >
          {friend.favoriteHabits.map((h, i) => (
            <View key={i} style={styles.habitChip}>
              <Text style={styles.habitEmoji}>{h.emoji}</Text>
              <View>
                <Text style={styles.habitName}>{h.name}</Text>
                <Text style={styles.habitStreak}>🔥 {h.streak} days</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Activity feed */}
        <View style={styles.sectHead}>
          <Text style={styles.sectTitle}>
            <Text style={styles.sectTitleItalic}>Recent</Text> activity
          </Text>
        </View>
        <View style={styles.activityList}>
          {friend.activity.map((a, i) => (
            <View key={i} style={styles.activityRow}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityEmoji}>{a.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.activityTitle}>{a.title}</Text>
                <View style={styles.activityMeta}>
                  <Text style={styles.activityMetaText}>{a.meta}</Text>
                  {a.verified && (
                    <View style={styles.verifiedTag}>
                      <Ionicons name="checkmark-circle" size={9} color={colors.berry} />
                      <Text style={styles.verifiedTagText}>Verified</Text>
                    </View>
                  )}
                </View>
              </View>
              <Text style={styles.activityXp}>+{a.xp}</Text>
            </View>
          ))}
        </View>

        {/* Challenge CTA — NOW WIRED UP */}
        {!friend.isCurrentUser && (
          <Pressable
            onPress={handleChallenge}
            style={({ pressed }) => [
              styles.challengeBtn,
              pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
            ]}
          >
            <Ionicons name="flash" size={18} color={colors.pink} />
            <Text style={styles.challengeBtnText}>Challenge {friend.name}</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  scroll: { paddingHorizontal: 24, paddingBottom: 60 },

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
    fontFamily: fonts.displayBold,
    fontSize: 16,
    color: colors.berry,
  },

  hero: { alignItems: 'center', paddingVertical: 16 },
  bigAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  bigAvatarInitial: {
    fontFamily: fonts.displayBold,
    fontSize: 40,
    color: colors.white,
  },
  name: {
    fontFamily: fonts.displayBold,
    fontSize: 26,
    color: colors.berry,
    letterSpacing: -0.5,
  },
  handle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.berry60,
    marginTop: 2,
  },
  heroBadges: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  levelBadge: {
    backgroundColor: colors.berry,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  levelBadgeText: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: colors.pink,
    letterSpacing: 1,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.pink,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  streakPillEmoji: { fontSize: 12 },
  streakPillText: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    color: colors.berry,
  },
  bio: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.berry80,
    textAlign: 'center',
    marginTop: 14,
    paddingHorizontal: 20,
    lineHeight: 18,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statNum: {
    fontFamily: fonts.displayBold,
    fontSize: 18,
    color: colors.berry,
  },
  statLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 9,
    color: colors.berry60,
    letterSpacing: 1,
    marginTop: 2,
  },

  sectHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 12,
  },
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
  sectMeta: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.berry60,
  },

  highlightsRow: { gap: 10, paddingRight: 24 },
  highlightCard: {
    width: 160,
    borderRadius: 18,
    padding: 16,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  highlightEmoji: { fontSize: 28 },
  highlightTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 14,
    color: colors.berry,
    marginTop: 8,
  },
  highlightSub: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.berry60,
    marginTop: 2,
    lineHeight: 14,
  },

  progressCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: 20,
    padding: 18,
    gap: 14,
  },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: colors.berry60,
    letterSpacing: 1,
    marginBottom: 4,
  },
  progressBig: {
    fontFamily: fonts.displayBold,
    fontSize: 28,
    color: colors.berry,
  },
  progressBigSlash: {
    fontFamily: fonts.displayBold,
    fontSize: 18,
    color: colors.berry60,
  },
  progressRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.pink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRingText: {
    fontFamily: fonts.displayBold,
    fontSize: 14,
    color: colors.berry,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.cream,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.berry,
    borderRadius: 3,
  },
  miniTask: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  miniCheck: {
    width: 16,
    height: 16,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniTaskEmoji: { fontSize: 14 },
  miniTaskTitle: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.berry,
  },

  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badge: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    paddingHorizontal: 4,
  },
  badgeEarned: {
    backgroundColor: colors.pink,
    borderColor: colors.pink,
  },
  badgeLocked: {
    backgroundColor: colors.white,
    borderColor: colors.creamDark,
  },
  badgeEmoji: { fontSize: 20 },
  badgeTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 8,
    color: colors.berry,
    marginTop: 3,
    letterSpacing: 0.2,
    textAlign: 'center',
  },

  habitsRow: { gap: 10, paddingRight: 24 },
  habitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  habitEmoji: { fontSize: 22 },
  habitName: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.berry,
  },
  habitStreak: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.berry60,
    marginTop: 1,
  },

  activityList: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: 18,
    overflow: 'hidden',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.creamDark,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.pink50 || colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityEmoji: { fontSize: 18 },
  activityTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.berry,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  activityMetaText: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.berry60,
  },
  activityXp: {
    fontFamily: fonts.displayBold,
    fontSize: 14,
    color: colors.berry,
  },

  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.pink,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 100,
  },
  verifiedTagText: {
    fontFamily: fonts.bodyBold,
    fontSize: 8,
    color: colors.berry,
    letterSpacing: 0.2,
  },

  challengeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.berry,
    paddingVertical: 16,
    borderRadius: 100,
    marginTop: 24,
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  challengeBtnText: {
    fontFamily: fonts.displayBold,
    fontSize: 14,
    color: colors.pink,
    letterSpacing: 0.3,
  },
});
