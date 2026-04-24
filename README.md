# 🪶 Stork — Habits that give back

A gamified task tracker mobile app that turns healthy habits into real-world brand rewards. Built with **Expo** + **React Native**.

> Complete quests. Build streaks. Redeem berries for rewards from brands you already love.

---

## 🎨 Brand

| Token | Hex | Role |
|---|---|---|
| **Strawberry Cocktail** | `#F6BAD6` | Primary brand, accents |
| **Fresh Berry** | `#420D19` | Deep primary, text, surfaces |
| Cream | `#FAF3EE` | Backgrounds |

**Typography:** Fredoka (chunky rounded display) + Figtree (clean body). The display voice matches the logo's playful bubble-letter banner energy — emphasis comes from weight, not italics.

---

## 📱 App flow

```
Onboarding (3 paged slides)
        ↓
   Login ⇄ Sign Up
        ↓
   Main (bottom tabs)
   ├── Today     — streak hero, daily stats, checkable tasks
   ├── Quests    — featured + daily/weekly/monthly challenges
   ├── Rewards   — berry balance + brand reward grid
   │   └── Reward Detail (modal) — confirm → success with gift card + code
   ├── Friends   — leaderboard: podium + ranked friend list
   └── Profile   — avatar, level, stats, achievement wall
```

---

## 🗂️ Project structure

```
Stork_Tasktracker/
├── App.js                          # Root — font loading + nav container
├── app.json                        # Expo config
├── package.json
├── babel.config.js
├── .gitignore
├── README.md
├── assets/                         # App icon, adaptive icon, splash, logo
├── design-prototype/
│   └── index.html                  # Original HTML mockup (browser-previewable)
└── src/
    ├── assets/stork-logo.png       # In-app logo
    ├── theme/index.js              # Colors, fonts, radius tokens
    ├── components/StorkLogo.js     # Reusable logo component
    ├── navigation/
    │   ├── RootNavigator.js        # Stack: Onboarding → Auth → Main
    │   └── TabNavigator.js         # Custom berry/pink bottom tabs
    └── screens/
        ├── OnboardingScreen.js
        ├── LoginScreen.js
        ├── SignUpScreen.js
        ├── TodayScreen.js
        ├── QuestsScreen.js
        ├── RewardsScreen.js
        ├── RewardDetailScreen.js      # Modal: confirm → gift card success
        ├── LeaderboardScreen.js       # Friends tab: podium + ranked list
        └── ProfileScreen.js
```

---

## 🚀 Getting started

**Prerequisites:** Node.js 18+, and Expo Go on your phone OR iOS Simulator / Android Emulator.

```bash
# 1. Install deps
npm install

# 2. Start Expo
npx expo start

# 3. Open it:
#    - Scan QR with Expo Go (phone)
#    - Press 'i' for iOS sim
#    - Press 'a' for Android emulator
#    - Press 'w' for web browser
```

If you see version-mismatch warnings:
```bash
npx expo install --fix
```

---

## 🌐 Browser preview (two options)

### Instant preview — the HTML prototype
Open `design-prototype/index.html` in any browser. Zero setup, zero dependencies. Useful for quick design review.

### Real app in browser — Expo Web
```bash
npx expo install react-native-web react-dom @expo/metro-runtime
npx expo start --web
```
This renders the actual React Native app in a browser tab. Bottom tabs, onboarding swiper, and auth flows all work. Some native-only features won't render identically, but the full layout and navigation do.

---

## ⚙️ Auth stubs

Both `LoginScreen` and `SignUpScreen` call `navigation.replace('Main')` without actual authentication. Wire up your backend (Firebase, Supabase, Auth0, or your own API) inside the `handleSignIn` / `handleSignUp` functions.

---

## 🛣️ What's next

- [ ] Real auth (Firebase / Supabase / Auth0)
- [ ] Persist "onboarding seen" flag with `AsyncStorage`
- [ ] Task CRUD + habit scheduling
- [ ] Streak engine with grace-day logic
- [ ] Berry ledger + redemption history
- [ ] Real reward API (Tremendous, Tango Card) for gift cards
- [ ] Push notifications for streak-saver reminders
- [ ] Friend streaks / leaderboards
- [ ] Dark mode (berry as base)
- [ ] Haptics with `expo-haptics` on task completion

---

## 📄 License

Design and code © 2026. Brand names (Starbucks, Spotify, Nike, etc.) appear illustratively and are trademarks of their respective owners.
