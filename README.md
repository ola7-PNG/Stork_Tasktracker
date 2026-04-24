# Stork_Tasktracker

A React Native (Expo) habit-building app called **Stork** with Firebase Authentication, workout progress tracking, reward redemption, and friend leaderboards.

## Features

- Email/password sign up and login with Firebase Authentication
- User profile record created in Firestore on sign up
- Workout habit tracking:
  - Log workouts
  - View and remove recent workouts
  - Track total completed workouts
- Real-life reward system:
  - Unlock a free workout class every 20 workouts
  - Redeem unlocked classes in-app
- Leaderboard:
  - Compete with friends by total workout count
  - See top users and your position

## Project Structure

```
/src
  /screens
    WelcomeScreen.js
    LoginScreen.js
    SignupScreen.js
    HomeScreen.js
  /components
    TaskItem.js
  /services
    firebase.js
App.js
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Add Firebase config values to an `.env` file (or shell environment) using Expo public variables:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
EXPO_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abc123
```

3. Start app:

```bash
npx expo start
```
