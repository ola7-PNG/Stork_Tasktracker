import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts } from '../theme';
import { FRIENDS, AVATAR_GRADIENTS } from '../data/friends';

const FILTERS = ['This week', 'All time'];

// Friends are already sorted in the data file, but re-sort to be safe
const RANKED = [...FRIENDS]
  .sort((a, b) => b.xp - a.xp)
  .map((f, i) => ({ ...f, rank: i + 1 }));

export default function LeaderboardScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('This week');

  const top3 = RANKED.slice(0, 3);

  const openFriend = (friend) => {
    if (friend.you) {
      // If "you" is tapped, switch to the Profile tab instead
      navigation.navigate('Profile');
    } else {
      navigation.navigate('FriendProfile', { friendId: friend.id });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.head}>
          <Text style={styles.title}>Leaderboard</Text>
          <Text style={styles.sub}>Tap a friend to see their progress</Text>
        </View>

        {/* Filters */}
        <View style={styles.filters}>
          {FILTERS.map((f) => (
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
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Podium */}
        <View style={styles.podium}>
          <PodiumPlace
            friend={top3[1]}
            height={96}
            position="second"
            onPress={openFriend}
          />
          <PodiumPlace
            friend={top3[0]}
            height={128}
            position="first"
            onPress={openFriend}
          />
          <PodiumPlace
            friend={top3[2]}
            height={72}
            position="third"
            onPress={openFriend}
          />
        </View>

        {/* Full list */}
        <View style={styles.sectHead}>
          <Text style={styles.sectTitle}>Full rankings</Text>
          <Text style={styles.sectLink}>{RANKED.length} friends</Text>
        </View>

        <View style={styles.list}>
          {RANKED.map((f) => (
            <RankRow key={f.id} friend={f} onPress={openFriend} />
          ))}
        </View>

        {/* Invite CTA */}
        <Pressable
          style={({ pressed }) => [styles.inviteBtn, pressed && { opacity: 0.9 }]}
        >
          <Ionicons name="person-add" size={18} color={colors.pink} />
          <Text style={styles.inviteText}>Invite friends</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function PodiumPlace({ friend, height, position, onPress }) {
  if (!friend) return null;
  const medals = { first: '🥇', second: '🥈', third: '🥉' };

  return (
    <Pressable
      style={styles.podiumCol}
      onPress={() => onPress(friend)}
      hitSlop={4}
    >
      <View style={styles.podiumTop}>
        <LinearGradient
          colors={AVATAR_GRADIENTS[friend.avatar] || [colors.pink, colors.berry]}
          style={[
            styles.podiumAvatar,
            position === 'first' && styles.podiumAvatarFirst,
            friend.you && styles.podiumAvatarYou,
          ]}
        >
          <Text
            style={[
              styles.podiumAvatarText,
              position === 'first' && { fontSize: 28 },
            ]}
          >
            {friend.avatar}
          </Text>
        </LinearGradient>
        <Text style={styles.podiumMedal}>{medals[position]}</Text>
        <Text style={styles.podiumName}>
          {friend.name}
          {friend.you && <Text style={styles.podiumYou}> · You</Text>}
        </Text>
        <Text style={styles.podiumXp}>{friend.xp.toLocaleString()} XP</Text>
      </View>
      <LinearGradient
        colors={
          position === 'first'
            ? [colors.pink, '#E590B8']
            : [colors.berry80, colors.berry]
        }
        style={[
          styles.podiumBase,
          { height },
          position === 'first' && styles.podiumBaseFirst,
        ]}
      >
        <Text
          style={[
            styles.podiumRank,
            position === 'first' ? { color: colors.berry } : null,
          ]}
        >
          {friend.rank}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

function RankRow({ friend, onPress }) {
  return (
    <Pressable
      onPress={() => onPress(friend)}
      style={({ pressed }) => [
        styles.row,
        friend.you && styles.rowYou,
        pressed && { opacity: 0.7 },
      ]}
    >
      <Text style={[styles.rowRank, friend.you && styles.rowRankYou]}>
        #{friend.rank}
      </Text>
      <LinearGradient
        colors={AVATAR_GRADIENTS[friend.avatar] || [colors.pink, colors.berry]}
        style={styles.rowAvatar}
      >
        <Text style={styles.rowAvatarText}>{friend.avatar}</Text>
      </LinearGradient>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowName}>
          {friend.name}
          {friend.you && <Text style={styles.rowYouTag}> · You</Text>}
        </Text>
        <Text style={styles.rowMeta}>🔥 {friend.streak} day streak</Text>
      </View>
      <View style={styles.rowRight}>
        <Text style={styles.rowXp}>{friend.xp.toLocaleString()}</Text>
        <Ionicons
          name="chevron-forward"
          size={16}
          color={friend.you ? colors.berry : colors.berry60}
        />
      </View>
    </Pressable>
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
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
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

  // Podium
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  podiumCol: { flex: 1, alignItems: 'center' },
  podiumTop: { alignItems: 'center', marginBottom: 10 },
  podiumAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
    marginBottom: 6,
  },
  podiumAvatarFirst: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: colors.pink,
  },
  podiumAvatarYou: { borderColor: colors.pink },
  podiumAvatarText: {
    fontFamily: fonts.displayBold,
    fontSize: 22,
    color: colors.white,
  },
  podiumMedal: { fontSize: 20, marginBottom: 4 },
  podiumName: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.berry,
  },
  podiumYou: {
    fontFamily: fonts.bodyMedium,
    color: colors.berry60,
    fontSize: 11,
  },
  podiumXp: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.berry60,
    marginTop: 2,
  },
  podiumBase: {
    width: '100%',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  podiumBaseFirst: {
    shadowColor: colors.pink,
    shadowOpacity: 0.4,
  },
  podiumRank: {
    fontFamily: fonts.displayBold,
    fontSize: 32,
    color: colors.pink,
    letterSpacing: -0.5,
  },

  // List
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
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.berry60,
  },
  list: { gap: 8, marginBottom: 20 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  rowYou: {
    backgroundColor: colors.pink,
    borderColor: colors.pink,
  },
  rowRank: {
    fontFamily: fonts.displayBold,
    fontSize: 16,
    color: colors.berry60,
    width: 32,
  },
  rowRankYou: { color: colors.berry },
  rowAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  rowAvatarText: {
    fontFamily: fonts.displayBold,
    fontSize: 14,
    color: colors.white,
  },
  rowName: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.berry,
    marginBottom: 2,
  },
  rowYouTag: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.berry60,
  },
  rowMeta: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.berry60,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowXp: {
    fontFamily: fonts.displaySemi,
    fontSize: 15,
    color: colors.berry,
  },

  inviteBtn: {
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
  inviteText: {
    fontFamily: fonts.bodySemi,
    color: colors.pink,
    fontSize: 15,
    letterSpacing: 0.2,
  },
});
