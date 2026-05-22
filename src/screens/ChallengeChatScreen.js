import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Animated,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts } from '../theme';
import { FRIENDS, AVATAR_GRADIENTS } from '../data/friends';
import { CHALLENGE_TYPES } from './ChallengeCreateScreen';

// Canned friend replies — picked at random when user sends a message.
// Grouped by tone so it feels less repetitive.
const TRASH_TALK = [
  'Easy money 😎',
  'You\'re gonna lose this one',
  'Where you at? 👀',
  'Catching up to me, huh?',
  'Cute attempt',
  'Game still on lol',
  'I see you 👀',
];

const HYPE = [
  'Let\'s gooo 🔥',
  'Bring it on!',
  'Don\'t even play 💪',
  'Game on',
  'Watch this 💯',
];

const REACTIONS = [
  'Lol',
  'lmao',
  '😂',
  '💀',
  'OK OK',
  'Fair',
  'Touché 😏',
];

function randomReply() {
  const pool = Math.random() < 0.4 ? HYPE : Math.random() < 0.7 ? TRASH_TALK : REACTIONS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function ChallengeChatScreen({ route, navigation }) {
  const friendId = route?.params?.friendId ?? 1;
  const challengeId = route?.params?.challengeId ?? 'hydration';

  const friend = FRIENDS.find((f) => f.id === friendId) ?? FRIENDS[0];
  const challenge =
    CHALLENGE_TYPES.find((c) => c.id === challengeId) ?? CHALLENGE_TYPES[0];

  const gradient = AVATAR_GRADIENTS[friend.name] || ['#F6BAD6', '#E89BC4'];

  // Initial seeded message thread
  const [messages, setMessages] = useState([
    {
      id: 'm0',
      type: 'system',
      text: `You challenged ${friend.name} to ${challenge.title} ${challenge.emoji}`,
      time: 'just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [theyAreTyping, setTheyAreTyping] = useState(false);
  const scrollRef = useRef(null);

  // Status card — simulated live progress (mock values)
  const [myProgress] = useState({ done: 18, total: 24 });
  const [theirProgress] = useState({ done: 22, total: 24 });
  const myPct = (myProgress.done / myProgress.total) * 100;
  const theirPct = (theirProgress.done / theirProgress.total) * 100;
  const theyAhead = theirProgress.done > myProgress.done;

  // Entrance animations
  const statusAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(statusAnim, {
      toValue: 1,
      duration: 540,
      useNativeDriver: true,
    }).start();

    // After 1.5s, friend "accepts"
    const t1 = setTimeout(() => {
      addMessage({
        type: 'them',
        text: 'Game on 💪',
        time: 'just now',
      });
    }, 1500);

    // After 3s, friend follows up
    const t2 = setTimeout(() => {
      addMessage({
        type: 'them',
        text: 'Been waiting for someone to challenge me 😏',
        time: 'just now',
      });
    }, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const addMessage = (msg) => {
    setMessages((prev) => [
      ...prev,
      { id: `m${Date.now()}-${Math.random()}`, ...msg },
    ]);
    // Scroll to bottom after a tick so layout updates
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 50);
  };

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    addMessage({ type: 'me', text, time: 'just now' });
    setInputText('');

    // Friend "replies" after 800-1800ms
    setTheyAreTyping(true);
    const delay = 800 + Math.random() * 1000;
    setTimeout(() => {
      setTheyAreTyping(false);
      addMessage({ type: 'them', text: randomReply(), time: 'just now' });
    }, delay);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.iconBtn}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={22} color={colors.berry} />
        </Pressable>
        <View style={styles.headerCenter}>
          <LinearGradient colors={gradient} style={styles.headerAvatar}>
            <Text style={styles.headerInitial}>{friend.name[0]}</Text>
          </LinearGradient>
          <View>
            <Text style={styles.headerName}>{friend.name}</Text>
            <View style={styles.activeRow}>
              <View style={styles.activeDot} />
              <Text style={styles.activeText}>Active now</Text>
            </View>
          </View>
        </View>
        <Pressable style={styles.iconBtn} hitSlop={8}>
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.berry} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={20}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Status card */}
          <Animated.View
            style={[
              {
                opacity: statusAnim,
                transform: [
                  {
                    translateY: statusAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [12, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={[colors.berry, colors.berry80]}
              style={styles.statusCard}
            >
              <View style={styles.statusTop}>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>
                    DAY 3 OF {challenge.duration}
                  </Text>
                </View>
                <Text style={styles.statusEmoji}>{challenge.emoji}</Text>
              </View>
              <Text style={styles.statusTitle}>{challenge.title}</Text>

              {/* Comparison bars */}
              <View style={styles.comparisonRow}>
                {/* You */}
                <View style={styles.compareCol}>
                  <View style={styles.compareLabel}>
                    <View style={[styles.compareDot, { backgroundColor: colors.pink }]} />
                    <Text style={styles.compareName}>You</Text>
                  </View>
                  <View style={styles.compareBar}>
                    <View
                      style={[
                        styles.compareFill,
                        { backgroundColor: colors.pink, width: `${myPct}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.compareScore}>
                    {myProgress.done}
                    <Text style={styles.compareScoreSlash}>/{myProgress.total}</Text>
                  </Text>
                </View>
                {/* Them */}
                <View style={styles.compareCol}>
                  <View style={styles.compareLabel}>
                    <LinearGradient
                      colors={gradient}
                      style={styles.compareAvatarDot}
                    />
                    <Text style={styles.compareName}>{friend.name}</Text>
                  </View>
                  <View style={styles.compareBar}>
                    <View
                      style={[
                        styles.compareFill,
                        { backgroundColor: colors.creamDark, width: `${theirPct}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.compareScore}>
                    {theirProgress.done}
                    <Text style={styles.compareScoreSlash}>/{theirProgress.total}</Text>
                  </Text>
                </View>
              </View>

              <View style={styles.statusFooter}>
                <Text style={styles.statusFooterText}>
                  {theyAhead
                    ? `${friend.name} is ahead by ${theirProgress.done - myProgress.done}`
                    : `You're ahead by ${myProgress.done - theirProgress.done}`}
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Message thread */}
          <View style={styles.messagesList}>
            {messages.map((msg) => (
              <MessageRow key={msg.id} msg={msg} friend={friend} gradient={gradient} />
            ))}
            {theyAreTyping && <TypingBubble gradient={gradient} />}
          </View>
        </ScrollView>

        {/* Input bar */}
        <View style={styles.inputBar}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder={`Message ${friend.name}…`}
            placeholderTextColor={colors.berry60}
            style={styles.input}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <Pressable
            onPress={handleSend}
            disabled={!inputText.trim()}
            style={({ pressed }) => [
              styles.sendBtn,
              !inputText.trim() && styles.sendBtnDisabled,
              pressed && inputText.trim() && { opacity: 0.85 },
            ]}
          >
            <Ionicons name="arrow-up" size={18} color={colors.pink} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ============================================================
//   MESSAGE COMPONENTS
// ============================================================

function MessageRow({ msg, friend, gradient }) {
  // Each message fades in from below on mount
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      friction: 7,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, []);

  const animStyle = {
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
    ],
  };

  if (msg.type === 'system') {
    return (
      <Animated.View style={[styles.systemMsgWrap, animStyle]}>
        <View style={styles.systemMsg}>
          <Ionicons name="flash" size={11} color={colors.berry60} />
          <Text style={styles.systemMsgText}>{msg.text}</Text>
        </View>
        <Text style={styles.timestamp}>{msg.time}</Text>
      </Animated.View>
    );
  }

  if (msg.type === 'them') {
    return (
      <Animated.View style={[styles.themRow, animStyle]}>
        <LinearGradient colors={gradient} style={styles.smallAvatar}>
          <Text style={styles.smallAvatarText}>{friend.name[0]}</Text>
        </LinearGradient>
        <View style={styles.themBubble}>
          <Text style={styles.themBubbleText}>{msg.text}</Text>
        </View>
      </Animated.View>
    );
  }

  // type === 'me'
  return (
    <Animated.View style={[styles.meRow, animStyle]}>
      <View style={styles.meBubble}>
        <Text style={styles.meBubbleText}>{msg.text}</Text>
      </View>
    </Animated.View>
  );
}

function TypingBubble({ gradient }) {
  const d1 = useRef(new Animated.Value(0)).current;
  const d2 = useRef(new Animated.Value(0)).current;
  const d3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = (val, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(val, {
            toValue: 1,
            duration: 400,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(val, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    const a = loop(d1, 0);
    const b = loop(d2, 150);
    const c = loop(d3, 300);
    a.start();
    b.start();
    c.start();
    return () => {
      a.stop();
      b.stop();
      c.stop();
    };
  }, []);

  const dotStyle = (val) => ({
    opacity: val.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
    transform: [
      {
        translateY: val.interpolate({ inputRange: [0, 1], outputRange: [0, -3] }),
      },
    ],
  });

  return (
    <View style={styles.themRow}>
      <LinearGradient colors={gradient} style={styles.smallAvatar} />
      <View style={[styles.themBubble, styles.typingBubble]}>
        <Animated.View style={[styles.typingDot, dotStyle(d1)]} />
        <Animated.View style={[styles.typingDot, dotStyle(d2)]} />
        <Animated.View style={[styles.typingDot, dotStyle(d3)]} />
      </View>
    </View>
  );
}

// ============================================================
//   STYLES
// ============================================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.creamDark,
    backgroundColor: colors.cream,
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
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    justifyContent: 'center',
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInitial: {
    fontFamily: fonts.displayBold,
    fontSize: 14,
    color: colors.white,
  },
  headerName: {
    fontFamily: fonts.displayBold,
    fontSize: 14,
    color: colors.berry,
  },
  activeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4FCF7F',
  },
  activeText: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.berry60,
  },

  // Scroll content
  scroll: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 6,
  },

  // Status card
  statusCard: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  statusTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  statusBadge: {
    backgroundColor: 'rgba(246,186,214,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  statusBadgeText: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: colors.pink,
    letterSpacing: 1,
  },
  statusEmoji: { fontSize: 22 },
  statusTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 18,
    color: colors.pink,
    marginBottom: 14,
  },
  comparisonRow: {
    flexDirection: 'row',
    gap: 14,
  },
  compareCol: { flex: 1 },
  compareLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 5,
  },
  compareDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  compareAvatarDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  compareName: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    color: colors.creamDark,
  },
  compareBar: {
    height: 6,
    backgroundColor: 'rgba(250,243,238,0.15)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  compareFill: {
    height: '100%',
    borderRadius: 3,
  },
  compareScore: {
    fontFamily: fonts.displayBold,
    fontSize: 16,
    color: colors.pink,
    marginTop: 5,
  },
  compareScoreSlash: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.creamDark,
  },
  statusFooter: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(246,186,214,0.15)',
    alignItems: 'center',
  },
  statusFooterText: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.creamDark,
    letterSpacing: 0.3,
  },

  // Messages
  messagesList: { gap: 8 },
  systemMsgWrap: {
    alignItems: 'center',
    marginVertical: 10,
    gap: 4,
  },
  systemMsg: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamDark,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  systemMsgText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.berry60,
    textAlign: 'center',
  },
  timestamp: {
    fontFamily: fonts.body,
    fontSize: 9,
    color: colors.berry60,
    opacity: 0.6,
  },

  themRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    marginVertical: 2,
    maxWidth: '85%',
  },
  smallAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallAvatarText: {
    fontFamily: fonts.displayBold,
    fontSize: 11,
    color: colors.white,
  },
  themBubble: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamDark,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
  },
  themBubbleText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.berry,
    lineHeight: 18,
  },

  meRow: {
    alignSelf: 'flex-end',
    marginVertical: 2,
    maxWidth: '85%',
  },
  meBubble: {
    backgroundColor: colors.berry,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderBottomRightRadius: 4,
  },
  meBubbleText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.pink,
    lineHeight: 18,
  },

  typingBubble: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.berry60,
  },

  // Input bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.creamDark,
    backgroundColor: colors.cream,
  },
  input: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.berry,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.berry,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: colors.creamDark,
    opacity: 0.7,
  },
});
