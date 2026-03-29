// ============================================
// APPLICATION CONSTANTS & CONFIGURATION
// ============================================

// Productivity Goals (in hours)
export const PRODUCTIVITY_GOALS = {
  STUDY: 5,
  EXERCISE: 1,
  WORK: 4,
  SESSION_COUNT: 4,
};

// Scoring Weights
export const PRODUCTIVITY_WEIGHTS = {
  STUDY: 0.3,
  EXERCISE: 0.2,
  WORK: 0.2,
  SESSION_COUNT: 0.3,
};

// Score Labels and Thresholds
export const SCORE_LABELS = {
  90: "🔥 Exceptional",
  80: "⭐ Excellent",
  70: "👍 Great",
  60: "📈 Good",
  50: "👌 Decent",
  30: "⚠️ Needs Work",
  0: "💪 Get Started",
};

// Performance Levels (in hours)
export const PERFORMANCE_THRESHOLDS = {
  EXCEPTIONAL: 25,
  EXCELLENT: 20,
  GOOD: 15,
  FAIR: 10,
  LOW: 0,
};

// Session Types
export const SESSION_TYPES = {
  STUDY: "study",
  WORK: "work",
  EXERCISE: "exercise",
};

// Timeouts and Delays
export const TIMEOUTS = {
  FETCH: 5000,
  ANIMATION: 300,
};
