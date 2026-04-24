import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TaskItem({ workout, onDelete }) {
  const dateLabel = workout.createdAt?.toDate
    ? workout.createdAt.toDate().toLocaleDateString()
    : 'Just now';

  return (
    <View style={styles.container}>
      <View style={styles.metaWrap}>
        <Text style={styles.title}>{workout.title}</Text>
        <Text style={styles.date}>{dateLabel}</Text>
      </View>
      <TouchableOpacity onPress={() => onDelete(workout.id)}>
        <Text style={styles.delete}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e6ecf5',
  },
  metaWrap: {
    flexShrink: 1,
  },
  title: {
    fontSize: 16,
    color: '#0b1f44',
    fontWeight: '600',
    marginBottom: 2,
  },
  date: {
    fontSize: 13,
    color: '#7a879f',
  },
  delete: {
    color: '#f04f4f',
    fontWeight: '600',
  },
});
