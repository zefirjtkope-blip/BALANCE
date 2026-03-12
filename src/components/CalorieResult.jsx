import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaApple, FaDumbbell, FaWalking, FaRunning, 
  FaHeartbeat, FaChevronRight, FaTimes,
  FaWeight, FaBalanceScale, FaArrowUp, FaFire,
  FaCheck, FaClock
} from 'react-icons/fa';
import NutritionChart from './NutritionChart';
import { calculateMacros } from '../utils/calorieCalculator';

// ========== Массив рекомендаций ==========
const TIPS = [
  'Пейте воду за 20–30 минут до еды — это помогает контролировать аппетит.',
  'Добавьте в рацион больше клетчатки: овощи, фрукты, цельнозерновые.',
  'Не пропускайте завтрак — он задаёт энергию на весь день.',
  'Старайтесь есть медленно, тщательно пережёвывая пищу.',
  'Белки должны присутствовать в каждом приёме пищи.',
  'Контролируйте размер порций: используйте тарелки меньшего диаметра.',
  'Ограничьте добавленный сахар — он скрыт во многих продуктах.',
  'Планируйте меню заранее, чтобы избежать спонтанных перекусов.',
  'После тренировки обязательно съедайте белково-углеводный приём.',
  'Сон не менее 7–8 часов важен для нормализации веса.',
  'Не запрещайте себе любимые продукты — просто контролируйте количество.',
  'Читайте этикетки: обращайте внимание на состав и калорийность.',
];

// ========== Анимированное число ==========
const AnimatedNumber = ({ value, duration = 300 }) => {
  const [displayValue, setDisplayValue] = useState(value);
  React.useEffect(() => {
    const startTime = performance.now();
    const startValue = displayValue;
    const change = value - startValue;
    if (change === 0) return;
    let raf;
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.round(startValue + change * eased);
      setDisplayValue(current);
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{displayValue}</>;
};

// ========== Прогресс-бар ==========
const ProgressBar = ({ value, max, color, glow = false }) => {
  const percent = Math.min((value / max) * 100, 100);
  const isOver = value > max;
  return (
    <div style={{ position: 'relative', width: '100%', height: 6, background: '#1f1f24', borderRadius: 3 }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          background: color,
          borderRadius: 3,
          boxShadow: glow ? `0 0 48px ${color}CC` : 'none',
        }}
      />
      {isOver && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          height: '100%',
          width: 4,
          background: '#ff6b6b',
          borderRadius: 2,
        }} />
      )}
    </div>
  );
};

// ========== Кружок дня недели ==========
const DayCircle = ({ day, isActive, isToday, hasEntry }) => {
  const [showCheck, setShowCheck] = useState(hasEntry);

  React.useEffect(() => {
    if (hasEntry) setShowCheck(true);
  }, [hasEntry]);

  let bgColor = '#2a2a2a';
  let border = 'none';
  let glow = 'none';
  let checkColor = '#fff';

  if (hasEntry) {
    bgColor = '#2ED47A';
    glow = '0 0 18px #2ED47A66';
  } else if (isToday) {
    border = '2px solid #2ED47A';
    glow = '0 0 12px #2ED47A40';
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{day.name}</div>
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: hasEntry ? bgColor : 'transparent',
          border: border,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: glow,
          transition: 'background 0.2s, box-shadow 0.2s',
        }}
      >
        {hasEntry && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
          >
            <FaCheck size={14} color={checkColor} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

// ========== Мини-неделя ==========
const MiniWeek = ({ foodEntries }) => {
  const today = new Date();
  const todayStr = today.toDateString();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toDateString();
    const hasEntry = foodEntries.some(entry => entry.date === dateStr);
    const dayName = date.toLocaleDateString('ru-RU', { weekday: 'short' }).slice(0, 2).toLowerCase();
    days.push({ 
      name: dayName, 
      dateStr, 
      hasEntry, 
      isToday: dateStr === todayStr 
    });
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
      {days.map((day, idx) => (
        <DayCircle
          key={idx}
          day={day}
          isActive={false}
          isToday={day.isToday}
          hasEntry={day.hasEntry}
        />
      ))}
    </div>
  );
};

