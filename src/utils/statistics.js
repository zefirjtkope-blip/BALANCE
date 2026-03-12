// Подсчёт непрерывной серии дней с записями
const calculateStreak = (entries) => {
  if (!entries.length) return 0;
  const dates = [...new Set(entries.map(e => e.date))].sort((a,b) => new Date(b) - new Date(a));
  let streak = 1;
  let current = new Date(dates[0]);
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i-1]);
    const diff = (current - prev) / (1000*60*60*24);
    if (diff === 1) streak++;
    else break;
    current = prev;
  }
  return streak;
};

// Получение данных за последние 7 дней
const getLast7DaysData = (entries) => {
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toDateString();
    const total = entries.filter(e => e.date === dateStr).reduce((sum, e) => sum + (e.calories || 0), 0);
    result.push(total);
  }
  return result;
};