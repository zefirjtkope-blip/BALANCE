import React, { useState, useEffect, useMemo } from "react";
import Onboarding from "./components/Onboarding";
import CalorieResult from "./components/CalorieResult";
import AddFoodPage from "./components/AddFoodPage";
import DaySummary from "./components/DaySummary";
import History from "./components/History";
import ProfilePage from "./components/ProfilePage"; // новый компонент профиля
import AnimatedScreen from "./components/AnimatedScreen";
import ParticleBackground from "./components/ParticleBackground";
import BottomNav from "./components/BottomNav";
import { calculateCalories } from "./utils/calorieCalculator";

function App() {
  const [currentScreen, setCurrentScreen] = useState("onboarding");
  const [userProfile, setUserProfile] = useState(null);
  const [calorieData, setCalorieData] = useState(null);
  const [foodEntries, setFoodEntries] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const particleSize = useMemo(() => ({ min: 1, max: 4 }), []);
  const particleSpeed = useMemo(() => ({ min: 15, max: 30 }), []);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.setHeaderColor(tg.themeParams.bg_color || "#ffffff");
      tg.setBackgroundColor(tg.themeParams.bg_color || "#ffffff");
      tg.MainButton.setParams({ text: "Продолжить", is_visible: false });
      tg.onEvent("mainButtonClicked", handleMainButtonClick);
      tg.onEvent("backButtonClicked", handleBackButtonClick);
    }
    loadUserData();
  }, []);

  useEffect(() => {
    updateMainButton();
  }, [currentScreen, userProfile]);

  const loadUserData = () => {
    try {
      const savedProfile = localStorage.getItem("userProfile");
      const savedEntries = localStorage.getItem("foodEntries");
      const savedSubscription = localStorage.getItem("isSubscribed");

      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setUserProfile(profile);
        setCalorieData(calculateCalories(profile));
        setCurrentScreen("results");
      }
      if (savedEntries) setFoodEntries(JSON.parse(savedEntries));
      if (savedSubscription) setIsSubscribed(JSON.parse(savedSubscription));
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    }
  };

  const saveUserData = (profile, entries) => {
    try {
      if (profile) localStorage.setItem("userProfile", JSON.stringify(profile));
      if (entries) localStorage.setItem("foodEntries", JSON.stringify(entries));
    } catch (error) {
      console.error("Ошибка сохранения данных:", error);
    }
  };

  const updateMainButton = () => {
    if (!window.Telegram?.WebApp) return;
    const tg = window.Telegram.WebApp;
    switch (currentScreen) {
      case "onboarding":
        tg.MainButton.hide();
        break;
      case "results":
        tg.MainButton.setParams({ text: "📷 Добавить еду", is_visible: true });
        break;
      default:
        tg.MainButton.hide();
    }
  };

  const handleMainButtonClick = () => {
    if (currentScreen === "results") setCurrentScreen("food");
  };

  const handleBackButtonClick = () => {
    if (["food", "summary", "history", "settings"].includes(currentScreen)) {
      setCurrentScreen("results");
    }
  };

  const handleOnboardingComplete = (profileData) => {
    if (!profileData.activity || !profileData.goal) {
      console.error('profileData не содержит activity или goal', profileData);
      return;
    }
    const calories = calculateCalories(profileData);
    setUserProfile(profileData);
    setCalorieData(calories);
    setCurrentScreen("results");
    saveUserData(profileData, foodEntries);
  };

  const handleFoodAdd = (newEntries) => {
    const entriesWithId = newEntries.map((entry) => ({
      ...entry,
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      date: new Date().toDateString(),
    }));
    const updatedEntries = [...foodEntries, ...entriesWithId];
    setFoodEntries(updatedEntries);
    saveUserData(userProfile, updatedEntries);
    setCurrentScreen("summary");
  };

  const handleFoodEdit = (id, updatedEntry) => {
    const updatedEntries = foodEntries.map((entry) =>
      entry.id === id ? { ...entry, ...updatedEntry } : entry
    );
    setFoodEntries(updatedEntries);
    saveUserData(userProfile, updatedEntries);
  };

  const handleFoodDelete = (id) => {
    const updatedEntries = foodEntries.filter((entry) => entry.id !== id);
    setFoodEntries(updatedEntries);
    saveUserData(userProfile, updatedEntries);
  };

  const handleReset = () => {
    setUserProfile(null);
    setCalorieData(null);
    setFoodEntries([]);
    setCurrentScreen("onboarding");
    localStorage.clear();
  };

  const handleSubscribe = () => {
    setIsSubscribed(true);
    localStorage.setItem("isSubscribed", JSON.stringify(true));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "onboarding": return <Onboarding onComplete={handleOnboardingComplete} />;
      case "results": return (
        <CalorieResult
          calorieData={calorieData}
          userProfile={userProfile}
          foodEntries={foodEntries}
          onReset={handleReset}
          onNavigate={setCurrentScreen}
          onProfileUpdate={(newProfile) => {
            setUserProfile(newProfile);
            setCalorieData(calculateCalories(newProfile));
            saveUserData(newProfile, foodEntries);
          }}
        />
      );
      case "food": return (
        <AddFoodPage
          userProfile={userProfile}
          calorieData={calorieData}
          foodEntries={foodEntries}
          onFoodAdd={handleFoodAdd}
        />
      );
      case "summary": return (
        <DaySummary
          foodEntries={foodEntries}
          calorieData={calorieData}
          userProfile={userProfile}
          onEdit={handleFoodEdit}
          onDelete={handleFoodDelete}
          onNavigate={setCurrentScreen}
        />
      );
      case "history": return (
        <History
          foodEntries={foodEntries}
          userProfile={userProfile}
          isSubscribed={isSubscribed}
          onNavigate={setCurrentScreen}
        />
      );
      case "settings": return (
        <ProfilePage
          userProfile={userProfile}
          calorieData={calorieData}
          foodEntries={foodEntries}
          isSubscribed={isSubscribed}
          onProfileUpdate={(newProfile) => {
            setUserProfile(newProfile);
            setCalorieData(calculateCalories(newProfile));
            saveUserData(newProfile, foodEntries);
          }}
          onReset={handleReset}
          onSubscribe={handleSubscribe}
          onNavigate={setCurrentScreen}
        />
      );
      default: return <Onboarding onComplete={handleOnboardingComplete} />;
    }
  };

  const shouldShowNavigation = currentScreen !== "onboarding" && userProfile;

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <ParticleBackground
        particleCount={30}
        opacity={0.4}
        size={particleSize}
        speed={particleSpeed}
      />
      <div style={{ flex: 1, overflow: "hidden", height: "100%", minHeight: 0 }}>
        <AnimatedScreen screenKey={currentScreen}>
          {renderScreen()}
        </AnimatedScreen>
      </div>
      {shouldShowNavigation && (
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={setCurrentScreen}
        />
      )}
    </div>
  );
}

export default App;