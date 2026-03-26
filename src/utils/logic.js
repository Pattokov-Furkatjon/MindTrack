// Session-based habit tracking logic  
// Professional routine management system

/**
 * Create a new session object
 */
export const createSession = (type, startTime, endTime) => {
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  let startTotalMin = startHour * 60 + startMin;
  let endTotalMin = endHour * 60 + endMin;

  // Handle case where end time is next day
  if (endTotalMin < startTotalMin) {
    endTotalMin += 24 * 60;
  }

  const totalMin = endTotalMin - startTotalMin;
  const duration = Math.round((totalMin / 60) * 100) / 100; // hours in decimal

  return {
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type, // 'study', 'work', 'exercise'
    startTime,
    endTime,
    duration, // in hours (decimal)
    timestamp: Date.now(),
  };
};

/**
 * Calculate totals from sessions array
 */
export const calculateSessionTotals = (sessions = []) => {
  if (!sessions || sessions.length === 0) {
    return {
      totalStudy: 0,
      totalWork: 0,
      totalExercise: 0,
      totalTime: 0,
      sessionCount: 0,
      averageSessionDuration: 0,
    };
  }

  const totals = {
    totalStudy: 0,
    totalWork: 0,
    totalExercise: 0,
    totalTime: 0,
  };

  sessions.forEach((session) => {
    const duration = session.duration || 0;
    totals.totalTime += duration;

    if (session.type === "study") totals.totalStudy += duration;
    if (session.type === "work") totals.totalWork += duration;
    if (session.type === "exercise") totals.totalExercise += duration;
  });

  // Round to 2 decimals
  Object.keys(totals).forEach((key) => {
    totals[key] = Math.round(totals[key] * 100) / 100;
  });

  return {
    ...totals,
    sessionCount: sessions.length,
    averageSessionDuration:
      sessions.length > 0
        ? Math.round((totals.totalTime / sessions.length) * 100) / 100
        : 0,
  };
};

/**
 * Calculate productivity score (0-100)
 * Based on: study time (30%), exercise (20%), work (20%), session count (30%)
 */
export const calculateProductivityScore = (
  totalStudy = 0,
  totalExercise = 0,
  totalWork = 0,
  sessionCount = 0
) => {
  // Goals
  const studyGoal = 5; // 5 hours
  const exerciseGoal = 1; // 1 hour
  const workGoal = 4; // 4 hours
  const sessionGoal = 4; // 4 sessions

  // Calculate individual scores
  const studyScore = Math.min((totalStudy / studyGoal) * 100, 100) * 0.3;
  const exerciseScore = Math.min((totalExercise / exerciseGoal) * 100, 100) * 0.2;
  const workScore = Math.min((totalWork / workGoal) * 100, 100) * 0.2;
  const sessionScore = Math.min((sessionCount / sessionGoal) * 100, 100) * 0.3;

  return Math.round(studyScore + exerciseScore + workScore + sessionScore);
};

/**
 * Generate smart feedback based on session data
 */
export const generateSmartFeedback = (
  totalStudy,
  totalExercise,
  totalWork,
  sessionCount
) => {
  let message = "";
  let type = "neutral"; // neutral, positive, warning, excellent

  const totalTime = totalStudy + totalExercise + totalWork;
  const score = calculateProductivityScore(
    totalStudy,
    totalExercise,
    totalWork,
    sessionCount
  );

  // Based on total activity
  if (totalTime === 0) {
    message =
      "👋 Start your first session! Click 'Start Session' to begin tracking your day.";
    type = "neutral";
  } else if (totalTime < 2) {
    message = `📈 Good start! You've done ${totalTime}h so far. Keep going!`;
    type = "neutral";
  } else if (score >= 80) {
    message = `🔥 Incredible! Your productivity score is ${score}/100. You're crushing it!`;
    type = "excellent";
  } else if (score >= 60) {
    message = `👍 Great job! Your productivity score is ${score}/100. Keep the momentum!`;
    type = "positive";
  } else if (score >= 40) {
    message = `⚠️ You're at ${score}/100. Push a bit more to reach your goals!`;
    type = "warning";
  }

  // Session-specific feedback
  if (sessionCount >= 4) {
    message += " 💪 Excellent session frequency!";
  } else if (sessionCount === 0 && totalTime === 0) {
    // First message only
  } else if (sessionCount < 2) {
    message += " 📌 Try breaking your work into 2-3 sessions for better focus.";
  }

  return { message, type, score };
};

/**
 * Get today's entry (or create empty one)
 */
export const getTodayEntry = (entries) => {
  const today = new Date().toISOString().split("T")[0];
  return entries.find((e) => e.date === today) || null;
};

/**
 * Get all entries for specific date
 */
export const getEntryByDate = (entries, date) => {
  return entries.find((e) => e.date === date) || null;
};

/**
 * Calculate weekly statistics
 */
export const calculateWeeklyStats = (entries) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekEntries = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const entry = entries.find((e) => e.date === dateStr);
    if (entry) weekEntries.push(entry);
  }

  if (weekEntries.length === 0) {
    return {
      weeklyTotal: 0,
      weeklyStudy: 0,
      weeklyExercise: 0,
      weeklyWork: 0,
      averageDaily: 0,
      weekScore: 0,
      bestDay: 0,
      daysActive: 0,
    };
  }

  let totalTime = 0;
  let totalStudy = 0;
  let totalExercise = 0;
  let totalWork = 0;
  let bestDay = 0;

  weekEntries.forEach((entry) => {
    const totals = calculateSessionTotals(entry.sessions);
    totalTime += totals.totalTime;
    totalStudy += totals.totalStudy;
    totalExercise += totals.totalExercise;
    totalWork += totals.totalWork;
    bestDay = Math.max(bestDay, totals.totalTime);
  });

  const score = calculateProductivityScore(totalStudy, totalExercise, totalWork, weekEntries.length * 4);

  return {
    weeklyTotal: Math.round(totalTime * 100) / 100,
    weeklyStudy: Math.round(totalStudy * 100) / 100,
    weeklyExercise: Math.round(totalExercise * 100) / 100,
    weeklyWork: Math.round(totalWork * 100) / 100,
    averageDaily: Math.round((totalTime / 7) * 100) / 100,
    weekScore: score,
    bestDay: Math.round(bestDay * 100) / 100,
    daysActive: weekEntries.length,
  };
};

/**
 * Get motivational message based on time of day
 */
export const getMotivationalMessage = () => {
  const hour = new Date().getHours();

  if (hour < 6) {
    return "🌙 Night owl! Time to rest?";
  } else if (hour < 12) {
    return "🌅 Good morning! Let's make today productive!";
  } else if (hour < 17) {
    return "☀️ Afternoon! Keep the momentum going!";
  } else if (hour < 21) {
    return "🌆 Evening push! Finish strong today!";
  } else {
    return "🌙 Wind down time, but keep focused!";
  }
};

/**
 * Format time for display
 */
export const formatTime = (hours) => {
  if (hours === 0) return "0h";
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

/**
 * Get streak count
 */
export const calculateStreak = (entries) => {
  if (entries.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let currentDate = new Date(today);

  // Sort entries by date descending
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);

    if (entryDate.getTime() === currentDate.getTime()) {
      // Check if this day has sessions
      if (entry.sessions && entry.sessions.length > 0) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Group entries by date
 */
export const getEntriesByDate = (entries = []) => {
  const entriesByDate = {};

  entries.forEach((entry) => {
    if (!entriesByDate[entry.date]) {
      entriesByDate[entry.date] = [];
    }
    entriesByDate[entry.date].push(entry);
  });

  return entriesByDate;
};
