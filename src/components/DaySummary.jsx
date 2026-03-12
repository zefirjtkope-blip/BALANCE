import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FaLeaf, FaDrumstickBite, FaSeedling, 
  FaCandyCane, FaHamburger, FaCheck,
  FaChevronRight, FaTimes, FaApple 
} from 'react-icons/fa';
import { GiMilkCarton } from 'react-icons/gi';
import { calculateMacros } from '../utils/calorieCalculator';
import ScrollablePage from './ScrollablePage';
import ProductCard from './food/ProductCard'; // используем ту же карточку, что и в AddFoodPage

// ========== Вспомогательная функция определения категории по имени продукта ==========
const guessCategory = (productName) => {
  if (!productName) return 'Other';
  const name = productName.toLowerCase();
  if (name.includes('яблоко') || name.includes('банан') || name.includes('апельсин') || name.includes('овощ')) 
    return 'Vegetables/Fruits';
  if (name.includes('курица') || name.includes('говядина') || name.includes('рыба') || name.includes('лосось')) 
    return 'Meat/Fish';
  if (name.includes('молоко') || name.includes('йогурт') || name.includes('творог') || name.includes('сыр')) 
    return 'Dairy';
  if (name.includes('гречка') || name.includes('рис') || name.includes('овсянка') || name.includes('хлеб')) 
    return 'Grains';
  if (name.includes('шоколад') || name.includes('конфета') || name.includes('печенье')) 
    return 'Sweets';
  if (name.includes('бургер') || name.includes('пицца') || name.includes('фастфуд')) 
    return 'Fast food';
  return 'Other';
};

// ========== Конфигурация категорий ==========
const CATEGORY_CONFIG = {
  'Vegetables/Fruits': { icon: FaLeaf, color: '#2ed47a', label: 'Овощи/Фрукты' },
  'Meat/Fish': { icon: FaDrumstickBite, color: '#ff6b6b', label: 'Мясо/Рыба' },
  'Dairy': { icon: GiMilkCarton, color: '#3a8dff', label: 'Молочные' },
  'Grains': { icon: FaSeedling, color: '#ffd43b', label: 'Злаки' },
  'Sweets': { icon: FaCandyCane, color: '#b197fc', label: 'Сладости' },
  'Fast food': { icon: FaHamburger, color: '#ff922b', label: 'Фастфуд' },
  'Other': { icon: FaApple, color: '#888', label: 'Прочее' },
};

// ========== Определение топ-3 категорий за день ==========
const getTopCategories = (entries, targetProtein, targetFat, targetCarbs) => {
  if (!entries || entries.length === 0) return { top: [], isPerfect: false };

  const entriesWithCat = entries.map(e => ({
    ...e,
    category: e.category || guessCategory(e.name)
  }));

  const categoryWeight = {};
  let totalWeight = 0;

  entriesWithCat.forEach(entry => {
    const cat = entry.category;
    if (cat && entry.weight) {
      categoryWeight[cat] = (categoryWeight[cat] || 0) + (entry.weight || 0);
      totalWeight += entry.weight || 0;
    }
  });

  if (totalWeight === 0) return { top: [], isPerfect: false };

  const categories = Object.entries(categoryWeight)
    .map(([cat, weight]) => ({
      category: cat,
      percent: (weight / totalWeight) * 100,
    }))
    .filter(c => c.percent >= 15)
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 3);

  const totalProtein = entriesWithCat.reduce((acc, e) => acc + (e.protein || 0), 0);
  const totalFat = entriesWithCat.reduce((acc, e) => acc + (e.fat || 0), 0);
  const totalCarbs = entriesWithCat.reduce((acc, e) => acc + (e.carbs || 0), 0);

  const isPerfect = 
    targetProtein > 0 && targetFat > 0 && targetCarbs > 0 &&
    totalProtein >= targetProtein * 0.9 &&
    totalFat <= targetFat * 1.1 &&
    totalCarbs >= targetCarbs * 0.8;

  return { top: categories, isPerfect };
};

