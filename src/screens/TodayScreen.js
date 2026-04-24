import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts } from '../theme';

const INITIAL_TASKS = [
  { id: 1, emoji: '💧', title: 'Drink 8 glasses of water', meta: 'Wellness · Daily', xp: 20, done: true,  proofPhoto: null },
  { id: 2, emoji: '🧘', title: 'Meditate for 10 minutes',  meta: 'Mindfulness · Daily', xp: 25, done: true,  proofPhoto: null },
  { id: 3, emoji: '🏃', title: 'Morning workout',           meta: 'Fitness · Daily', xp: 50, done: true,  proofPhoto: null },
  { id: 4, emoji: '📚', title: 'Read for 30 minutes',       meta: 'Learning · Daily', xp: 30, done: false, proofPhoto: null },
  { id: 5, emoji: '👟', title: 'Hit 10,000 steps',          meta: 'Fitness · Daily', xp: 40, done: false, proofPhoto: null },
];

export default function TodayScreen({ navigation }) {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [editMode, setEditMode] = useState(false);
  const [xpBurst, setXpBurst] = useState(null); // {id, xp}

  // ==== Screen entrance animations (stagger) ====
  const heroAnim = useRef(new Animated.Value(0)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;
  const listAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(120, [
      Animated.timing(heroAnim, {
        toValue: 1,
        duration: 550,
        useNativeDriver: true,
      }),
      Animated.timing(statsAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(listAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // ==== XP burst animation on task completion ====
  const burstAnim = useRef(new Animated.Value(0)).current;

  const triggerXpBurst = (task) => {
    setXpBurst({ id: task.id, xp: task.xp });
    burstAnim.setValue(0);
    Animated.timing(burstAnim, {
      toValue: 1,
      duration: 1100,
      useNativeDriver: true,
    }).start(() => setXpBurst(null));
  };

  // ==== Handlers ====
  const handleTaskPress = (task) => {
    if (editMode) return;

    if (task.done) {
      // Un-check: clear photo too
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, done: false, proofPhoto: null } : t
        )
      );
    } else {
      // Needs proof — open the modal
      navigation.navigate('ProofSubmission', {
        task,
        onSubmit: (photoUri) => {
          setTasks((prev) =>
            prev.map((t) =>
              t.id === task.id ? { ...t, done: true, proofPhoto: photoUri } : t
            )
          );
          triggerXpBurst(task);
        },
      });
    }
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addTask = (quest) => {
    setTasks((prev) => [...prev, quest]);
  };

  const handleOpenAddQuest = () => {
    navigation.navigate('AddQuest', { onAdd: addTask });
  };

  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={styles.greet}>
          <View>
            <Text style={styles.hi}>GOOD MORNING</Text>
            <Text style={styles.greetName}>
              Hi, <Text style={styles.greetItalic}>Ola.</Text>
            </Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>O</Text>
          </View>
        </View>

        {/* Hero streak card */}
        <Animated.View
          style={{
            opacity: heroAnim,
            transform: [
              {
                translateY: heroAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
          <LinearGradient
            colors={[colors.berry, colors.berry80]}
            style={styles.hero}
          >
            <View style={styles.heroBlob} />
            <View style={styles.heroTop}>
              <Text style={styles.heroLabel}>CURRENT STREAK</Text>
              <View style={styles.berryPill}>
                <View style={styles.berryDot} />
                <Text style={styles.berryPillText}>1,240 berries</Text>
              </View>
            </View>
            <View style={styles.streakRow}>
              <Text style={styles.streakNum}>12</Text>
              <View>
                <Text style={styles.streakDays}>days strong</Text>
                <Text style={styles.streakSub}>Level 8 · 340 XP to level up</Text>
              </View>
            </View>
            <View style={styles.xpBar}>
              <View style={styles.xpHead}>
                <Text style={styles.xpHeadL}>660 / 1000 XP</Text>
                <Text style={styles.xpHeadR}>Level 9</Text>
              </View>
              <View style={styles.xpTrack}>
                <LinearGradient
                  colors={[colors.pink, colors.white]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.xpFill}
                />
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Stats row */}
        <Animated.View
          style={[
            styles.statsRow,
            {
              opacity: statsAnim,
              transform: [
                {
                  translateY: statsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.statCard}>
            <Text style={styles.statNum}>
              {doneCount}
              <Text style={styles.statItalic}>/{tasks.length}</Text>
            </Text>
            <Text style={styles.statLabel}>TODAY</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>24</Text>
            <Text style={styles.statLabel}>WEEK</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>
              87<Text style={styles.statItalic}>%</Text>
            </Text>
            <Text style={styles.statLabel}>RATE</Text>
          </View>
        </Animated.View>

        {/* Tasks section */}
        <View style={styles.sectHead}>
          <Text style={styles.sectTitle}>
            <Text style={styles.sectTitleItalic}>Today's</Text> quests
          </Text>
          <View style={styles.sectActions}>
            <Pressable
              onPress={() => setEditMode(!editMode)}
              hitSlop={8}
              style={styles.sectBtn}
            >
              <Text style={styles.sectBtnText}>
                {editMode ? 'Done' : 'Edit'}
              </Text>
            </Pressable>
            {!editMode && (
              <Pressable
                onPress={handleOpenAddQuest}
                hitSlop={8}
                style={styles.addBtn}
              >
                <Ionicons name="add" size={18} color={colors.pink} />
              </Pressable>
            )}
          </View>
        </View>

        <Animated.View
          style={[
            styles.tasksList,
            {
              opacity: listAnim,
              transform: [
                {
                  translateY: listAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [14, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {tasks.map((task) => (
            <View key={task.id} style={{ position: 'relative' }}>
              <TaskRow
                task={task}
                onPress={handleTaskPress}
                onDelete={deleteTask}
                editMode={editMode}
              />
              {/* XP burst overlay */}
              {xpBurst && xpBurst.id === task.id && (
                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.xpBurst,
                    {
                      opacity: burstAnim.interpolate({
                        inputRange: [0, 0.2, 0.8, 1],
                        outputRange: [0, 1, 1, 0],
                      }),
                      transform: [
                        {
                          translateY: burstAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -48],
                          }),
                        },
                        {
                          scale: burstAnim.interpolate({
                            inputRange: [0, 0.3, 1],
                            outputRange: [0.6, 1.1, 1],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Text style={styles.xpBurstText}>+{xpBurst.xp} XP</Text>
                </Animated.View>
              )}
            </View>
          ))}

          {tasks.length === 0 && (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>🌱</Text>
              <Text style={styles.emptyTitle}>No quests yet</Text>
              <Text style={styles.emptySub}>
                Add your first habit to start earning berries
              </Text>
            </View>
          )}

          {/* Add-a-quest dashed card at the bottom of the list */}
          {!editMode && (
            <Pressable
              onPress={handleOpenAddQuest}
              style={({ pressed }) => [
                styles.addCard,
                pressed && { opacity: 0.7 },
              ]}
            >
              <View style={styles.addCardIcon}>
                <Ionicons name="add" size={22} color={colors.berry} />
              </View>
              <Text style={styles.addCardText}>Add a new quest</Text>
            </Pressable>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TaskRow({ task, onPress, onDelete, editMode }) {
  const isVerified = task.done && !!task.proofPhoto;

  return (
    <Pressable
      onPress={() => onPress(task)}
      style={({ pressed }) => [
        styles.task,
        task.done && !editMode && styles.taskDone,
        pressed && !editMode && { transform: [{ scale: 0.99 }] },
      ]}
    >
      <View style={[styles.check, task.done && !editMode && styles.checkOn]}>
        {task.done && !editMode && (
          <Ionicons name="checkmark" size={14} color={colors.pink} />
        )}
      </View>
      <View style={[styles.taskIcon, task.done && !editMode && { backgroundColor: colors.pink30 }]}>
        <Text style={styles.taskEmoji}>{task.emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.taskTitle, task.done && !editMode && styles.taskTitleDone]}>
          {task.title}
        </Text>
        <View style={styles.taskMetaRow}>
          <Text style={styles.taskMeta}>{task.meta}</Text>
          {isVerified && (
            <View style={styles.verifiedTag}>
              <Ionicons name="checkmark-circle" size={10} color={colors.berry} />
              <Text style={styles.verifiedTagText}>Verified</Text>
            </View>
          )}
        </View>
      </View>
      {editMode ? (
        <Pressable
          onPress={() => onDelete(task.id)}
          hitSlop={10}
          style={styles.deleteBtn}
        >
          <Ionicons name="trash-outline" size={18} color={colors.white} />
        </Pressable>
      ) : isVerified ? (
        <View style={styles.proofThumbWrap}>
          <Image source={{ uri: task.proofPhoto }} style={styles.proofThumb} />
        </View>
      ) : (
        <Text style={styles.taskXp}>
          +{task.xp}
          <Text style={styles.taskXpLabel}> XP</Text>
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  scroll: { paddingHorizontal: 24, paddingBottom: 120 },
  greet: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 20,
    paddingBottom: 22,
  },
  hi: {
    fontFamily: fonts.bodySemi,
    fontSize: 11,
    color: colors.berry60,
    letterSpacing: 1.8,
  },
  greetName: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.berry,
    letterSpacing: -1,
    marginTop: 4,
  },
  greetItalic: {
    fontFamily: fonts.displayBold,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.pink,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontFamily: fonts.displaySemi,
    color: colors.berry,
    fontSize: 16,
  },
  hero: {
    borderRadius: 28,
    padding: 24,
    marginBottom: 20,
    overflow: 'hidden',
  },
  heroBlob: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.pink,
    opacity: 0.22,
    top: -80,
    right: -60,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  heroLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: 11,
    color: colors.pink,
    letterSpacing: 1.8,
  },
  berryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.pinkTranslucent15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
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
    color: colors.pink,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 14,
  },
  streakNum: {
    fontFamily: fonts.display,
    fontSize: 72,
    color: colors.white,
    letterSpacing: -1,
    lineHeight: 68,
  },
  streakDays: {
    fontFamily: fonts.displaySemi,
    fontSize: 18,
    color: colors.pink,
    marginBottom: 8,
  },
  streakSub: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.pink50,
    opacity: 0.75,
    marginBottom: 8,
  },
  xpBar: { marginTop: 18 },
  xpHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  xpHeadL: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    color: colors.pink,
  },
  xpHeadR: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.pink50,
    opacity: 0.7,
  },
  xpTrack: {
    height: 6,
    backgroundColor: colors.pinkTranslucent,
    borderRadius: 100,
    overflow: 'hidden',
  },
  xpFill: {
    width: '68%',
    height: '100%',
    borderRadius: 100,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 26,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statNum: {
    fontFamily: fonts.displaySemi,
    fontSize: 24,
    color: colors.berry,
  },
  statItalic: {
    fontFamily: fonts.displayBold,
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
    alignItems: 'center',
    marginBottom: 14,
  },
  sectTitle: {
    fontFamily: fonts.displaySemi,
    fontSize: 22,
    color: colors.berry,
    letterSpacing: -0.5,
  },
  sectTitleItalic: {
    fontFamily: fonts.displayBold,
  },
  sectLink: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.berry60,
  },
  sectActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  sectBtnText: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.berry,
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.berry,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#B85278',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: colors.creamDark,
    borderStyle: 'dashed',
    borderRadius: 18,
    paddingVertical: 18,
    marginTop: 2,
  },
  addCardIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.pink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCardText: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.berry,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  emptyEmoji: { fontSize: 40, marginBottom: 10 },
  emptyTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 18,
    color: colors.berry,
    marginBottom: 4,
  },
  emptySub: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.berry60,
    textAlign: 'center',
  },
  tasksList: { gap: 10 },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: 18,
    padding: 14,
  },
  taskDone: {
    backgroundColor: colors.pink50,
    borderColor: colors.pink30,
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
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
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.pink50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskEmoji: { fontSize: 20 },
  taskTitle: {
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    color: colors.berry,
    marginBottom: 2,
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  taskMeta: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.berry60,
  },
  taskXp: {
    fontFamily: fonts.displayBold,
    fontSize: 14,
    color: colors.berry,
  },
  taskXpLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: colors.pink,
    letterSpacing: 0.5,
  },

  // Verified badge under task title
  taskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.pink,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 100,
  },
  verifiedTagText: {
    fontFamily: fonts.bodyBold,
    fontSize: 9,
    color: colors.berry,
    letterSpacing: 0.3,
  },

  // Proof photo thumbnail on the right of verified tasks
  proofThumbWrap: {
    borderWidth: 2,
    borderColor: colors.pink,
    borderRadius: 12,
    padding: 2,
  },
  proofThumb: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.pink50,
  },

  // XP burst animation overlay
  xpBurst: {
    position: 'absolute',
    right: 24,
    top: 8,
    backgroundColor: colors.berry,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  xpBurstText: {
    fontFamily: fonts.displayBold,
    fontSize: 16,
    color: colors.pink,
    letterSpacing: 0.3,
  },
});
