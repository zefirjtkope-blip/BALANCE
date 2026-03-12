import React, { useState, useMemo } from "react";
import FoodList from "./food/FoodList";
import ScrollablePage from "./ScrollablePage";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaFire, FaCrown } from 'react-icons/fa';

const History = ({ foodEntries, userProfile, isSubscribed, onNavigate }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  const periodOptions = [
    { value: "day", label: "День" },
    { value: "week", label: "Неделя" },
    { value: "month", label: "Месяц" },
  ];

  const getDateRange = (period) => {
    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case "day":
        return {
          start: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59),
        };
      case "week": {
        const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1; // Понедельник = 0
        startDate.setDate(now.getDate() - dayOfWeek);
        return {
          start: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
          end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59),
        };
      }
      case "month":
        return {
          start: new Date(now.getFullYear(), now.getMonth(), 1),
          end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
        };
      default:
        return { start: new Date(), end: new Date() };
    }
  };

  const filteredEntries = useMemo(() => {
    if (!foodEntries || foodEntries.length === 0) return [];
    const { start, end } = getDateRange(selectedPeriod);
    return foodEntries.filter((entry) => {
      if (!entry || !entry.date) return false;
      const entryDate = new Date(entry.date);
      return entryDate >= start && entryDate <= end;
    });
  }, [foodEntries, selectedPeriod]);

  const chartData = useMemo(() => {
    if (!filteredEntries || filteredEntries.length === 0) return [];
    const { start, end } = getDateRange(selectedPeriod);
    const days = [];
    let current = new Date(start);
    while (current <= end) {
      const dateStr = current.toDateString();
      const total = filteredEntries
        .filter(e => e.date === dateStr)
        .reduce((sum, e) => sum + (e.calories || 0), 0);
      days.push({
        date: current.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
        calories: total,
      });
      current.setDate(current.getDate() + 1);
    }
    return days;
  }, [filteredEntries, selectedPeriod]);

  const analytics = useMemo(() => {
    if (!filteredEntries || filteredEntries.length === 0) {
      return {
        totalCalories: 0,
        avgCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        daysWithData: 0,
        topFoods: [],
      };
    }

    const totalCalories = filteredEntries.reduce(
      (sum, entry) => sum + (entry.calories || 0),
      0
    );
    const totalProtein = filteredEntries.reduce(
      (sum, entry) => sum + (entry.protein || 0),
      0
    );
    const totalCarbs = filteredEntries.reduce(
      (sum, entry) => sum + (entry.carbs || 0),
      0
    );
    const totalFat = filteredEntries.reduce(
      (sum, entry) => sum + (entry.fat || 0),
      0
    );

    const uniqueDays = new Set(filteredEntries.map((entry) => entry.date)).size;
    const avgCalories = uniqueDays > 0 ? totalCalories / uniqueDays : 0;

    const foodCounts = {};
    filteredEntries.forEach((entry) => {
      const name = entry.name || "Неизвестно";
      foodCounts[name] = (foodCounts[name] || 0) + 1;
    });

    const topFoods = Object.entries(foodCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    return {
      totalCalories: Math.round(totalCalories),
      avgCalories: Math.round(avgCalories),
      totalProtein: Math.round(totalProtein),
      totalCarbs: Math.round(totalCarbs),
      totalFat: Math.round(totalFat),
      daysWithData: uniqueDays,
      topFoods,
    };
  }, [filteredEntries]);

  const groupedEntries = useMemo(() => {
    if (!filteredEntries || filteredEntries.length === 0) return [];
    const groups = {};
    filteredEntries.forEach((entry) => {
      const date = entry.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(entry);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => new Date(b) - new Date(a))
      .map(([date, entries]) => ({
        date,
        entries: entries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)), // сортируем внутри дня
        totalCalories: entries.reduce(
          (sum, entry) => sum + (entry.calories || 0),
          0
        ),
      }));
  }, [filteredEntries]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (dateString === today) return "Сегодня";
    if (dateString === yesterday) return "Вчера";

    return new Intl.DateTimeFormat("ru-RU", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(date);
  };

  if (!foodEntries) {
    return <ScrollablePage><div>Загрузка...</div></ScrollablePage>;
  }

  return (
    <ScrollablePage>
      <div style={{ backgroundColor: '#0a0a0a', minHeight: '100%', color: '#fff', padding: '20px 16px' }}>
        {/* Заголовок */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>История питания</h1>
          <div style={{ display: 'flex', gap: 8, background: '#1a1a1a', padding: 4, borderRadius: 12 }}>
            {periodOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedPeriod(option.value)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: selectedPeriod === option.value ? '#4dabf7' : 'transparent',
                  color: selectedPeriod === option.value ? '#fff' : '#888',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Уведомление о Premium */}
        {!isSubscribed && (
          <div style={{ background: '#1a1a1a', borderRadius: 16, padding: 16, marginBottom: 20, border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', gap: 12 }}>
            <FaCrown color="#ffd43b" size={24} />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: '#ffd43b' }}>Расширенная аналитика</h3>
              <p style={{ fontSize: 14, color: '#888', margin: '4px 0 0' }}>Графики, отчёты и топ продуктов — в Premium</p>
            </div>
            <button
              onClick={() => onNavigate('settings')}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: 'none',
                background: '#4dabf7',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Подробнее
            </button>
          </div>
        )}

        {/* График калорий */}
        {chartData.length > 0 && (
          <div style={{ background: '#1a1a1a', borderRadius: 20, padding: 20, marginBottom: 20, border: '1px solid #2a2a2a' }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaFire color="#ff922b" /> Потребление калорий
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="date" stroke="#888" tick={{ fill: '#888', fontSize: 12 }} />
                <YAxis stroke="#888" tick={{ fill: '#888', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8 }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="calories" stroke="#4dabf7" strokeWidth={2} dot={{ fill: '#4dabf7', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Карточки статистики */}
        <div style={{ background: '#1a1a1a', borderRadius: 20, padding: 20, marginBottom: 20, border: '1px solid #2a2a2a' }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Статистика за период</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            <div style={{ background: '#0a0a0a', borderRadius: 12, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Всего калорий</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#4dabf7' }}>{analytics.totalCalories}</div>
            </div>
            <div style={{ background: '#0a0a0a', borderRadius: 12, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Среднее в день</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#51cf66' }}>{analytics.avgCalories}</div>
            </div>
            <div style={{ background: '#0a0a0a', borderRadius: 12, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Белки</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#51cf66' }}>{analytics.totalProtein} г</div>
            </div>
            <div style={{ background: '#0a0a0a', borderRadius: 12, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Жиры</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#ff922b' }}>{analytics.totalFat} г</div>
            </div>
            <div style={{ background: '#0a0a0a', borderRadius: 12, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Углеводы</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#ffd43b' }}>{analytics.totalCarbs} г</div>
            </div>
            <div style={{ background: '#0a0a0a', borderRadius: 12, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Дней с данными</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#888' }}>{analytics.daysWithData}</div>
            </div>
          </div>
        </div>

        {/* Топ продуктов */}
        {analytics.topFoods.length > 0 && (
          <div style={{ background: '#1a1a1a', borderRadius: 20, padding: 20, marginBottom: 20, border: '1px solid #2a2a2a' }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Топ продуктов</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {analytics.topFoods.map((food, index) => (
                <div key={food.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12', background: '#0a0a0a', borderRadius: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#888' }}>#{index + 1}</span>
                    <span style={{ fontSize: 16, fontWeight: 500, color: '#fff' }}>{food.name}</span>
                  </div>
                  <span style={{ fontSize: 14, color: '#888' }}>{food.count} раз</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Записи по дням */}
        <div style={{ background: '#1a1a1a', borderRadius: 20, padding: 20, marginBottom: 20, border: '1px solid #2a2a2a' }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Детализация по дням</h3>
          {groupedEntries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: '#fff' }}>Нет данных за выбранный период</h3>
              <p style={{ fontSize: 14, color: '#888', marginTop: 8 }}>Начните добавлять еду, чтобы увидеть историю</p>
              <button
                onClick={() => onNavigate("food")}
                style={{
                  marginTop: 16,
                  padding: "12px 24px",
                  borderRadius: 12,
                  border: "none",
                  background: "#4dabf7",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Добавить еду
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {groupedEntries.map(({ date, entries, totalCalories }) => (
                <div key={date} style={{ background: '#0a0a0a', borderRadius: 12, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h4 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{formatDate(date)}</h4>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#4dabf7' }}>{Math.round(totalCalories)} ккал</span>
                  </div>
                  <FoodList entries={entries} showDate={false} showTime={true} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ScrollablePage>
  );
};

export default History;