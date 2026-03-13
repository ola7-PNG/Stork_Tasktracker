import React, { useEffect, useState } from 'react';
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
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

import TaskItem from '../components/TaskItem';
import { auth, db } from '../services/firebase';

export default function HomeScreen() {
  const [taskTitle, setTaskTitle] = useState('');
  const [tasks, setTasks] = useState([]);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return undefined;

    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const mapped = snapshot.docs.map((taskDoc) => ({
        id: taskDoc.id,
        ...taskDoc.data(),
      }));
      setTasks(mapped);
    });

    return unsubscribe;
  }, [user]);

  const handleAddTask = async () => {
    const cleanTitle = taskTitle.trim();
    if (!cleanTitle || !user) return;

    try {
      await addDoc(collection(db, 'tasks'), {
        title: cleanTitle,
        completed: false,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      setTaskTitle('');
    } catch (error) {
      Alert.alert('Task creation failed', error.message);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await updateDoc(doc(db, 'tasks', task.id), {
        completed: !task.completed,
      });
    } catch (error) {
      Alert.alert('Could not update task', error.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
      Alert.alert('Could not delete task', error.message);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>My Tasks</Text>
        <TouchableOpacity onPress={handleSignOut}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          placeholder="Add a task"
          style={styles.input}
          value={taskTitle}
          onChangeText={setTaskTitle}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
          />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks yet. Create your first one.</Text>}
        contentContainerStyle={tasks.length === 0 ? styles.emptyContainer : undefined}
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
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0B1F44',
  },
  logout: {
    color: '#3077F3',
    fontSize: 16,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 14,
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
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#6f7d96',
  },
});
