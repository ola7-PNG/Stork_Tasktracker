import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Stork</Text>
      <Text style={styles.subtitle}>Track workouts, climb the leaderboard, and redeem free classes.</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate('Sign Up')}
      >
        <Text style={styles.secondaryButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f3f7ff',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0B1F44',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#4E5970',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#3077F3',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#3077F3',
  },
  secondaryButtonText: {
    color: '#3077F3',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});
