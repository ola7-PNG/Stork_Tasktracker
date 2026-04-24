import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { signOut } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

import TaskItem from '../components/TaskItem';
import { auth, db } from '../services/firebase';

const WORKOUTS_PER_REWARD = 20;

export default function HomeScreen() {
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [workouts, setWorkouts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [profile, setProfile] = useState({ totalWorkouts: 0, rewardsRedeemed: 0 });

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return undefined;

    const workoutsQuery = query(
      collection(db, 'workouts'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(workoutsQuery, (snapshot) => {
      const mapped = snapshot.docs.map((workoutDoc) => ({
        id: workoutDoc.id,
        ...workoutDoc.data(),
      }));
      setWorkouts(mapped);
    });

    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!user) return undefined;

    const leaderboardQuery = query(
      collection(db, 'users'),
      orderBy('totalWorkouts', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(leaderboardQuery, (snapshot) => {
      const mapped = snapshot.docs.map((leaderDoc) => leaderDoc.data());
      setLeaderboard(mapped);
    });

    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!user) return undefined;

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), async (snapshot) => {
      if (!snapshot.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          id: user.uid,
          email: user.email,
          displayName: user.email?.split('@')[0] || 'Athlete',
          totalWorkouts: 0,
          rewardsRedeemed: 0,
          createdAt: serverTimestamp(),
        });
        return;
      }

      setProfile({
        totalWorkouts: snapshot.data()?.totalWorkouts ?? 0,
        rewardsRedeemed: snapshot.data()?.rewardsRedeemed ?? 0,
      });
    });

    return unsubscribe;
  }, [user]);

  const availableRewards = useMemo(() => {
    const unlockedRewards = Math.floor(profile.totalWorkouts / WORKOUTS_PER_REWARD);
    return Math.max(0, unlockedRewards - profile.rewardsRedeemed);
  }, [profile.rewardsRedeemed, profile.totalWorkouts]);

  const progressRemainder = profile.totalWorkouts % WORKOUTS_PER_REWARD;
  const workoutsUntilReward = progressRemainder === 0 ? WORKOUTS_PER_REWARD : WORKOUTS_PER_REWARD - progressRemainder;

  const handleLogWorkout = async () => {
    const cleanTitle = workoutTitle.trim();
    if (!cleanTitle || !user) return;

    try {
      await addDoc(collection(db, 'workouts'), {
        title: cleanTitle,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, 'users', user.uid), {
        totalWorkouts: increment(1),
      });

      setWorkoutTitle('');
    } catch (error) {
      Alert.alert('Workout log failed', error.message);
    }
  };

  const handleDeleteWorkout = async (workoutId) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, 'workouts', workoutId));
      await updateDoc(doc(db, 'users', user.uid), {
        totalWorkouts: increment(-1),
      });
    } catch (error) {
      Alert.alert('Could not remove workout', error.message);
    }
  };

  const handleRedeemReward = async () => {
    if (!user || availableRewards < 1) return;

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        rewardsRedeemed: increment(1),
      });
      Alert.alert('Reward redeemed!', 'Nice work — enjoy your free workout class.');
    } catch (error) {
      Alert.alert('Reward redemption failed', error.message);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.heading}>Workout Tracker</Text>
          <Text style={styles.subtitle}>Build consistency. Earn real rewards.</Text>
        </View>
        <TouchableOpacity onPress={handleSignOut}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressCard}>
        <Text style={styles.progressTitle}>Your progress</Text>
        <Text style={styles.metric}>{profile.totalWorkouts} total workouts</Text>
        <Text style={styles.progressText}>
          {availableRewards > 0
            ? `You can redeem ${availableRewards} free class${availableRewards > 1 ? 'es' : ''}.`
            : `${workoutsUntilReward} workouts until your next free class.`}
        </Text>
        <TouchableOpacity
          style={[styles.redeemButton, availableRewards < 1 && styles.disabledButton]}
          onPress={handleRedeemReward}
          disabled={availableRewards < 1}
        >
          <Text style={styles.redeemButtonText}>Redeem free workout class</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          placeholder="Log workout (e.g., 5K run)"
          style={styles.input}
          value={workoutTitle}
          onChangeText={setWorkoutTitle}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleLogWorkout}>
          <Text style={styles.addButtonText}>Log</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionHeader}>Recent workouts</Text>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaskItem workout={item} onDelete={handleDeleteWorkout} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No workouts yet. Log your first one.</Text>}
        contentContainerStyle={workouts.length === 0 ? styles.emptyContainer : undefined}
        style={styles.listSpacing}
      />

      <Text style={styles.sectionHeader}>Leaderboard</Text>
      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.leaderRow}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <Text style={styles.leaderName}>
              {item.displayName || item.email}
              {item.id === user?.uid ? ' (You)' : ''}
            </Text>
            <Text style={styles.leaderScore}>{item.totalWorkouts ?? 0}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Leaderboard is waiting for athletes.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fc',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0B1F44',
  },
  subtitle: {
    marginTop: 2,
    fontSize: 14,
    color: '#64708a',
  },
  logout: {
    color: '#3077F3',
    fontSize: 16,
    fontWeight: '600',
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#dfe8fb',
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
  },
  progressTitle: {
    color: '#0B1F44',
    fontWeight: '700',
    fontSize: 17,
    marginBottom: 6,
  },
  metric: {
    color: '#163b7a',
    fontWeight: '700',
    fontSize: 24,
    marginBottom: 6,
  },
  progressText: {
    color: '#4d5b75',
    marginBottom: 10,
  },
  redeemButton: {
    backgroundColor: '#1f9656',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9fbdab',
  },
  redeemButtonText: {
    color: 'white',
    fontWeight: '700',
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderColor: '#d8e0ef',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#3077F3',
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  sectionHeader: {
    marginTop: 8,
    marginBottom: 8,
    color: '#0B1F44',
    fontWeight: '700',
    fontSize: 16,
  },
  listSpacing: {
    maxHeight: 200,
  },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e6ecf5',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  rank: {
    width: 35,
    color: '#56617a',
    fontWeight: '700',
  },
  leaderName: {
    flex: 1,
    color: '#11274f',
    fontWeight: '600',
  },
  leaderScore: {
    color: '#3077F3',
    fontWeight: '700',
    fontSize: 16,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#6f7d96',
  },
});