// ========== Модальное окно активности ==========
const ActivityModal = ({ isOpen, onClose, currentActivity, onSelect }) => {
  const activities = [
    { value: 'sedentary', label: 'Малоподвижный', description: 'Минимум физической активности', icon: <FaWalking size={24} />, coefficient: 1.2 },
    { value: 'light', label: 'Лёгкая активность', description: 'Лёгкие упражнения 1–3 дня в неделю', icon: <FaWalking size={24} style={{ opacity: 0.8 }} />, coefficient: 1.375 },
    { value: 'moderate', label: 'Умеренная активность', description: 'Тренировки 3–5 раз в неделю', icon: <FaRunning size={24} />, coefficient: 1.55 },
    { value: 'high', label: 'Высокая активность', description: 'Интенсивные тренировки 6–7 раз в неделю', icon: <FaDumbbell size={24} />, coefficient: 1.725 },
    { value: 'very_active', label: 'Очень высокая активность', description: 'Физическая работа + тренировки', icon: <FaHeartbeat size={24} />, coefficient: 1.9 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 1000,
            }}
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              background: '#141418',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 20,
              zIndex: 1001,
              border: '1px solid #232329',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>Уровень активности</h3>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                <FaTimes size={20} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {activities.map((act) => (
                <motion.div
                  key={act.value}
                  whileHover={{ scale: 1.02, background: '#1f1f27' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(act.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: 12,
                    borderRadius: 16,
                    background: currentActivity === act.value ? '#1f1f27' : 'transparent',
                    border: '1px solid',
                    borderColor: currentActivity === act.value ? '#3a8dff' : '#232329',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ width: 40, color: act.coefficient > 1.5 ? '#ff922b' : '#3a8dff' }}>
                    {act.icon}
                  </div>
                  <div style={{ flex: 1, marginLeft: 12 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{act.label}</div>
                    <div style={{ fontSize: 13, color: '#888' }}>{act.description}</div>
                  </div>
                  {currentActivity === act.value && (
                    <div style={{ color: '#3a8dff', marginLeft: 8 }}>✓</div>
                  )}
                </motion.div>
              ))}
            </div>
            <div style={{ marginTop: 16, fontSize: 13, color: '#888', textAlign: 'center' }}>
              Коэффициент активности влияет на дневную норму калорий
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ========== Модальное окно цели ==========
const GoalModal = ({ isOpen, onClose, currentGoal, onSelect }) => {
  const goals = [
    { value: 'lose', label: 'Снижение веса', description: 'Дефицит 10–20% от нормы', icon: <FaWeight size={24} />, adjustment: -500 },
    { value: 'maintain', label: 'Поддержание веса', description: 'Баланс калорий', icon: <FaBalanceScale size={24} />, adjustment: 0 },
    { value: 'gain', label: 'Набор массы', description: 'Профицит 10–15%', icon: <FaArrowUp size={24} />, adjustment: 500 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 1000,
            }}
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              background: '#141418',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 20,
              zIndex: 1001,
              border: '1px solid #232329',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>Цель</h3>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                <FaTimes size={20} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {goals.map((g) => (
                <motion.div
                  key={g.value}
                  whileHover={{ scale: 1.02, background: '#1f1f27' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(g.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: 12,
                    borderRadius: 16,
                    background: currentGoal === g.value ? '#1f1f27' : 'transparent',
                    border: '1px solid',
                    borderColor: currentGoal === g.value ? '#3a8dff' : '#232329',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ width: 40, color: g.value === 'gain' ? '#ff922b' : '#3a8dff' }}>
                    {g.icon}
                  </div>
                  <div style={{ flex: 1, marginLeft: 12 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{g.label}</div>
                    <div style={{ fontSize: 13, color: '#888' }}>{g.description}</div>
                  </div>
                  {currentGoal === g.value && (
                    <div style={{ color: '#3a8dff', marginLeft: 8 }}>✓</div>
                  )}
                </motion.div>
              ))}
            </div>
            <div style={{ marginTop: 16, fontSize: 13, color: '#888', textAlign: 'center' }}>
              Цель определяет калорийность рациона
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ========== Карточка калорий (главная) ==========
const CalorieCard = ({ value, max, streakData, isExpanded, onToggle }) => {
  const percent = Math.min((value / max) * 100, 100);
  const isOver = value > max;
  const remaining = max - value;
  const status = isOver 
    ? `Превышение +${Math.round(value - max)} ккал` 
    : `Осталось ${Math.round(remaining)} ккал`;

  return (
    <motion.div
      layout
      transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
      style={{
        background: '#141418',
        borderRadius: 24,
        padding: 20,
        border: '1px solid #232329',
        marginBottom: 16,
        cursor: 'pointer',
      }}
      onClick={onToggle}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: '#3a8dffcc' }}>Калории</span>
        <span style={{ fontSize: 14, color: '#888' }}>Цель {max} ккал</span>
      </div>
      <div style={{ fontSize: 48, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
        <AnimatedNumber value={value} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <ProgressBar value={value} max={max} color="#3a8dff" glow={true} />
      </div>
      <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
        {status}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            style={{ marginTop: 16, borderTop: '1px solid #232329', paddingTop: 16 }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Среднее за 7 дней</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>
                  {Math.round(streakData?.avg || 0)} ккал
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Лучший день</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>
                  {Math.round(streakData?.best || 0)} ккал
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Тренд</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: streakData?.trend > 0 ? '#2ed47a' : (streakData?.trend < 0 ? '#ff6b6b' : '#888') }}>
                  {streakData?.trend > 0 ? '↑' : streakData?.trend < 0 ? '↓' : '—'} {streakData?.trend ? Math.abs(streakData.trend).toFixed(1) : 0}%
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ========== Группа макросов ==========
const MacroGroup = ({ protein, fat, carbs, proteinMax, fatMax, carbsMax }) => {
  const macros = [
    { label: 'Белки', value: protein, max: proteinMax, color: '#8a5cff' },
    { label: 'Жиры', value: fat, max: fatMax, color: '#2ed47a' },
    { label: 'Углеводы', value: carbs, max: carbsMax, color: '#2ed9ff' },
  ];

  const totalProtein = proteinMax;
  const totalFat = fatMax;
  const totalCarbs = carbsMax;
  const total = totalProtein + totalFat + totalCarbs;
  const proteinPercent = total ? Math.round((totalProtein / total) * 100) : 33;
  const fatPercent = total ? Math.round((totalFat / total) * 100) : 33;
  const carbsPercent = total ? 100 - proteinPercent - fatPercent : 34;

  return (
    <div style={{
      background: '#141418',
      borderRadius: 20,
      padding: '16px 12px',
      border: '1px solid #232329',
      marginBottom: 24,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {macros.map((m) => {
          const deviation = m.value - m.max;
          const deviationText = deviation > 0 ? `+${Math.round(deviation)}г` : `${Math.round(deviation)}г`;
          return (
            <div key={m.label} style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: `${m.color}cc`, marginBottom: 2 }}>{m.label}</span>
              <div style={{ fontSize: 26, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>
                <AnimatedNumber value={m.value} />
              </div>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>
                {Math.round(m.value)} / {Math.round(m.max)} г
              </div>
              <div style={{ marginBottom: 4 }}>
                <ProgressBar value={m.value} max={m.max} color={m.color} glow={true} />
              </div>
              <div style={{ fontSize: 12, color: deviation > 0 ? '#ff6b6b' : '#888' }}>
                {deviationText}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 12, fontSize: 12, color: '#888', textAlign: 'center', borderTop: '1px solid #232329', paddingTop: 8 }}>
        Баланс дня: Белки {proteinPercent}% · Жиры {fatPercent}% · Углеводы {carbsPercent}%
      </div>
    </div>
  );
};

// ========== Вспомогательные функции ==========
function calculateStreak(entries) {
  if (!entries.length) return 0;
  const dates = [...new Set(entries.map(e => e.date))].sort((a, b) => new Date(b) - new Date(a));
  let streak = 1;
  let current = new Date(dates[0]);
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const diff = (current - prev) / (1000 * 60 * 60 * 24);
    if (diff === 1) streak++;
    else break;
    current = prev;
  }
  return streak;
}

function getStreakData(entries, field) {
  const today = new Date();
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    last7Days.push(date.toDateString());
  }
  const values = last7Days.map(date => {
    const dayEntries = entries.filter(e => e.date === date);
    return dayEntries.reduce((sum, e) => sum + (e[field] || 0), 0);
  });
  const avg = values.reduce((a, b) => a + b, 0) / 7;
  const best = Math.max(...values);
  const worst = Math.min(...values);
  const trend = values.length >= 2 ? ((values[6] - values[0]) / values[0]) * 100 : 0;
  return { avg, best, worst, trend: isFinite(trend) ? trend : 0 };
}

function bestStreak(entries) {
  if (!entries.length) return 0;
  const dates = [...new Set(entries.map(e => e.date))].sort((a, b) => new Date(a) - new Date(b));
  let best = 1;
  let current = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i-1]);
    const curr = new Date(dates[i]);
    const diff = (curr - prev) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      current++;
      best = Math.max(best, current);
    } else {
      current = 1;
    }
  }
  return best;
}

function monthlyActiveDays(entries) {
  const now = new Date();
  const monthAgo = new Date(now);
  monthAgo.setDate(now.getDate() - 30);
  const entriesInMonth = entries.filter(e => new Date(e.date) >= monthAgo);
  return new Set(entriesInMonth.map(e => e.date)).size;
}

// ========== Иконка стрика ==========
const StreakIcon = () => (
  <div style={{ filter: 'drop-shadow(0 0 24px #ff922b66)' }}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14 10L18 12L14 14L12 22L10 14L6 12L10 10L12 2Z" fill="#ff922b" fillOpacity="0.9" />
    </svg>
  </div>
);

// ========== Главный компонент ==========
function CalorieResult({ calorieData, userProfile, foodEntries, onReset, onNavigate, onProfileUpdate }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expandedCard, setExpandedCard] = useState(null); // 'calories' или null
  const [streakExpanded, setStreakExpanded] = useState(false);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [goalModalOpen, setGoalModalOpen] = useState(false);

  // Состояние для динамических рекомендаций
  const [tipIndex, setTipIndex] = useState(() => Math.floor(Math.random() * TIPS.length));

  useEffect(() => {
    // Обновляем рекомендацию каждый час
    const intervalId = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 60 * 60 * 1000); // 1 час

    return () => clearInterval(intervalId);
  }, []);

  const targetCalories = calorieData?.targetCalories || 2000;
  const goalLabel = calorieData?.goal?.label || 'Сохранение веса';
  
  const today = new Date().toDateString();
  const todayEntries = foodEntries.filter(entry => entry.date === today);

  const consumedCalories = todayEntries.reduce((sum, e) => sum + (e.calories || 0), 0);
  const consumedProtein = todayEntries.reduce((sum, e) => sum + (e.protein || 0), 0);
  const consumedFat = todayEntries.reduce((sum, e) => sum + (e.fat || 0), 0);
  const consumedCarbs = todayEntries.reduce((sum, e) => sum + (e.carbs || 0), 0);

  const macros = calculateMacros(targetCalories);
  const streak = calculateStreak(foodEntries);

  const handleDateSelect = (date) => setSelectedDate(date);

  const calorieStreakData = useMemo(() => getStreakData(foodEntries, 'calories'), [foodEntries]);
  const best = useMemo(() => bestStreak(foodEntries), [foodEntries]);
  const monthlyActive = useMemo(() => monthlyActiveDays(foodEntries), [foodEntries]);

  const handleActivitySelect = (activity) => {
    const updatedProfile = { ...userProfile, activity };
    onProfileUpdate(updatedProfile);
    setActivityModalOpen(false);
  };

  const handleGoalSelect = (goal) => {
    const updatedProfile = { ...userProfile, goal };
    onProfileUpdate(updatedProfile);
    setGoalModalOpen(false);
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '20px 16px', backgroundColor: '#0b0b0f', color: '#fff' }}>
      {/* Верхний блок */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Привет, {userProfile?.name || 'пользователь'}!</h2>
          <p style={{ color: '#888', fontSize: 14, marginTop: 4 }}>{new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <StreakIcon />
          <span style={{ color: '#fff', fontWeight: 600 }}>{streak} дней</span>
        </div>
      </div>

      {/* Карточка серии стабильности */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        style={{
          background: '#141418',
          borderRadius: 24,
          padding: 20,
          marginBottom: 16,
          border: '1px solid #232329',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          {/* Левая часть: иконка и число на одной строке, подпись снизу */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <FaFire size={30} color="#ff922b" />
              <div style={{ fontSize: 42, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{streak}</div>
            </div>
            <div style={{ fontSize: 15, color: '#888' }}>Серия стабильности</div>
          </div>

          {/* Правая часть: прогресс дня и мини-неделя */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 14, color: '#888' }}>
              {Math.round(consumedCalories)} / {targetCalories} ккал
            </div>
            <ProgressBar value={consumedCalories} max={targetCalories} color="#ff922b" glow={true} />
            <MiniWeek foodEntries={foodEntries} />
          </div>
        </div>
      </motion.div>

      {/* Карточка калорий */}
      <CalorieCard
        value={consumedCalories}
        max={targetCalories}
        streakData={calorieStreakData}
        isExpanded={expandedCard === 'calories'}
        onToggle={() => setExpandedCard(expandedCard === 'calories' ? null : 'calories')}
      />

      {/* Группа макросов */}
      <MacroGroup
        protein={consumedProtein}
        fat={consumedFat}
        carbs={consumedCarbs}
        proteinMax={macros.protein.grams}
        fatMax={macros.fat.grams}
        carbsMax={macros.carbs.grams}
      />

      {/* Карточки активности и цели (интерактивные) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        {/* Активность */}
        <motion.div
          whileHover={{ scale: 1.02, background: '#1f1f27' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActivityModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: '#141418',
            border: '1px solid #232329',
            borderRadius: 20,
            padding: 16,
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: 24, color: '#3a8dff' }}>
            {userProfile?.activity === 'sedentary' && <FaWalking />}
            {userProfile?.activity === 'light' && <FaWalking />}
            {userProfile?.activity === 'moderate' && <FaRunning />}
            {userProfile?.activity === 'high' && <FaDumbbell />}
            {userProfile?.activity === 'very_active' && <FaHeartbeat />}
            {!userProfile?.activity && <FaWalking />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: '#888' }}>Активность</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>
              {calorieData?.activity?.label || 'Не указана'}
            </div>
            <div style={{ fontSize: 11, color: '#888' }}>
              Коэф. {calorieData?.activity?.value || '—'}
            </div>
          </div>
          <FaChevronRight style={{ color: '#888', fontSize: 14 }} />
        </motion.div>

        {/* Цель */}
        <motion.div
          whileHover={{ scale: 1.02, background: '#1f1f27' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setGoalModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: '#141418',
            border: '1px solid #232329',
            borderRadius: 20,
            padding: 16,
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: 24, color: '#51cf66' }}>🎯</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: '#888' }}>Цель</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{goalLabel}</div>
            <div style={{ fontSize: 11, color: '#888' }}>
              {calorieData?.goal?.modifier > 0 ? `+${calorieData.goal.modifier} ккал` : calorieData?.goal?.modifier < 0 ? `${calorieData.goal.modifier} ккал` : '0 ккал'}
            </div>
          </div>
          <FaChevronRight style={{ color: '#888', fontSize: 14 }} />
        </motion.div>
      </div>

      {/* Модальные окна */}
      <ActivityModal
        isOpen={activityModalOpen}
        onClose={() => setActivityModalOpen(false)}
        currentActivity={userProfile?.activity}
        onSelect={handleActivitySelect}
      />
      <GoalModal
        isOpen={goalModalOpen}
        onClose={() => setGoalModalOpen(false)}
        currentGoal={userProfile?.goal}
        onSelect={handleGoalSelect}
      />

      {/* График потребления */}
      <NutritionChart foodEntries={foodEntries} targetCalories={targetCalories} />

      {/* Динамические рекомендации */}
      <div style={{ marginBottom: 24, background: '#141418', border: '1px solid #232329', borderRadius: 20, padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <FaApple color="#ff922b" />
          <span style={{ fontSize: 16, fontWeight: 600 }}>Совет дня</span>
          <FaClock size={12} color="#888" style={{ marginLeft: 'auto' }} />
        </div>
        <p style={{ fontSize: 14, color: '#ccc', lineHeight: 1.5 }}>
          {TIPS[tipIndex]}
        </p>
        <div style={{ marginTop: 8, fontSize: 11, color: '#888', textAlign: 'right' }}>
          Обновляется каждый час
        </div>
      </div>
    </div>
  );
}

export default CalorieResult;