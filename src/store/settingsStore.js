// src/store/settingsStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '../i18n';

export const useSettingsStore = create(
  persist(
    (set) => ({
      language: 'en',
      units: { weight: 'kg', height: 'cm', energy: 'kcal' },
      notifications: { mealReminder: true, proteinReminder: true, dailyReport: true },
      setLanguage: (lang) => {
        i18n.changeLanguage(lang);
        set({ language: lang });
      },
      setUnits: (units) => set({ units }),
      setNotifications: (notifications) => set({ notifications }),
    }),
    { name: 'settings-storage' }
  )
);