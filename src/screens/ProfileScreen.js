import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Animated,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { colors, fonts } from '../theme';
import { useUserStore, userStore } from '../state/userStore';

const BADGES = [
  { emoji: '🌅', title: 'Early Bird', earned: true },
  { emoji: '🔥', title: 'Streak Starter', earned: true },
  { emoji: '📚', title: 'Bookworm', earned: true },
  { emoji: '🧘', title: 'Zen Master', earned: true },
  { emoji: '💧', title: 'Hydrator', earned: true },
  { emoji: '👟', title: 'Step Machine', earned: true },
  { emoji: '⭐', title: 'Early Adopter', earned: true },
  { emoji: '🎁', title: 'First Reward', earned: true },
  { emoji: '🏆', title: 'Locked', earned: false },
  { emoji: '👑', title: 'Locked', earned: false },
  { emoji: '💎', title: 'Locked', earned: false },
  { emoji: '🌟', title: 'Locked', earned: false },
];

const isWeb = Platform.OS === 'web';

export default function ProfileScreen({ navigation }) {
  const { berries, profilePhoto } = useUserStore();

  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(''); // Visible feedback for debugging

  // ==== Entrance animations ====
  const heroAnim = useRef(new Animated.Value(0)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;
  const badgesAnim = useRef(new Animated.Value(0)).current;
  const accountAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(110, [
      Animated.timing(heroAnim, { toValue: 1, duration: 520, useNativeDriver: true }),
      Animated.timing(statsAnim, { toValue: 1, duration: 480, useNativeDriver: true }),
      Animated.timing(badgesAnim, { toValue: 1, duration: 480, useNativeDriver: true }),
      Animated.timing(accountAnim, { toValue: 1, duration: 480, useNativeDriver: true }),
    ]).start();
  }, []);

  // ==== Avatar press = pick photo ====
  const handlePickPhoto = async () => {
    setStatusMsg('Opening photo picker…');
    try {
      // Permission check (skip on web — file picker doesn't need it)
      if (!isWeb) {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (perm.status !== 'granted') {
          setStatusMsg('Photo library permission denied. Enable it in settings.');
          return;
        }
      }

      setUploading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      setUploading(false);

      if (result.canceled) {
        setStatusMsg('');
        return;
      }
      if (result.assets?.[0]?.uri) {
        userStore.setProfilePhoto(result.assets[0].uri);
        setStatusMsg('');
      } else {
        setStatusMsg('Could not read the selected image.');
      }
    } catch (e) {
      setUploading(false);
      setStatusMsg(`Error: ${e?.message || 'Could not open photo picker.'}`);
    }
  };

  const handleLogout = () => {
    navigation.getParent()?.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <Pressable style={styles.iconBtn} hitSlop={6}>
            <Ionicons name="settings-outline" size={20} color={colors.berry} />
          </Pressable>
        </View>

        {/* Hero — avatar + name */}
        <Animated.View
          style={[
            styles.hero,
            {
              opacity: heroAnim,
              transform: [
                {
                  translateY: heroAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Pressable
            onPress={handlePickPhoto}
            style={({ pressed }) => [
              styles.avatarPressable,
              pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
            ]}
          >
            {profilePhoto ? (
              <Image source={{ uri: profilePhoto }} style={styles.bigAvatarImage} />
            ) : (
              <LinearGradient
                colors={['#FFD3A5', '#FD9853']}
                style={styles.bigAvatar}
              >
                <Text style={styles.bigAvatarInitial}>O</Text>
              </LinearGradient>
            )}
            {uploading ? (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator color={colors.pink} />
              </View>
            ) : (
              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={14} color={colors.pink} />
              </View>
            )}
          </Pressable>

          <Text style={styles.changePhotoHint}>
            {profilePhoto ? 'Tap photo to change' : 'Tap avatar to upload photo'}
          </Text>

          {/* Status message (debug + permission errors) */}
          {statusMsg ? (
            <View style={styles.statusBox}>
              <Text style={styles.statusText}>{statusMsg}</Text>
            </View>
          ) : null}

          <Text style={styles.name}>Ola</Text>
          <Text style={styles.handle}>@ola</Text>

          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>LEVEL 8</Text>
          </View>
        </Animated.View>

        {/* Stats card — berries is live from store */}
        <Animated.View
          style={[
            styles.statsCard,
            {
              opacity: statsAnim,
              transform: [
                {
                  translateY: statsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [14, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.statCol}>
            <Text style={styles.statNum}>12</Text>
            <Text style={styles.statLabel}>STREAK</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statNum}>660</Text>
            <Text style={styles.statLabel}>XP</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statNum}>{berries.toLocaleString()}</Text>
            <Text style={styles.statLabel}>BERRIES</Text>
          </View>
        </Animated.View>

        {/* Achievements */}
        <Animated.View
          style={{
            opacity: badgesAnim,
            transform: [
              {
                translateY: badgesAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [12, 0],
                }),
              },
            ],
          }}
        >
          <View style={styles.sectHead}>
            <Text style={styles.sectTitle}>
              <Text style={styles.sectTitleItalic}>Achievements</Text>
            </Text>
            <Text style={styles.sectMeta}>
              {BADGES.filter((b) => b.earned).length}/{BADGES.length} earned
            </Text>
          </View>
          <View style={styles.badgesGrid}>
            {BADGES.map((b, i) => (
              <View
                key={i}
                style={[
                  styles.badge,
                  b.earned ? styles.badgeEarned : styles.badgeLocked,
                ]}
              >
                <Text style={[styles.badgeEmoji, !b.earned && { opacity: 0.3 }]}>
                  {b.emoji}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Account section */}
        <Animated.View
          style={{
            opacity: accountAnim,
            transform: [
              {
                translateY: accountAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [12, 0],
                }),
              },
            ],
          }}
        >
          <View style={[styles.sectHead, { marginTop: 28 }]}>
            <Text style={styles.sectTitle}>Account</Text>
          </View>

          <View style={styles.accountList}>
            <Pressable
              style={({ pressed }) => [
                styles.accountRow,
                pressed && { opacity: 0.7 },
              ]}
            >
              <View style={styles.accountIcon}>
                <Ionicons
                  name="notifications-outline"
                  size={18}
                  color={colors.berry}
                />
              </View>
              <Text style={styles.accountText}>Notifications</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.berry60} />
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.accountRow,
                pressed && { opacity: 0.7 },
              ]}
            >
              <View style={styles.accountIcon}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={colors.berry}
                />
              </View>
              <Text style={styles.accountText}>Privacy &amp; security</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.berry60} />
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.accountRow,
                pressed && { opacity: 0.7 },
              ]}
            >
              <View style={styles.accountIcon}>
                <Ionicons
                  name="help-circle-outline"
                  size={18}
                  color={colors.berry}
                />
              </View>
              <Text style={styles.accountText}>Help &amp; support</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.berry60} />
            </Pressable>
          </View>

          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.logoutBtn,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Ionicons name="log-out-outline" size={20} color="#B85278" />
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  scroll: { paddingHorizontal: 24, paddingBottom: 120 },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 8,
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

  // Hero
  hero: { alignItems: 'center', paddingVertical: 20 },
  avatarPressable: {
    position: 'relative',
    width: 110,
    height: 110,
  },
  bigAvatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 6,
  },
  bigAvatarImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.cream,
    borderWidth: 3,
    borderColor: colors.white,
  },
  bigAvatarInitial: {
    fontFamily: fonts.displayBold,
    fontSize: 44,
    color: colors.white,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.berry,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: colors.cream,
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 55,
    backgroundColor: 'rgba(66, 13, 25, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhotoHint: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.berry60,
    marginTop: 8,
  },
  statusBox: {
    backgroundColor: '#FCE4EC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 8,
  },
  statusText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: '#B85278',
  },
  name: {
    fontFamily: fonts.displayBold,
    fontSize: 28,
    color: colors.berry,
    letterSpacing: -0.5,
    marginTop: 10,
  },
  handle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.berry60,
    marginTop: 2,
  },
  levelBadge: {
    backgroundColor: colors.berry,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 100,
    marginTop: 12,
  },
  levelBadgeText: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    color: colors.pink,
    letterSpacing: 1.2,
  },

  // Stats card
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: 22,
    paddingVertical: 18,
    marginTop: 8,
  },
  statCol: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: colors.creamDark },
  statNum: {
    fontFamily: fonts.displayBold,
    fontSize: 22,
    color: colors.berry,
  },
  statLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 9,
    color: colors.berry60,
    letterSpacing: 1.2,
    marginTop: 3,
  },

  // Sections
  sectHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 28,
    marginBottom: 14,
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

  // Badges
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  badgeEarned: {
    backgroundColor: colors.pink,
    borderColor: colors.pink,
  },
  badgeLocked: {
    backgroundColor: colors.white,
    borderColor: colors.creamDark,
    opacity: 0.4,
  },
  badgeEmoji: { fontSize: 24 },

  // Account list
  accountList: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 20,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.creamDark,
  },
  accountIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.pink50 || colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountText: {
    flex: 1,
    fontFamily: fonts.bodySemi || fonts.bodyBold,
    fontSize: 14,
    color: colors.berry,
  },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FCE4EC',
    borderWidth: 1.5,
    borderColor: '#F5C3D4',
    paddingVertical: 15,
    borderRadius: 100,
    marginTop: 4,
  },
  logoutText: {
    fontFamily: fonts.displayBold,
    fontSize: 15,
    color: '#B85278',
    letterSpacing: 0.2,
  },
});
