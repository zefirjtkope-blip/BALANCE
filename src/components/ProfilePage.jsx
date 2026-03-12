// src/components/ProfilePage.jsx
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../store/settingsStore';
import ScrollablePage from './ScrollablePage';
import ProfileHero from './profile/ProfileHero';
import GoalProgressSection from './profile/GoalProgressSection';
import HealthMetrics from './profile/HealthMetrics';
import MetabolismSection from './profile/MetabolismSection';
import MonthlyStatsSection from './profile/MonthlyStatsSection';
import EditProfileModal from './profile/EditProfileModal';
import SettingsModal from './profile/settings/SettingsModal';
import { calculateBMI, getBMICategory, calculateBMR, calculateTDEE } from '../utils/health';

// Объединённый блок аналитики здоровья
const HealthOverviewSection = ({ bmi, bmiCategory, bmr, tdee, targetCalories }) => {
  return (
    <div
      style={{
        background: '#141418',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        border: '1px solid #232329',
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <HealthMetrics bmi={bmi} category={bmiCategory} />
      </div>
      <MetabolismSection bmr={bmr} tdee={tdee} targetCalories={targetCalories} />
    </div>
  );
};

const ProfilePage = ({
  userProfile,
  calorieData,
  foodEntries,
  onProfileUpdate,
  onReset,
  onSubscribe,
  onNavigate,
  isSubscribed,
}) => {
  const { t } = useTranslation();
  const { units } = useSettingsStore();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (!userProfile) {
    return (
      <ScrollablePage>
        <div style={{ padding: 20, color: '#fff' }}>Загрузка профиля...</div>
      </ScrollablePage>
    );
  }

  // Оптимизированные зависимости useMemo
  const bmi = useMemo(
    () => calculateBMI(userProfile.weight, userProfile.height),
    [userProfile.weight, userProfile.height]
  );
  const bmiCategory = useMemo(() => getBMICategory(bmi), [bmi]);
  const bmr = useMemo(
    () => calculateBMR(userProfile),
    [userProfile.gender, userProfile.age, userProfile.weight, userProfile.height]
  );
  const tdee = useMemo(
    () => calculateTDEE(bmr, userProfile.activity),
    [bmr, userProfile.activity]
  );

  // Исправленный расчёт прогресса по весу
  const targetWeight = userProfile.targetWeight || userProfile.weight;
  const startWeight = userProfile.startWeight || userProfile.weight; // если нет стартового веса, используем текущий
  const totalChange = Math.abs(startWeight - targetWeight);
  const currentChange = Math.abs(startWeight - userProfile.weight);
  const progress = totalChange === 0 ? 0 : (currentChange / totalChange) * 100;

  const stats = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const entries = foodEntries.filter((e) => new Date(e.date) >= thirtyDaysAgo);
    const totalCalories = entries.reduce((sum, e) => sum + (e.calories || 0), 0);
    const totalProtein = entries.reduce((sum, e) => sum + (e.protein || 0), 0);
    const avgCalories = entries.length ? totalCalories / entries.length : 0;
    const avgProtein = entries.length ? totalProtein / entries.length : 0;

    const perfectDays = 0; // пока заглушка
    const categoryCount = {};
    entries.forEach((e) => {
      if (e.category) categoryCount[e.category] = (categoryCount[e.category] || 0) + 1;
    });
    const mostFrequentCategory = Object.keys(categoryCount).reduce((a, b) =>
      categoryCount[a] > categoryCount[b] ? a : b
    , '');

    return { avgCalories, avgProtein, perfectDays, mostFrequentCategory };
  }, [foodEntries]);

  return (
    <ScrollablePage>
      <div style={{ padding: '20px 16px' }}>
        {/* Блок 1 – Основной статус (Hero + прогресс цели) */}
        <div
          style={{
            background: '#141418',
            borderRadius: 24,
            padding: 16,
            marginBottom: 16,
            border: '1px solid #232329',
          }}
        >
          <ProfileHero
            userProfile={userProfile}
            isSubscribed={isSubscribed}
            onEditProfile={() => setIsEditOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
          <GoalProgressSection
            currentWeight={userProfile.weight}
            targetWeight={targetWeight}
            progress={progress}
            units={units.weight}
          />
        </div>

        {/* Блок 2 – Аналитика здоровья */}
        <HealthOverviewSection
          bmi={bmi}
          bmiCategory={bmiCategory}
          bmr={bmr}
          tdee={tdee}
          targetCalories={calorieData?.targetCalories}
        />

        {/* Блок 3 – История и активность */}
        <MonthlyStatsSection stats={stats} />

        {/* Модальные окна (bottom sheet) */}
        <EditProfileModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          profile={userProfile}
          onSave={onProfileUpdate}
        />
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onReset={onReset}
          onSubscribe={onSubscribe}
          isSubscribed={isSubscribed}
        />
      </div>
    </ScrollablePage>
  );
};

export default ProfilePage;