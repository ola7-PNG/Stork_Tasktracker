import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts } from '../theme';
import { FRIENDS, AVATAR_GRADIENTS } from '../data/friends';

// Available challenge types
export const CHALLENGE_TYPES = [
  {
    id: 'hydration',
    emoji: '💧',
    title: 'Hydration Battle',
    sub: 'First to 7 perfect days of hitting your water goal',
    duration: 7,
    color: '#4FB3E8',
  },
  {
    id: 'fitness',
    emoji: '🏃',
    title: 'Fitness Streak',
    sub: 'Most workouts logged in 7 days',
    duration: 7,
    color: '#FF8585',
  },
  {
    id: 'reading',
    emoji: '📚',
    title: 'Reading Race',
    sub: 'Read 30 min/day for 7 days straight',
    duration: 7,
    color: '#9D7FE8',
  },
  {
    id: 'xp',
    emoji: '🔥',
    title: 'XP Showdown',
    sub: 'Most XP earned this week',
    duration: 7,
    color: '#FFB45F',
  },
];

export default function ChallengeCreateScreen({ route, navigation }) {
  const friendId = route?.params?.friendId ?? 1;
  const friend = FRIENDS.find((f) => f.id === friendId) ?? FRIENDS[0];
  const gradient = AVATAR_GRADIENTS[friend.name] || ['#F6BAD6', '#E89BC4'];

  const [selectedId, setSelectedId] = useState(null);

  // Entrance animations
  const headerAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = useRef(CHALLENGE_TYPES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 480,
        useNativeDriver: true,
      }),
      Animated.stagger(
        80,
        cardAnims.map((a) =>
          Animated.timing(a, {
            toValue: 1,
            duration: 380,
            useNativeDriver: true,
          })
        )
      ),
    ]).start();
  }, []);

  const handleSend = () => {
    if (!selectedId) return;
    const challenge = CHALLENGE_TYPES.find((c) => c.id === selectedId);
    navigation.replace('ChallengeChat', {
      friendId: friend.id,
      challengeId: challenge.id,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.handle} />
      </View>

      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>NEW CHALLENGE</Text>
          <Text style={styles.title}>
            Challenge <Text style={styles.titleAccent}>{friend.name}</Text>
          </Text>
        </View>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.closeBtn}
          hitSlop={10}
        >
          <Ionicons name="close" size={22} color={colors.berry} />
        </Pressable>
      </View>

      {/* Friend card */}
      <Animated.View
        style={[
          styles.friendCard,
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
        <LinearGradient colors={gradient} style={styles.friendAvatar}>
          <Text style={styles.friendInitial}>{friend.name[0]}</Text>
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <Text style={styles.friendName}>{friend.name}</Text>
          <Text style={styles.friendMeta}>
            Level {friend.level} · {friend.streak}-day streak
          </Text>
        </View>
        <View style={styles.vsTag}>
          <Text style={styles.vsTagText}>VS</Text>
        </View>
      </Animated.View>

      <Text style={styles.subhead}>Pick your battle</Text>

      <ScrollView
        contentContainerStyle={styles.cardsScroll}
        showsVerticalScrollIndicator={false}
      >
        {CHALLENGE_TYPES.map((c, i) => {
          const selected = c.id === selectedId;
          return (
            <Animated.View
              key={c.id}
              style={{
                opacity: cardAnims[i],
                transform: [
                  {
                    translateY: cardAnims[i].interpolate({
                      inputRange: [0, 1],
                      outputRange: [16, 0],
                    }),
                  },
                ],
              }}
            >
              <Pressable
                onPress={() => setSelectedId(c.id)}
                style={({ pressed }) => [
                  styles.challengeCard,
                  selected && styles.challengeCardSelected,
                  pressed && { transform: [{ scale: 0.98 }] },
                ]}
              >
                <View
                  style={[
                    styles.challengeIcon,
                    { backgroundColor: selected ? colors.pink : colors.cream },
                  ]}
                >
                  <Text style={styles.challengeEmoji}>{c.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.challengeTitle,
                      selected && { color: colors.pink },
                    ]}
                  >
                    {c.title}
                  </Text>
                  <Text
                    style={[
                      styles.challengeSub,
                      selected && { color: colors.creamDark },
                    ]}
                  >
                    {c.sub}
                  </Text>
                  <View style={styles.challengeMetaRow}>
                    <View
                      style={[
                        styles.durationPill,
                        selected && { backgroundColor: 'rgba(246,186,214,0.2)' },
                      ]}
                    >
                      <Ionicons
                        name="time-outline"
                        size={10}
                        color={selected ? colors.pink : colors.berry60}
                      />
                      <Text
                        style={[
                          styles.durationText,
                          selected && { color: colors.pink },
                        ]}
                      >
                        {c.duration} days
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={[
                    styles.radio,
                    selected && {
                      backgroundColor: colors.pink,
                      borderColor: colors.pink,
                    },
                  ]}
                >
                  {selected && (
                    <Ionicons name="checkmark" size={12} color={colors.berry} />
                  )}
                </View>
              </Pressable>
            </Animated.View>
          );
        })}
      </ScrollView>

      <View style={styles.bottomActions}>
        <Pressable
          onPress={handleSend}
          disabled={!selectedId}
          style={({ pressed }) => [
            styles.sendBtn,
            !selectedId && styles.sendBtnDisabled,
            pressed && selectedId && { opacity: 0.9 },
          ]}
        >
          <Ionicons name="flash" size={18} color={colors.pink} />
          <Text style={styles.sendBtnText}>
            {selectedId ? `Challenge ${friend.name}` : 'Pick a challenge'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  topBar: { alignItems: 'center', paddingTop: 8 },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.creamDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 18,
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
    fontSize: 28,
    color: colors.berry,
    letterSpacing: -0.6,
  },
  titleAccent: {
    fontFamily: fonts.displayItalic || fonts.displayBold,
    fontStyle: 'italic',
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

  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginHorizontal: 24,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: 18,
    padding: 14,
    marginBottom: 20,
  },
  friendAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendInitial: {
    fontFamily: fonts.displayBold,
    fontSize: 18,
    color: colors.white,
  },
  friendName: {
    fontFamily: fonts.displayBold,
    fontSize: 16,
    color: colors.berry,
  },
  friendMeta: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.berry60,
    marginTop: 2,
  },
  vsTag: {
    backgroundColor: colors.berry,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  vsTagText: {
    fontFamily: fonts.displayBold,
    fontSize: 11,
    color: colors.pink,
    letterSpacing: 1,
  },

  subhead: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    color: colors.berry60,
    letterSpacing: 1.5,
    paddingHorizontal: 24,
    marginBottom: 12,
  },

  cardsScroll: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 10,
  },
  challengeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.creamDark,
    borderRadius: 18,
    padding: 14,
  },
  challengeCardSelected: {
    backgroundColor: colors.berry,
    borderColor: colors.berry,
  },
  challengeIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeEmoji: { fontSize: 24 },
  challengeTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 15,
    color: colors.berry,
  },
  challengeSub: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.berry60,
    marginTop: 2,
    lineHeight: 14,
  },
  challengeMetaRow: { flexDirection: 'row', marginTop: 8 },
  durationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.cream,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
  },
  durationText: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: colors.berry60,
    letterSpacing: 0.3,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.creamDark,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomActions: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 12 },
  sendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.berry,
    paddingVertical: 16,
    borderRadius: 100,
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 6,
  },
  sendBtnDisabled: {
    backgroundColor: colors.creamDark,
    opacity: 0.6,
    shadowOpacity: 0,
  },
  sendBtnText: {
    fontFamily: fonts.displayBold,
    color: colors.pink,
    fontSize: 14,
    letterSpacing: 0.3,
  },
});
