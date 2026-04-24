import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts } from '../theme';
import { getFriendById, AVATAR_GRADIENTS } from '../data/friends';

export default function FriendProfileScreen({ route, navigation }) {
  const { friendId } = route.params || {};
  const friend = getFriendById(friendId);

  if (!friend) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Friend not found</Text>
      </SafeAreaView>
    );
  }

  const doneToday = friend.today.filter((t) => t.done).length;
  const totalToday = friend.today.length;
  const progressPct = totalToday > 0 ? (doneToday / totalToday) * 100 : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.iconBtn}
            hitSlop={10}
          >
            <Ionicons name="arrow-back" size={22} color={colors.berry} />
          </Pressable>
          <Pressable style={styles.iconBtn} hitSlop={10}>
            <Ionicons name="ellipsis-horizontal" size={22} color={colors.berry} />
          </Pressable>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <LinearGradient
            colors={AVATAR_GRADIENTS[friend.avatar] || [colors.pink, colors.berry]}
            style={styles.bigAvatar}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.bigAvatarText}>{friend.avatar}</Text>
          </LinearGradient>
          <Text style={styles.name}>{friend.name}</Text>
          <View style={styles.levelBadge}>
            <Ionicons name="star" size={11} color={colors.berry} />
            <Text style={styles.levelText}>
              Level {friend.level} · {friend.title}
            </Text>
          </View>

          {/* Streak pill */}
          <View style={styles.streakPill}>
            <Text style={styles.streakFlame}>🔥</Text>
            <Text style={styles.streakText}>
              {friend.streak} day streak
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{friend.xp.toLocaleString()}</Text>
            <Text style={styles.statLabel}>TOTAL XP</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>
              {friend.berries >= 1000
                ? `${(friend.berries / 1000).toFixed(1)}k`
                : friend.berries}
            </Text>
            <Text style={styles.statLabel}>BERRIES</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>{friend.achievements}</Text>
            <Text style={styles.statLabel}>BADGES</Text>
          </View>
        </View>

        {/* Today's progress */}
        <View style={styles.sectHead}>
          <Text style={styles.sectTitle}>Today's progress</Text>
          <Text style={styles.sectLink}>
            {doneToday}/{totalToday} done
          </Text>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressHead}>
            <Text style={styles.progressBig}>
              {Math.round(progressPct)}
              <Text style={styles.progressPct}>%</Text>
            </Text>
            <Text style={styles.progressSub}>complete</Text>
          </View>
          <View style={styles.progressTrack}>
            <LinearGradient
              colors={[colors.pink, '#E590B8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${progressPct}%` }]}
            />
          </View>
        </View>

        {/* Today's tasks */}
        <View style={[styles.sectHead, { marginTop: 20 }]}>
          <Text style={styles.sectTitle}>Today's quests</Text>
        </View>

        <View style={styles.tasksList}>
          {friend.today.map((task, i) => (
            <View
              key={i}
              style={[styles.task, task.done && styles.taskDone]}
            >
              <View style={[styles.check, task.done && styles.checkOn]}>
                {task.done && (
                  <Ionicons name="checkmark" size={14} color={colors.pink} />
                )}
              </View>
              <View
                style={[
                  styles.taskIcon,
                  task.done && { backgroundColor: colors.pink30 },
                ]}
              >
                <Text style={styles.taskEmoji}>{task.emoji}</Text>
              </View>
              <Text
                style={[
                  styles.taskTitle,
                  task.done && styles.taskTitleDone,
                ]}
              >
                {task.title}
              </Text>
            </View>
          ))}
        </View>

        {/* Challenge CTA */}
        {!friend.you && (
          <Pressable
            style={({ pressed }) => [
              styles.challengeBtn,
              pressed && { opacity: 0.9 },
            ]}
          >
            <Ionicons name="flash" size={18} color={colors.pink} />
            <Text style={styles.challengeText}>Challenge {friend.name}</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },
  errorText: {
    fontFamily: 'Figtree_500Medium',
    color: colors.berry,
    padding: 24,
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
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
    paddingTop: 16,
    paddingBottom: 20,
  },
  bigAvatar: {
    width: 108,
    height: 108,
    borderRadius: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  bigAvatarText: {
    fontFamily: fonts.displayBold,
    color: colors.white,
    fontSize: 44,
  },
  name: {
    fontFamily: fonts.displayBold,
    fontSize: 32,
    color: colors.berry,
    letterSpacing: -0.5,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.pink,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
    marginTop: 8,
  },
  levelText: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.berry,
    letterSpacing: 0.3,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamDark,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    marginTop: 10,
  },
  streakFlame: { fontSize: 14 },
  streakText: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    color: colors.berry,
  },

  stats: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: 22,
    paddingVertical: 18,
    marginBottom: 24,
  },
  stat: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: colors.creamDark },
  statNum: {
    fontFamily: fonts.displayBold,
    fontSize: 22,
    color: colors.berry,
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
    marginBottom: 14,
  },
  sectTitle: {
    fontFamily: fonts.displaySemi,
    fontSize: 22,
    color: colors.berry,
    letterSpacing: -0.3,
  },
  sectLink: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.berry,
  },

  progressCard: {
    backgroundColor: colors.berry,
    borderRadius: 22,
    padding: 20,
  },
  progressHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 14,
  },
  progressBig: {
    fontFamily: fonts.displayBold,
    fontSize: 44,
    color: colors.pink,
    letterSpacing: -0.5,
  },
  progressPct: {
    fontSize: 24,
  },
  progressSub: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.pink50,
    opacity: 0.8,
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(246, 186, 214, 0.2)',
    borderRadius: 100,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 100,
  },

  tasksList: { gap: 8, marginBottom: 20 },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: 16,
    padding: 12,
  },
  taskDone: {
    backgroundColor: colors.pink50,
    borderColor: colors.pink30,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: {
    backgroundColor: colors.berry,
    borderColor: colors.berry,
  },
  taskIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.pink50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskEmoji: { fontSize: 18 },
  taskTitle: {
    flex: 1,
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    color: colors.berry,
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },

  challengeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.berry,
    paddingVertical: 16,
    borderRadius: 100,
    marginTop: 8,
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  challengeText: {
    fontFamily: fonts.displayBold,
    color: colors.pink,
    fontSize: 15,
    letterSpacing: 0.2,
  },
});
