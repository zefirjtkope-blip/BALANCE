import React, { useState } from "react";
import { motion } from "framer-motion";

const Step1Personal = ({ data = {}, updateData }) => {
  const [formData, setFormData] = useState({
    name: data.name || "",
    gender: data.gender || null,
    age: data.age || 30,
  });

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    updateData(newData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ padding: 20 }}
    >
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: "#fff" }}>
        👤 Личные данные
      </h2>
      <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>
        Расскажите немного о себе
      </p>

      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 12, color: "#888", marginBottom: 4, display: "block" }}>
          Как вас зовут?
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Введите имя"
          style={{
            width: "100%",
            padding: "12px 0",
            background: "transparent",
            border: "none",
            borderBottom: "1px solid #2a2a2a",
            color: "#fff",
            fontSize: 16,
            outline: "none",
          }}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 12, color: "#888", marginBottom: 8, display: "block" }}>
          Пол
        </label>
        <div style={{ display: "flex", gap: 12 }}>
          {["male", "female"].map((g) => (
            <button
              key={g}
              onClick={() => handleChange("gender", g)}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 12,
                border: "1px solid",
                borderColor: formData.gender === g ? "#4dabf7" : "#2a2a2a",
                background: formData.gender === g ? "rgba(77,171,247,0.1)" : "transparent",
                color: formData.gender === g ? "#4dabf7" : "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {g === "male" ? "Мужской" : "Женский"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={{ fontSize: 12, color: "#888", marginBottom: 4, display: "block" }}>
          Возраст: {formData.age} лет
        </label>
        <input
          type="range"
          min="12"
          max="100"
          value={formData.age}
          onChange={(e) => handleChange("age", parseInt(e.target.value))}
          style={{
            width: "100%",
            marginTop: 8,
            accentColor: "#4dabf7",
          }}
        />
      </div>
    </motion.div>
  );
};

export default Step1Personal;