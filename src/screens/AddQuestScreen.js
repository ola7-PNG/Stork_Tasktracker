import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts } from '../theme';

const CATEGORIES = [
  { id: 'Wellness',     emoji: '💧' },
  { id: 'Fitness',      emoji: '🏃' },
  { id: 'Mindfulness',  emoji: '🧘' },
  { id: 'Learning',     emoji: '📚' },
  { id: 'Productivity', emoji: '🎯' },
];

const EMOJIS = ['💧', '🏃', '🧘', '📚', '🎯', '💪', '🥗', '🧠', '🌅', '📝', '🎨', '😴'];

const XP_OPTIONS = [10, 20, 30, 50];

export default function AddQuestScreen({ route, navigation }) {
  const { onAdd } = route.params || {};

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Wellness');
  const [emoji, setEmoji] = useState('💧');
  const [xp, setXp] = useState(20);

  const canSave = title.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    const newQuest = {
      id: Date.now(),
      emoji,
      title: title.trim(),
      meta: `${category} · Daily`,
      xp,
      done: false,
    };
    if (onAdd) onAdd(newQuest);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <View style={styles.handle} />
        </View>
        <View style={styles.header}>
          <Text style={styles.title}>New quest</Text>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.closeBtn}
            hitSlop={10}
          >
            <Ionicons name="close" size={22} color={colors.berry} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Preview card */}
          <View style={styles.previewCard}>
            <View style={styles.previewCheck} />
            <View style={styles.previewIcon}>
              <Text style={styles.previewEmoji}>{emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.previewTitle}>
                {title.trim() || 'Your quest title'}
              </Text>
              <Text style={styles.previewMeta}>{category} · Daily</Text>
            </View>
            <Text style={styles.previewXp}>
              +{xp}
              <Text style={styles.previewXpLabel}> XP</Text>
            </Text>
          </View>

          {/* Title input */}
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Drink 8 glasses of water"
            placeholderTextColor={colors.berry60}
            maxLength={60}
            autoFocus
          />

          {/* Emoji picker */}
          <Text style={styles.label}>Icon</Text>
          <View style={styles.emojiGrid}>
            {EMOJIS.map((e) => (
              <Pressable
                key={e}
                onPress={() => setEmoji(e)}
                style={[
                  styles.emojiBtn,
                  emoji === e && styles.emojiBtnActive,
                ]}
              >
                <Text style={styles.emojiBtnText}>{e}</Text>
              </Pressable>
            ))}
          </View>

          {/* Category */}
          <Text style={styles.label}>Category</Text>
          <View style={styles.pillGroup}>
            {CATEGORIES.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => setCategory(c.id)}
                style={[
                  styles.pill,
                  category === c.id && styles.pillActive,
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    category === c.id && styles.pillTextActive,
                  ]}
                >
                  {c.id}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* XP reward */}
          <Text style={styles.label}>XP reward</Text>
          <View style={styles.pillGroup}>
            {XP_OPTIONS.map((v) => (
              <Pressable
                key={v}
                onPress={() => setXp(v)}
                style={[
                  styles.xpPill,
                  xp === v && styles.xpPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.xpPillText,
                    xp === v && styles.xpPillTextActive,
                  ]}
                >
                  +{v} XP
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* Save button */}
        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              !canSave && styles.primaryBtnDisabled,
              pressed && canSave && { opacity: 0.9 },
            ]}
            onPress={handleSave}
            disabled={!canSave}
          >
            <Text style={styles.primaryBtnText}>Add quest</Text>
            {canSave && (
              <Ionicons name="arrow-forward" size={18} color={colors.pink} />
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },

  topBar: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.creamDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
  },
  title: {
    fontFamily: fonts.displayBold,
    fontSize: 28,
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

  scroll: { paddingHorizontal: 24, paddingBottom: 16 },

  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: 18,
    padding: 14,
    marginBottom: 24,
  },
  previewCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.creamDark,
  },
  previewIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.pink50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewEmoji: { fontSize: 18 },
  previewTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.berry,
    marginBottom: 2,
  },
  previewMeta: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.berry60,
  },
  previewXp: {
    fontFamily: fonts.displayBold,
    fontSize: 14,
    color: colors.berry,
  },
  previewXpLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: colors.pink,
    letterSpacing: 0.5,
  },

  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.berry,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 18,
  },

  input: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.creamDark,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.berry,
  },

  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emojiBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiBtnActive: {
    borderColor: colors.berry,
    backgroundColor: colors.pink50,
  },
  emojiBtnText: { fontSize: 22 },

  pillGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.creamDark,
  },
  pillActive: {
    backgroundColor: colors.berry,
    borderColor: colors.berry,
  },
  pillText: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    color: colors.berry80,
  },
  pillTextActive: { color: colors.pink },

  xpPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.creamDark,
  },
  xpPillActive: {
    backgroundColor: colors.pink,
    borderColor: colors.pink,
  },
  xpPillText: {
    fontFamily: fonts.displayBold,
    fontSize: 13,
    color: colors.berry,
  },
  xpPillTextActive: {
    color: colors.berry,
  },

  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: colors.cream,
    borderTopWidth: 1,
    borderTopColor: colors.creamDark,
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
  primaryBtnDisabled: { opacity: 0.4 },
  primaryBtnText: {
    fontFamily: fonts.displayBold,
    color: colors.pink,
    fontSize: 15,
    letterSpacing: 0.2,
  },
});
