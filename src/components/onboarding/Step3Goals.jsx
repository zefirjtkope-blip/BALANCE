import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaWalking, FaRunning, FaDumbbell, FaMedal } from "react-icons/fa";

const Step3Goals = ({ data = {}, updateData }) => {
  const [formData, setFormData] = useState({
    activity: data.activity || "moderate",
    goal: data.goal || "maintain",
  });

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    updateData(newData);
  };

  const activities = [
    { value: "sedentary", label: "Малоподвижный", icon: <FaWalking />, color: "#888" },
    { value: "light", label: "Легкая активность", icon: <FaRunning />, color: "#4dabf7" },
    { value: "moderate", label: "Умеренная", icon: <FaDumbbell />, color: "#51cf66" },
    { value: "high", label: "Высокая", icon: <FaMedal />, color: "#ff922b" },
  ];

  const goals = [
    { value: "lose", label: "Похудение", emoji: "📉" },
    { value: "maintain", label: "Поддержание", emoji: "⚖️" },
    { value: "gain", label: "Набор массы", emoji: "📈" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ padding: 20 }}
    >
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: "#fff" }}>
        🎯 Активность и цель
      </h2>
      <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>
        Выберите ваш образ жизни и конечную цель
      </p>

      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 12, color: "#888", marginBottom: 8, display: "block" }}>
          Уровень активности
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {activities.map((a) => (
            <button
              key={a.value}
              onClick={() => handleChange("activity", a.value)}
              style={{
                padding: 12,
                borderRadius: 12,
                border: "1px solid",
                borderColor: formData.activity === a.value ? a.color : "#2a2a2a",
                background: formData.activity === a.value ? `${a.color}20` : "transparent",
                color: formData.activity === a.value ? a.color : "#fff",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 20 }}>{a.icon}</span>
              <span style={{ fontSize: 12 }}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 12, color: "#888", marginBottom: 8, display: "block" }}>
          Ваша цель
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          {goals.map((g) => (
            <button
              key={g.value}
              onClick={() => handleChange("goal", g.value)}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 12,
                border: "1px solid",
                borderColor: formData.goal === g.value ? "#4dabf7" : "#2a2a2a",
                background: formData.goal === g.value ? "rgba(77,171,247,0.1)" : "transparent",
                color: formData.goal === g.value ? "#4dabf7" : "#fff",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 20 }}>{g.emoji}</span>
              <span style={{ fontSize: 12 }}>{g.label}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Step3Goals;