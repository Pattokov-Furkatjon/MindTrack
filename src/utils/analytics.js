import { formatDayLabel, getTodayKey } from './formatters';

function uniqueDateKeys(sessions) {
  return Array.from(new Set(sessions.map((session) => session.date))).sort((a, b) =>
    a > b ? -1 : 1,
  );
}

export function getSessionTotals(sessions) {
  const totalMinutes = sessions.reduce(
    (sum, session) => sum + Number(session.durationMinutes || 0),
    0,
  );
  const averageMinutes = sessions.length
    ? Math.round(totalMinutes / sessions.length)
    : 0;
  const averageFocus = sessions.length
    ? (sessions.reduce((sum, session) => sum + Number(session.focusScore || 0), 0) /
        sessions.length)
    : 0;

  return {
    totalMinutes,
    totalSessions: sessions.length,
    averageMinutes,
    averageFocus: Number(averageFocus.toFixed(1)),
  };
}

export function getCurrentStreak(sessions) {
  const activeDates = new Set(uniqueDateKeys(sessions));
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  let streak = 0;

  while (activeDates.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function getWeeklyTimeline(sessions, totalDays = 7) {
  const timeline = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let offset = totalDays - 1; offset >= 0; offset -= 1) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() - offset);
    const dateKey = currentDate.toISOString().slice(0, 10);
    const daySessions = sessions.filter((session) => session.date === dateKey);
    const minutes = daySessions.reduce(
      (sum, session) => sum + Number(session.durationMinutes || 0),
      0,
    );

    timeline.push({
      date: dateKey,
      label: formatDayLabel(dateKey),
      minutes,
      sessions: daySessions.length,
    });
  }

  return timeline;
}

export function getCategoryBreakdown(sessions) {
  const totals = sessions.reduce((categoryMap, session) => {
    const key = session.category || 'Other';
    categoryMap[key] = (categoryMap[key] || 0) + Number(session.durationMinutes || 0);
    return categoryMap;
  }, {});

  return Object.entries(totals)
    .map(([name, minutes]) => ({ name, minutes }))
    .sort((left, right) => right.minutes - left.minutes);
}

export function getFocusBreakdown(sessions) {
  const buckets = [
    { label: 'Low', range: [1, 4], count: 0 },
    { label: 'Steady', range: [5, 7], count: 0 },
    { label: 'Sharp', range: [8, 10], count: 0 },
  ];

  sessions.forEach((session) => {
    const score = Number(session.focusScore || 0);
    const matchingBucket = buckets.find(
      (bucket) => score >= bucket.range[0] && score <= bucket.range[1],
    );

    if (matchingBucket) {
      matchingBucket.count += 1;
    }
  });

  return buckets;
}

export function getDashboardStats(state) {
  const sessions = [...state.sessions].sort(
    (left, right) => new Date(right.createdAt) - new Date(left.createdAt),
  );
  const notes = [...state.notes].sort(
    (left, right) => new Date(right.updatedAt) - new Date(left.updatedAt),
  );
  const totals = getSessionTotals(sessions);
  const todayKey = getTodayKey();
  const todaySessions = sessions.filter((session) => session.date === todayKey);
  const longestSession = sessions.reduce(
    (largest, session) =>
      session.durationMinutes > largest.durationMinutes ? session : largest,
    { durationMinutes: 0 },
  );

  return {
    ...totals,
    todayMinutes: todaySessions.reduce(
      (sum, session) => sum + Number(session.durationMinutes || 0),
      0,
    ),
    todaySessions: todaySessions.length,
    streak: getCurrentStreak(sessions),
    pinnedNotes: notes.filter((note) => note.pinned).length,
    notesCount: notes.length,
    recentSessions: sessions.slice(0, 5),
    recentNotes: notes.slice(0, 4),
    weeklyTimeline: getWeeklyTimeline(sessions),
    longestSessionMinutes: longestSession.durationMinutes || 0,
  };
}

export function buildAnalyticsInsights(sessions, notes) {
  const insights = [];
  const totals = getSessionTotals(sessions);
  const categoryBreakdown = getCategoryBreakdown(sessions);
  const weeklyTimeline = getWeeklyTimeline(sessions);
  const activeDays = weeklyTimeline.filter((day) => day.minutes > 0).length;
  const bestDay = weeklyTimeline.reduce(
    (currentBest, day) => (day.minutes > currentBest.minutes ? day : currentBest),
    { minutes: 0, label: 'N/A' },
  );

  if (totals.totalSessions === 0) {
    return ['No session data yet. Add a session to unlock analytics.'];
  }

  insights.push(
    `You logged ${totals.totalSessions} sessions totaling ${totals.totalMinutes} minutes.`,
  );

  if (categoryBreakdown[0]) {
    insights.push(
      `${categoryBreakdown[0].name} is your strongest category this period.`,
    );
  }

  insights.push(
    activeDays >= 5
      ? 'You are showing consistent weekly momentum.'
      : 'Try spreading sessions across more days for steadier progress.',
  );

  if (bestDay.minutes > 0) {
    insights.push(`${bestDay.label} carried your heaviest workload this week.`);
  }

  insights.push(
    notes.length > 0
      ? `You captured ${notes.length} notes, which helps preserve decisions and ideas.`
      : 'Add notes after sessions so your progress comes with context.',
  );

  return insights;
}
