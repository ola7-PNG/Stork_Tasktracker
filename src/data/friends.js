// Shared friends data — rich profiles with achievements, history, and highlights

export const AVATAR_GRADIENTS = {
  Mia: ['#F6BAD6', '#E89BC4'],
  Jay: ['#A8D8EA', '#7FB6CC'],
  Ola: ['#FFD3A5', '#FD9853'],
  Zoe: ['#C9B1FF', '#9D7FE8'],
  Sam: ['#B5EAD7', '#85D4B7'],
  Rio: ['#FFB8B8', '#FF8585'],
  Leo: ['#FFEAA7', '#FFC75F'],
};

export const FRIENDS = [
  {
    id: 1,
    name: 'Mia',
    handle: '@mia.s',
    rank: 1,
    level: 14,
    streak: 87,
    xp: 4250,
    medal: '🥇',
    bio: 'Morning person. Coffee fueled. 87-day streak and counting.',

    stats: {
      totalQuests: 612,
      perfectDays: 73,
      longestStreak: 87,
      thisWeek: 28,
    },

    highlights: [
      { emoji: '🔥', title: '87-day streak', sub: 'Longest in friend group' },
      { emoji: '🏆', title: 'Level 14', sub: 'Top 1% of Stork users' },
      { emoji: '💎', title: '4,250 XP', sub: 'Earned this season' },
    ],

    badges: [
      { emoji: '🌅', title: 'Early Bird', earned: true },
      { emoji: '🔥', title: 'Streak Master', earned: true },
      { emoji: '📚', title: 'Bookworm', earned: true },
      { emoji: '🧘', title: 'Zen Master', earned: true },
      { emoji: '💧', title: 'Hydrator', earned: true },
      { emoji: '👟', title: 'Step Machine', earned: true },
      { emoji: '⭐', title: 'Pioneer', earned: true },
      { emoji: '🎁', title: 'First Reward', earned: true },
      { emoji: '👑', title: 'Royal Rank', earned: true },
      { emoji: '🏔️', title: '100 Days', earned: false },
    ],

    favoriteHabits: [
      { emoji: '🧘', name: 'Meditation', streak: 87 },
      { emoji: '💧', name: 'Hydration', streak: 64 },
      { emoji: '📚', name: 'Reading', streak: 42 },
    ],

    activity: [
      { emoji: '🧘', title: 'Meditated for 10 minutes', meta: '2 hours ago', xp: 25, verified: true },
      { emoji: '💧', title: 'Drank 8 glasses of water', meta: '4 hours ago', xp: 20, verified: true },
      { emoji: '🏃', title: 'Morning workout', meta: '6 hours ago', xp: 50, verified: true },
      { emoji: '📚', title: 'Read for 30 minutes', meta: 'Yesterday', xp: 30, verified: true },
      { emoji: '🌅', title: 'Woke up at 5:30 AM', meta: 'Yesterday', xp: 15, verified: false },
      { emoji: '👟', title: 'Hit 10,000 steps', meta: 'Yesterday', xp: 40, verified: true },
    ],

    todayTasks: [
      { emoji: '💧', title: 'Drink 8 glasses of water', done: true },
      { emoji: '🧘', title: 'Meditate for 10 minutes', done: true },
      { emoji: '🏃', title: 'Morning workout', done: true },
      { emoji: '📚', title: 'Read for 30 minutes', done: true },
    ],
  },

  {
    id: 2,
    name: 'Jay',
    handle: '@jayw',
    rank: 2,
    level: 13,
    streak: 64,
    xp: 3890,
    medal: '🥈',
    bio: 'Runner, cook, dad. Trying to do less and feel more.',

    stats: {
      totalQuests: 540,
      perfectDays: 58,
      longestStreak: 64,
      thisWeek: 24,
    },

    highlights: [
      { emoji: '🥈', title: '#2 globally', sub: 'In this friend group' },
      { emoji: '🍳', title: 'Cooked daily', sub: '64 days in a row' },
      { emoji: '🏃', title: '10K every day', sub: 'For the last 30 days' },
    ],

    badges: [
      { emoji: '🍳', title: 'Home Chef', earned: true },
      { emoji: '🏃', title: 'Runner', earned: true },
      { emoji: '🌅', title: 'Early Bird', earned: true },
      { emoji: '💧', title: 'Hydrator', earned: true },
      { emoji: '👟', title: 'Step Machine', earned: true },
      { emoji: '🔥', title: 'Streak Master', earned: true },
      { emoji: '⭐', title: 'Pioneer', earned: true },
      { emoji: '📚', title: 'Bookworm', earned: false },
    ],

    favoriteHabits: [
      { emoji: '🏃', name: 'Running', streak: 64 },
      { emoji: '🍳', name: 'Cooking', streak: 50 },
      { emoji: '🌅', name: 'Wake at 6', streak: 30 },
    ],

    activity: [
      { emoji: '🏃', title: '10K run completed', meta: '1 hour ago', xp: 50, verified: true },
      { emoji: '🍳', title: 'Cooked breakfast', meta: '3 hours ago', xp: 20, verified: true },
      { emoji: '💧', title: 'Drank 8 glasses', meta: '5 hours ago', xp: 20, verified: true },
      { emoji: '🧘', title: 'Evening meditation', meta: 'Yesterday', xp: 25, verified: true },
      { emoji: '👟', title: 'Hit 15,000 steps', meta: 'Yesterday', xp: 40, verified: true },
    ],

    todayTasks: [
      { emoji: '🏃', title: '10K morning run', done: true },
      { emoji: '🍳', title: 'Cook dinner from scratch', done: true },
      { emoji: '💧', title: '8 glasses of water', done: true },
      { emoji: '📚', title: 'Read 20 pages', done: false },
    ],
  },

  {
    id: 3,
    name: 'Ola',
    handle: '@ola',
    rank: 3,
    level: 8,
    streak: 12,
    xp: 660,
    medal: '🥉',
    bio: 'New to Stork. Already obsessed.',
    isCurrentUser: true,

    stats: {
      totalQuests: 84,
      perfectDays: 9,
      longestStreak: 12,
      thisWeek: 18,
    },

    highlights: [
      { emoji: '🚀', title: 'Fastest climber', sub: 'Level 8 in 12 days' },
      { emoji: '✨', title: 'Perfect week', sub: '7/7 days completed' },
      { emoji: '💧', title: 'Hydration queen', sub: '12-day water streak' },
    ],

    badges: [
      { emoji: '🌅', title: 'Early Bird', earned: true },
      { emoji: '🔥', title: 'Streak Starter', earned: true },
      { emoji: '📚', title: 'Bookworm', earned: true },
      { emoji: '🧘', title: 'Zen Beginner', earned: true },
      { emoji: '💧', title: 'Hydrator', earned: true },
      { emoji: '👟', title: 'Step Machine', earned: true },
      { emoji: '⭐', title: 'Pioneer', earned: true },
      { emoji: '🎁', title: 'First Reward', earned: true },
      { emoji: '🏆', title: 'Locked', earned: false },
      { emoji: '👑', title: 'Locked', earned: false },
    ],

    favoriteHabits: [
      { emoji: '💧', name: 'Hydration', streak: 12 },
      { emoji: '🧘', name: 'Meditation', streak: 12 },
      { emoji: '📚', name: 'Reading', streak: 8 },
    ],

    activity: [
      { emoji: '💧', title: 'Drank 8 glasses', meta: '1 hour ago', xp: 20, verified: true },
      { emoji: '🧘', title: 'Meditated for 10 min', meta: '3 hours ago', xp: 25, verified: true },
      { emoji: '🏃', title: 'Morning workout', meta: '5 hours ago', xp: 50, verified: true },
      { emoji: '📚', title: 'Read 30 pages', meta: 'Yesterday', xp: 30, verified: true },
    ],

    todayTasks: [
      { emoji: '💧', title: 'Drink 8 glasses of water', done: true },
      { emoji: '🧘', title: 'Meditate for 10 minutes', done: true },
      { emoji: '🏃', title: 'Morning workout', done: true },
      { emoji: '📚', title: 'Read for 30 minutes', done: false },
      { emoji: '👟', title: 'Hit 10,000 steps', done: false },
    ],
  },

  {
    id: 4,
    name: 'Zoe',
    handle: '@zoecreates',
    rank: 4,
    level: 10,
    streak: 28,
    xp: 1850,
    bio: 'Creative habits > productivity habits. Painting daily.',

    stats: {
      totalQuests: 280,
      perfectDays: 22,
      longestStreak: 28,
      thisWeek: 19,
    },

    highlights: [
      { emoji: '🎨', title: 'Painted 28 days', sub: 'Without missing one' },
      { emoji: '📝', title: 'Journal champion', sub: '50+ entries this month' },
      { emoji: '🎵', title: 'Practiced piano', sub: '15 min daily, 21 days' },
    ],

    badges: [
      { emoji: '🎨', title: 'Artist', earned: true },
      { emoji: '📝', title: 'Journalist', earned: true },
      { emoji: '🌅', title: 'Early Bird', earned: true },
      { emoji: '💧', title: 'Hydrator', earned: true },
      { emoji: '🧘', title: 'Zen Master', earned: true },
      { emoji: '⭐', title: 'Pioneer', earned: true },
      { emoji: '🔥', title: 'Streak Master', earned: false },
      { emoji: '📚', title: 'Bookworm', earned: false },
    ],

    favoriteHabits: [
      { emoji: '🎨', name: 'Painting', streak: 28 },
      { emoji: '📝', name: 'Journaling', streak: 25 },
      { emoji: '🎵', name: 'Piano', streak: 21 },
    ],

    activity: [
      { emoji: '🎨', title: 'Painted for 30 min', meta: '2 hours ago', xp: 30, verified: true },
      { emoji: '📝', title: 'Journaled', meta: '4 hours ago', xp: 15, verified: true },
      { emoji: '🎵', title: 'Piano practice', meta: '6 hours ago', xp: 20, verified: true },
      { emoji: '🧘', title: 'Meditated', meta: 'Yesterday', xp: 25, verified: true },
    ],

    todayTasks: [
      { emoji: '🎨', title: 'Paint for 30 minutes', done: true },
      { emoji: '📝', title: 'Journal entry', done: true },
      { emoji: '🎵', title: 'Piano practice', done: true },
      { emoji: '💧', title: '8 glasses of water', done: false },
    ],
  },

  {
    id: 5,
    name: 'Sam',
    handle: '@samcodes',
    rank: 5,
    level: 9,
    streak: 21,
    xp: 1320,
    bio: 'Coder by day, climber by weekend.',

    stats: {
      totalQuests: 210,
      perfectDays: 17,
      longestStreak: 21,
      thisWeek: 16,
    },

    highlights: [
      { emoji: '💻', title: 'Coded daily', sub: '21 days of side project' },
      { emoji: '🧗', title: 'Climbed 8 routes', sub: 'This month at the gym' },
      { emoji: '📚', title: 'Tech book streak', sub: 'Read 4 books this season' },
    ],

    badges: [
      { emoji: '💻', title: 'Code Daily', earned: true },
      { emoji: '🧗', title: 'Climber', earned: true },
      { emoji: '📚', title: 'Bookworm', earned: true },
      { emoji: '💧', title: 'Hydrator', earned: true },
      { emoji: '🌅', title: 'Early Bird', earned: true },
      { emoji: '⭐', title: 'Pioneer', earned: true },
      { emoji: '🔥', title: 'Streak Master', earned: false },
      { emoji: '👟', title: 'Step Machine', earned: false },
    ],

    favoriteHabits: [
      { emoji: '💻', name: 'Side project', streak: 21 },
      { emoji: '📚', name: 'Tech reading', streak: 18 },
      { emoji: '🧗', name: 'Climbing', streak: 12 },
    ],

    activity: [
      { emoji: '💻', title: 'Worked on side project', meta: '3 hours ago', xp: 40, verified: true },
      { emoji: '📚', title: 'Read tech book', meta: '5 hours ago', xp: 30, verified: true },
      { emoji: '🧗', title: 'Climbing session', meta: 'Yesterday', xp: 50, verified: true },
      { emoji: '💧', title: 'Drank 8 glasses', meta: 'Yesterday', xp: 20, verified: true },
    ],

    todayTasks: [
      { emoji: '💻', title: 'Code for 1 hour', done: true },
      { emoji: '📚', title: 'Read tech chapter', done: true },
      { emoji: '💧', title: '8 glasses of water', done: false },
      { emoji: '🧗', title: 'Climbing session', done: false },
    ],
  },

  {
    id: 6,
    name: 'Rio',
    handle: '@rio.r',
    rank: 6,
    level: 7,
    streak: 14,
    xp: 980,
    bio: 'Yoga + plants + slow living.',

    stats: {
      totalQuests: 168,
      perfectDays: 11,
      longestStreak: 14,
      thisWeek: 14,
    },

    highlights: [
      { emoji: '🧘', title: 'Yoga every day', sub: '14 days strong' },
      { emoji: '🌿', title: 'Plant watering', sub: 'Never missed a day' },
      { emoji: '🍵', title: 'Morning tea ritual', sub: '30+ days streak' },
    ],

    badges: [
      { emoji: '🧘', title: 'Zen Master', earned: true },
      { emoji: '🌿', title: 'Plant Parent', earned: true },
      { emoji: '🍵', title: 'Ritualist', earned: true },
      { emoji: '🌅', title: 'Early Bird', earned: true },
      { emoji: '💧', title: 'Hydrator', earned: true },
      { emoji: '⭐', title: 'Pioneer', earned: true },
      { emoji: '🔥', title: 'Streak Master', earned: false },
      { emoji: '📚', title: 'Bookworm', earned: false },
    ],

    favoriteHabits: [
      { emoji: '🧘', name: 'Yoga', streak: 14 },
      { emoji: '🌿', name: 'Plants', streak: 14 },
      { emoji: '🍵', name: 'Tea ritual', streak: 30 },
    ],

    activity: [
      { emoji: '🧘', title: 'Yoga flow', meta: '2 hours ago', xp: 25, verified: true },
      { emoji: '🌿', title: 'Watered plants', meta: '5 hours ago', xp: 10, verified: true },
      { emoji: '🍵', title: 'Morning tea', meta: '8 hours ago', xp: 5, verified: false },
      { emoji: '💧', title: 'Hydration goal', meta: 'Yesterday', xp: 20, verified: true },
    ],

    todayTasks: [
      { emoji: '🧘', title: 'Yoga flow', done: true },
      { emoji: '🌿', title: 'Water plants', done: true },
      { emoji: '💧', title: 'Drink 8 glasses', done: false },
      { emoji: '📚', title: 'Read 20 pages', done: false },
    ],
  },

  {
    id: 7,
    name: 'Leo',
    handle: '@leo.fit',
    rank: 7,
    level: 6,
    streak: 9,
    xp: 720,
    bio: 'Lifting, eating, sleeping. Repeat.',

    stats: {
      totalQuests: 112,
      perfectDays: 7,
      longestStreak: 9,
      thisWeek: 12,
    },

    highlights: [
      { emoji: '💪', title: 'Lifted 9 days', sub: 'Without missing leg day' },
      { emoji: '🥗', title: 'Macro tracked', sub: 'Every meal this week' },
      { emoji: '😴', title: '8h sleep', sub: '9 nights in a row' },
    ],

    badges: [
      { emoji: '💪', title: 'Lifter', earned: true },
      { emoji: '🥗', title: 'Nutrition Nerd', earned: true },
      { emoji: '😴', title: 'Sleep Pro', earned: true },
      { emoji: '💧', title: 'Hydrator', earned: true },
      { emoji: '⭐', title: 'Pioneer', earned: true },
      { emoji: '🌅', title: 'Early Bird', earned: false },
      { emoji: '🔥', title: 'Streak Master', earned: false },
      { emoji: '👟', title: 'Step Machine', earned: false },
    ],

    favoriteHabits: [
      { emoji: '💪', name: 'Lifting', streak: 9 },
      { emoji: '🥗', name: 'Macros', streak: 9 },
      { emoji: '😴', name: 'Sleep 8h', streak: 9 },
    ],

    activity: [
      { emoji: '💪', title: 'Leg day at gym', meta: '4 hours ago', xp: 60, verified: true },
      { emoji: '🥗', title: 'Logged macros', meta: '6 hours ago', xp: 15, verified: false },
      { emoji: '😴', title: 'Slept 8 hours', meta: 'This morning', xp: 25, verified: false },
      { emoji: '💧', title: 'Drank 8 glasses', meta: 'Yesterday', xp: 20, verified: true },
    ],

    todayTasks: [
      { emoji: '💪', title: 'Gym session', done: true },
      { emoji: '🥗', title: 'Track macros', done: true },
      { emoji: '💧', title: '8 glasses of water', done: false },
      { emoji: '😴', title: 'Sleep 8 hours', done: false },
    ],
  },
];
