import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Platform,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { colors, fonts } from '../theme';

const isWeb = Platform.OS === 'web';

export default function ProofSubmissionScreen({ route, navigation }) {
  const { task, onSubmit } = route.params || {};

  const [photoUri, setPhotoUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Animations
  const previewScale = useRef(new Animated.Value(0.8)).current;
  const previewOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (photoUri) {
      Animated.parallel([
        Animated.spring(previewScale, {
          toValue: 1,
          friction: 6,
          tension: 90,
          useNativeDriver: true,
        }),
        Animated.timing(previewOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      previewScale.setValue(0.8);
      previewOpacity.setValue(0);
    }
  }, [photoUri]);

  const handleTakePhoto = async () => {
    setErrorMsg('');
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (perm.status !== 'granted') {
        setErrorMsg('Camera permission denied. Enable it in settings.');
        return;
      }
      setLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
      setLoading(false);
      if (!result.canceled && result.assets?.[0]) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (e) {
      setLoading(false);
      setErrorMsg('Could not open camera on this device.');
    }
  };

  const handlePickPhoto = async () => {
    setErrorMsg('');
    try {
      // On native we need to request library permission, on web it's free
      if (!isWeb) {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (perm.status !== 'granted') {
          setErrorMsg('Photo library permission denied.');
          return;
        }
      }
      setLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
      setLoading(false);
      if (!result.canceled && result.assets?.[0]) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (e) {
      setLoading(false);
      setErrorMsg('Could not open photo library.');
    }
  };

  const handleSubmit = () => {
    if (!photoUri) return;
    if (onSubmit) onSubmit(photoUri);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.handle} />
      </View>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Proof required</Text>
          <Text style={styles.title}>Prove you did it!</Text>
        </View>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.closeBtn}
          hitSlop={10}
        >
          <Ionicons name="close" size={22} color={colors.berry} />
        </Pressable>
      </View>

      {/* Task card */}
      {task && (
        <View style={styles.taskCard}>
          <View style={styles.taskIcon}>
            <Text style={styles.taskEmoji}>{task.emoji}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={styles.taskMeta}>{task.meta}</Text>
          </View>
          <Text style={styles.taskXp}>
            +{task.xp}
            <Text style={styles.taskXpLabel}> XP</Text>
          </Text>
        </View>
      )}

      {/* Upload area */}
      <View style={styles.uploadArea}>
        {photoUri ? (
          <Animated.View
            style={{
              opacity: previewOpacity,
              transform: [{ scale: previewScale }],
              width: '100%',
              alignItems: 'center',
            }}
          >
            <Image source={{ uri: photoUri }} style={styles.preview} />
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={14} color={colors.berry} />
              <Text style={styles.verifiedText}>Ready to submit</Text>
            </View>
          </Animated.View>
        ) : (
          <View style={styles.emptyArea}>
            <View style={styles.cameraCircle}>
              <Ionicons name="camera" size={40} color={colors.pink} />
            </View>
            <Text style={styles.emptyTitle}>Snap a photo</Text>
            <Text style={styles.emptySub}>
              Show yourself {getActionText(task?.title)} to unlock +{task?.xp || 0} XP
            </Text>
          </View>
        )}

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color={colors.berry} />
          </View>
        )}
      </View>

      {errorMsg ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size={16} color="#B85278" />
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : null}

      {/* Action buttons */}
      <View style={styles.actions}>
        {photoUri ? (
          <>
            <Pressable
              style={({ pressed }) => [
                styles.secondaryBtn,
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => setPhotoUri(null)}
            >
              <Ionicons name="refresh" size={16} color={colors.berry} />
              <Text style={styles.secondaryBtnText}>Retake</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && { opacity: 0.9 },
              ]}
              onPress={handleSubmit}
            >
              <Ionicons name="checkmark" size={18} color={colors.pink} />
              <Text style={styles.primaryBtnText}>Submit proof</Text>
            </Pressable>
          </>
        ) : (
          <>
            {!isWeb && (
              <Pressable
                style={({ pressed }) => [
                  styles.primaryBtn,
                  { flex: 1 },
                  pressed && { opacity: 0.9 },
                ]}
                onPress={handleTakePhoto}
              >
                <Ionicons name="camera" size={18} color={colors.pink} />
                <Text style={styles.primaryBtnText}>Take photo</Text>
              </Pressable>
            )}
            <Pressable
              style={({ pressed }) => [
                isWeb ? styles.primaryBtn : styles.secondaryBtn,
                { flex: 1 },
                pressed && { opacity: 0.7 },
              ]}
              onPress={handlePickPhoto}
            >
              <Ionicons
                name="image"
                size={18}
                color={isWeb ? colors.pink : colors.berry}
              />
              <Text
                style={isWeb ? styles.primaryBtnText : styles.secondaryBtnText}
              >
                {isWeb ? 'Upload photo' : 'From library'}
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

// Turns "Drink 8 glasses of water" → "drinking water"
// so the empty state copy reads naturally.
function getActionText(title = '') {
  const t = title.toLowerCase();
  if (t.includes('water') || t.includes('drink')) return 'drinking water';
  if (t.includes('read')) return 'reading';
  if (t.includes('meditat')) return 'meditating';
  if (t.includes('workout') || t.includes('gym')) return 'working out';
  if (t.includes('step') || t.includes('walk')) return 'out walking';
  if (t.includes('run')) return 'running';
  return 'completing this quest';
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
    paddingBottom: 20,
  },
  eyebrow: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    color: colors.berry60,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
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

  taskCard: {
    marginHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: 18,
    padding: 14,
    marginBottom: 20,
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
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.berry,
    marginBottom: 2,
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

  uploadArea: {
    flex: 1,
    marginHorizontal: 24,
    marginBottom: 12,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.creamDark,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: 20,
  },
  emptyArea: { alignItems: 'center', paddingVertical: 20 },
  cameraCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.berry,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
  emptyTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 20,
    color: colors.berry,
    marginBottom: 6,
  },
  emptySub: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.berry60,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
  },

  preview: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 16,
    backgroundColor: colors.berry,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.pink,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    marginTop: 14,
  },
  verifiedText: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.berry,
    letterSpacing: 0.3,
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(250, 243, 238, 0.8)',
  },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 24,
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#FCE4EC',
    borderRadius: 12,
  },
  errorText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: '#B85278',
    flex: 1,
  },

  actions: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 8,
  },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.berry,
    paddingVertical: 16,
    borderRadius: 100,
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  primaryBtnText: {
    fontFamily: fonts.displayBold,
    color: colors.pink,
    fontSize: 14,
    letterSpacing: 0.2,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.creamDark,
    paddingVertical: 14,
    borderRadius: 100,
  },
  secondaryBtnText: {
    fontFamily: fonts.bodyBold,
    color: colors.berry,
    fontSize: 14,
  },
});
