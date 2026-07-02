// ============================================================
// MOCK DATA
// ============================================================

export const MOCK_USER = {
  name: "Alex Rivera",
  age: 28,
  gender: "Male",
  height: 178,
  weight: 82,
  targetWeight: 75,
  activityLevel: "Moderately Active",
  goal: "Fat Loss",
  bmi: 25.9,
  bmr: 1890,
  tdee: 2929,
  maintenanceCals: 2929,
  cuttingCals: 2429,
  bulkingCals: 3429,
};

export const MOCK_TODAY = {
  caloriesConsumed: 1842,
  caloriesGoal: 2429,
  caloriesBurned: 387,
  waterIntake: 6,
  waterGoal: 8,
  steps: 8421,
  stepsGoal: 10000,
  sleepHours: 7.2,
  sleepGoal: 8,
  workoutStreak: 14,
  protein: { consumed: 142, goal: 180 },
  carbs: { consumed: 198, goal: 240 },
  fats: { consumed: 58, goal: 70 },
  fiber: { consumed: 22, goal: 30 },
  sodium: { consumed: 1840, goal: 2300 },
  sugar: { consumed: 42, goal: 50 },
};

export const MOCK_WORKOUTS = [
  { id: 1, name: "Bench Press", muscle: "🫁", group: "Chest", sets: 4, reps: "8-10", weight: "80kg", duration: 45, calories: 180, intensity: "High", notes: "PR attempt next session" },
  { id: 2, name: "Incline Dumbbell Press", muscle: "💪", group: "Chest", sets: 3, reps: "10-12", weight: "30kg", duration: 30, calories: 120, intensity: "Medium", notes: "" },
  { id: 3, name: "Cable Flyes", muscle: "💪", group: "Chest", sets: 3, reps: "12-15", weight: "15kg", duration: 20, calories: 87, intensity: "Low", notes: "Squeeze at peak" },
];

export const MOCK_MEALS = {
  breakfast: {
    name: "Breakfast", icon: "🌅", calories: 520,
    items: [
      { name: "Oats with Banana", serving: "250g", calories: 320, protein: 12, carbs: 58, fats: 5 },
      { name: "Greek Yogurt", serving: "150g", calories: 120, protein: 15, carbs: 8, fats: 2 },
      { name: "Black Coffee", serving: "240ml", calories: 5, protein: 0, carbs: 1, fats: 0 },
    ],
  },
  lunch: {
    name: "Lunch", icon: "☀️", calories: 680,
    items: [
      { name: "Grilled Chicken Breast", serving: "200g", calories: 330, protein: 62, carbs: 0, fats: 7 },
      { name: "Brown Rice", serving: "180g", calories: 240, protein: 5, carbs: 50, fats: 2 },
      { name: "Broccoli (steamed)", serving: "100g", calories: 55, protein: 4, carbs: 10, fats: 1 },
    ],
  },
  dinner: {
    name: "Dinner", icon: "🌙", calories: 580,
    items: [
      { name: "Salmon Fillet", serving: "180g", calories: 360, protein: 40, carbs: 0, fats: 21 },
      { name: "Sweet Potato", serving: "150g", calories: 135, protein: 2, carbs: 31, fats: 0 },
      { name: "Mixed Salad", serving: "100g", calories: 35, protein: 2, carbs: 7, fats: 0 },
    ],
  },
  snacks: {
    name: "Snacks", icon: "🍎", calories: 185,
    items: [
      { name: "Protein Bar", serving: "60g", calories: 185, protein: 20, carbs: 22, fats: 6 },
    ],
  },
};

export const HABITS = [
  { id: 1, label: "Morning workout", streak: 14, done: true, icon: "🏋️" },
  { id: 2, label: "Take vitamins", streak: 21, done: true, icon: "💊" },
  { id: 3, label: "Meditate 10 min", streak: 7, done: false, icon: "🧘" },
  { id: 4, label: "Read 20 minutes", streak: 3, done: true, icon: "📚" },
  { id: 5, label: "No alcohol", streak: 30, done: true, icon: "🚫" },
];

export const WEEKLY_WEIGHT = [
  { day: "Mon", weight: 82.8 }, { day: "Tue", weight: 82.5 },
  { day: "Wed", weight: 82.2 }, { day: "Thu", weight: 82.4 },
  { day: "Fri", weight: 82.0 }, { day: "Sat", weight: 81.8 },
  { day: "Sun", weight: 82.0 },
];

export const WEEKLY_CALORIES = [
  { day: "Mon", consumed: 2310, burned: 420 }, { day: "Tue", consumed: 2180, burned: 280 },
  { day: "Wed", consumed: 2450, burned: 560 }, { day: "Thu", consumed: 2200, burned: 390 },
  { day: "Fri", consumed: 2380, burned: 480 }, { day: "Sat", consumed: 2560, burned: 320 },
  { day: "Sun", consumed: 1842, burned: 387 },
];

export const INITIAL_CHAT = [
  {
    role: "assistant",
    content: "👋 Hey Alex! I'm your AI Fitness Coach. I know your profile — 28M, 82kg, targeting **fat loss** down to 75kg.\n\nI can help you with:\n- **Personalized workout plans** based on your goals\n- **Meal prep ideas** hitting your 2,429 cal target\n- **Macro guidance** and supplement advice\n- **Recovery & sleep** optimization\n- **Progress analysis** and motivation\n\nWhat's on your mind today?",
  },
];

export const QUICK_PROMPTS = [
  "Create a workout plan for today",
  "What should I eat post-workout?",
  "Am I hitting my protein goals?",
  "Suggest a high-protein meal",
  "How to improve my sleep?",
  "Calculate my ideal macros",
];

export const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "⚡", section: "MAIN" },
  { id: "workouts", label: "Workouts", icon: "💪", section: "MAIN" },
  { id: "nutrition", label: "Nutrition", icon: "🥗", section: "MAIN" },
  { id: "ai-coach", label: "AI Coach", icon: "🤖", section: "MAIN" },
  { id: "analytics", label: "Analytics", icon: "📊", section: "INSIGHTS" },
  { id: "profile", label: "Profile", icon: "👤", section: "ACCOUNT" },
];
