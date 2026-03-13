import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function TaskItem({ task, onToggleComplete, onDelete }) {
  return (
    <View style={styles.container}>
      <Switch value={task.completed} onValueChange={() => onToggleComplete(task)} />
      <Text style={[styles.title, task.completed && styles.completed]}>{task.title}</Text>
      <TouchableOpacity onPress={() => onDelete(task.id)}>
        <Text style={styles.delete}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e6ecf5',
  },
  title: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#0b1f44',
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#8e9ab1',
  },
  delete: {
    color: '#f04f4f',
    fontWeight: '600',
  },
});