// ========== Календарь с иконками ==========
const CalendarView = ({ foodEntries, targetProtein, targetFat, targetCarbs }) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = воскресенье

  const monthDays = useMemo(() => {
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const dateStr = date.toDateString();
      const dayEntries = foodEntries ? foodEntries.filter(e => e.date === dateStr) : [];
      const { top, isPerfect } = getTopCategories(dayEntries, targetProtein, targetFat, targetCarbs);
      days.push({ date, dateStr, entries: dayEntries, topCategories: top, isPerfect });
    }
    return days;
  }, [foodEntries, targetProtein, targetFat, targetCarbs, currentYear, currentMonth, daysInMonth]);

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 16 }}>Поведенческий календарь</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '4px',
        maxWidth: '100%',
        margin: '0 auto',
      }}>
        {weekDays.map(day => (
          <div key={day} style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
            {day}
          </div>
        ))}
        {Array.from({ length: firstDayIndex === 0 ? 6 : firstDayIndex - 1 }).map((_, i) => (
          <div key={`empty-${i}`} style={{ aspectRatio: '1/1', maxWidth: 52, width: '100%' }} />
        ))}
        {monthDays.map(day => (
          <motion.div
            key={day.dateStr}
            whileHover={{ scale: 1.02 }}
            style={{
              background: '#0f0f14',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14,
              padding: 2,
              aspectRatio: '1/1',
              maxWidth: 52,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: day.isPerfect ? '0 0 16px rgba(255,255,255,0.15)' : 'none',
            }}
          >
            <div style={{ fontSize: 12, color: '#fff', marginBottom: 2 }}>{day.date.getDate()}</div>
            <div style={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              {day.topCategories.map((cat, idx) => {
                const config = CATEGORY_CONFIG[cat.category] || CATEGORY_CONFIG['Other'];
                const Icon = config.icon;
                return (
                  <div key={idx} style={{ filter: `drop-shadow(0 0 3px ${config.color}80)` }}>
                    <Icon size={12} color={config.color} />
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Аналитика месяца (упрощённая) */}
      <div style={{ marginTop: 16, display: 'flex', gap: 16, justifyContent: 'space-between', fontSize: 13, color: '#aaa' }}>
        <div>
          <div style={{ color: '#fff', fontWeight: 600 }}>0</div>
          <div>Идеальных дней</div>
        </div>
        <div>
          <div style={{ color: '#fff', fontWeight: 600 }}>—</div>
          <div>Частая категория</div>
        </div>
        <div>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: 11, display: 'flex', gap: 4, flexWrap: 'wrap' }}>—</div>
          <div>Доминирования</div>
        </div>
      </div>
    </div>
  );
};

// ========== Прогресс-бары макросов ==========
const MacrosSummary = ({ protein, fat, carbs, targetProtein, targetFat, targetCarbs }) => {
  const proteinPercent = targetProtein > 0 ? Math.min((protein / targetProtein) * 100, 100) : 0;
  const fatPercent = targetFat > 0 ? Math.min((fat / targetFat) * 100, 100) : 0;
  const carbsPercent = targetCarbs > 0 ? Math.min((carbs / targetCarbs) * 100, 100) : 0;

  const getBarColor = (percent) => {
    if (percent >= 100) return '#ff6b6b';
    if (percent >= 80) return '#2ed47a';
    return '#888';
  };

  const getBarGlow = (percent) => {
    if (percent >= 100) return '0 0 16px #ff6b6b80';
    if (percent >= 80) return '0 0 16px #2ed47a80';
    return 'none';
  };

  return (
    <div style={{ background: '#141418', borderRadius: 20, padding: 16, border: '1px solid #232329', marginBottom: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
            <span style={{ color: '#888' }}>Белки</span>
            <span style={{ color: '#fff' }}>{Math.round(protein)} / {targetProtein} г</span>
          </div>
          <div style={{ position: 'relative', height: 6, background: '#2a2a2a', borderRadius: 3 }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${proteinPercent}%` }}
              transition={{ duration: 0.6 }}
              style={{
                height: '100%',
                background: getBarColor(proteinPercent),
                borderRadius: 3,
                boxShadow: getBarGlow(proteinPercent),
              }}
            />
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
            <span style={{ color: '#888' }}>Жиры</span>
            <span style={{ color: '#fff' }}>{Math.round(fat)} / {targetFat} г</span>
          </div>
          <div style={{ position: 'relative', height: 6, background: '#2a2a2a', borderRadius: 3 }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${fatPercent}%` }}
              transition={{ duration: 0.6 }}
              style={{
                height: '100%',
                background: getBarColor(fatPercent),
                borderRadius: 3,
                boxShadow: getBarGlow(fatPercent),
              }}
            />
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
            <span style={{ color: '#888' }}>Углеводы</span>
            <span style={{ color: '#fff' }}>{Math.round(carbs)} / {targetCarbs} г</span>
          </div>
          <div style={{ position: 'relative', height: 6, background: '#2a2a2a', borderRadius: 3 }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${carbsPercent}%` }}
              transition={{ duration: 0.6 }}
              style={{
                height: '100%',
                background: getBarColor(carbsPercent),
                borderRadius: 3,
                boxShadow: getBarGlow(carbsPercent),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== Статус дня ==========
const DayStatus = ({ protein, fat, carbs, targetProtein, targetFat, targetCalories, consumedCalories }) => {
  let statusText = '';
  let statusColor = '#aaa';

  if (targetProtein === 0 || targetFat === 0 || targetCalories === 0) {
    statusText = 'Данные для расчёта отсутствуют';
  } else if (protein < targetProtein * 0.8) {
    statusText = `Не хватает ${Math.round(targetProtein - protein)} г белка`;
  } else if (fat > targetFat * 1.1) {
    statusText = `Жиры превышены на ${Math.round(fat - targetFat)} г`;
  } else if (consumedCalories < targetCalories) {
    const remaining = targetCalories - consumedCalories;
    statusText = `Можно съесть ещё ${Math.round(remaining)} ккал`;
  } else {
    statusText = 'Отличный баланс!';
    statusColor = '#2ed47a';
  }

  return (
    <div style={{ background: '#141418', borderRadius: 20, padding: 16, border: '1px solid #232329', marginBottom: 24 }}>
      <div style={{ fontSize: 14, color: '#888', marginBottom: 4 }}>Статус дня</div>
      <div style={{ fontSize: 18, fontWeight: 600, color: statusColor }}>{statusText}</div>
    </div>
  );
};

// ========== Рекомендация "Что съесть дальше" ==========
const NextMealSuggestion = ({ protein, fat, carbs, targetProtein, targetFat, targetCarbs }) => {
  let suggestions = [];

  const proteinDiff = targetProtein - protein;
  const fatDiff = targetFat - fat;
  const carbsDiff = targetCarbs - carbs;

  if (proteinDiff > 0 && fatDiff <= 0) {
    suggestions = [
      { name: 'Куриная грудка', category: 'Meat/Fish' },
      { name: 'Творог', category: 'Dairy' },
      { name: 'Яйца', category: 'Meat/Fish' },
    ];
  } else if (fatDiff > 0 && proteinDiff <= 0) {
    suggestions = [
      { name: 'Авокадо', category: 'Vegetables/Fruits' },
      { name: 'Оливковое масло', category: 'Fats' },
      { name: 'Орехи', category: 'Other' },
    ];
  } else if (carbsDiff > 0) {
    suggestions = [
      { name: 'Гречка', category: 'Grains' },
      { name: 'Овсянка', category: 'Grains' },
      { name: 'Рис', category: 'Grains' },
    ];
  } else {
    suggestions = [
      { name: 'Яблоко', category: 'Vegetables/Fruits' },
      { name: 'Огурец', category: 'Vegetables/Fruits' },
      { name: 'Кефир', category: 'Dairy' },
    ];
  }

  return (
    <div style={{ background: '#141418', borderRadius: 20, padding: 16, border: '1px solid #232329', marginBottom: 24 }}>
      <div style={{ fontSize: 14, color: '#888', marginBottom: 12 }}>Что съесть дальше</div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {suggestions.map((item, idx) => {
          const config = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG['Other'];
          const Icon = config.icon;
          return (
            <div key={idx} style={{ flex: 1, minWidth: 70, textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 4, filter: `drop-shadow(0 0 8px ${config.color}80)` }}>
                <Icon size={28} color={config.color} />
              </div>
              <div style={{ fontSize: 12, color: '#fff' }}>{item.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ========== Баланс макросов ==========
const MacroBalance = ({ protein, fat, carbs }) => {
  const total = protein + fat + carbs;
  const proteinPercent = total ? Math.round((protein / total) * 100) : 0;
  const fatPercent = total ? Math.round((fat / total) * 100) : 0;
  const carbsPercent = total ? 100 - proteinPercent - fatPercent : 0;

  return (
    <div style={{ background: '#141418', borderRadius: 20, padding: 16, border: '1px solid #232329', marginBottom: 24 }}>
      <div style={{ fontSize: 14, color: '#888', marginBottom: 8 }}>Баланс дня</div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#8a5cff' }}>{proteinPercent}%</div>
          <div style={{ fontSize: 11, color: '#aaa' }}>Белки</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#2ed47a' }}>{fatPercent}%</div>
          <div style={{ fontSize: 11, color: '#aaa' }}>Жиры</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#2ed9ff' }}>{carbsPercent}%</div>
          <div style={{ fontSize: 11, color: '#aaa' }}>Углеводы</div>
        </div>
      </div>
    </div>
  );
};

// ========== Главный компонент DaySummary ==========
const DaySummary = ({
  foodEntries,
  calorieData,
  userProfile,
  onEdit,
  onDelete,
  onNavigate,
}) => {
  if (!calorieData || typeof calorieData.targetCalories !== 'number') {
    return (
      <ScrollablePage>
        <div style={{ textAlign: 'center', padding: 20, color: '#fff' }}>
          <h2>Дневник питания</h2>
          <p style={{ color: '#888' }}>Данные загружаются...</p>
        </div>
      </ScrollablePage>
    );
  }

  const today = new Date().toDateString();
  const todayEntries = Array.isArray(foodEntries) 
    ? foodEntries
        .filter((entry) => entry && entry.date === today)
        .map(entry => ({
          ...entry,
          category: entry.category || guessCategory(entry.name)
        }))
    : [];

  const totalCalories = todayEntries.reduce((acc, e) => acc + (e.calories || 0), 0);
  const totalProtein = todayEntries.reduce((acc, e) => acc + (e.protein || 0), 0);
  const totalFat = todayEntries.reduce((acc, e) => acc + (e.fat || 0), 0);
  const totalCarbs = todayEntries.reduce((acc, e) => acc + (e.carbs || 0), 0);

  const macros = calculateMacros(calorieData.targetCalories);
  const targetProtein = macros.protein.grams || 0;
  const targetFat = macros.fat.grams || 0;
  const targetCarbs = macros.carbs.grams || 0;

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("ru-RU", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(date);
  };

  return (
    <ScrollablePage>
      <div style={{ padding: '20px 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: '#fff' }}>
            Дневник питания
          </h1>
          <p style={{ fontSize: 14, color: '#888', marginTop: 4 }}>
            {formatDate(new Date())}
          </p>
        </div>

        <CalendarView 
          foodEntries={foodEntries} 
          targetProtein={targetProtein} 
          targetFat={targetFat} 
          targetCarbs={targetCarbs} 
        />

        <MacrosSummary 
          protein={totalProtein} 
          fat={totalFat} 
          carbs={totalCarbs} 
          targetProtein={targetProtein} 
          targetFat={targetFat} 
          targetCarbs={targetCarbs} 
        />

        <DayStatus 
          protein={totalProtein} 
          fat={totalFat} 
          carbs={totalCarbs} 
          targetProtein={targetProtein} 
          targetFat={targetFat} 
          targetCalories={calorieData.targetCalories} 
          consumedCalories={totalCalories} 
        />

        <NextMealSuggestion 
          protein={totalProtein} 
          fat={totalFat} 
          carbs={totalCarbs} 
          targetProtein={targetProtein} 
          targetFat={targetFat} 
          targetCarbs={targetCarbs} 
        />

        <MacroBalance protein={totalProtein} fat={totalFat} carbs={totalCarbs} />

        <button
          onClick={() => onNavigate("food")}
          style={{
            width: '100%',
            padding: 14,
            borderRadius: 12,
            border: 'none',
            background: 'linear-gradient(135deg, #3a8dff, #1864ab)',
            color: '#fff',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: 24,
          }}
        >
          Добавить еду
        </button>

        {todayEntries.length > 0 ? (
          <>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: '#fff' }}>
              Сегодня
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {todayEntries.map(entry => (
                <ProductCard
                  key={entry.id}
                  product={entry}
                  onSelect={() => {}} // пока без действий
                />
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: 40, background: '#1a1a1a', borderRadius: 16 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🍽️</div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: '#fff' }}>Нет записей на сегодня</h3>
            <p style={{ fontSize: 14, color: '#888', marginTop: 8 }}>
              Добавьте первый приём пищи
            </p>
          </div>
        )}
      </div>
    </ScrollablePage>
  );
};

export default DaySummary;