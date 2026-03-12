import React, { useState } from "react";
import { motion } from "framer-motion";

const Step2Body = ({ data = {}, updateData }) => {
  const [formData, setFormData] = useState({
    height: data.height || 170,
    weight: data.weight || 70,
  });

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: parseInt(value) };
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
        📏 Параметры тела
      </h2>
      <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>
        Укажите рост и вес для точного расчёта
      </p>

      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 12, color: "#888", marginBottom: 4, display: "block" }}>
          Рост: {formData.height} см
        </label>
        <input
          type="range"
          min="100"
          max="250"
          value={formData.height}
          onChange={(e) => handleChange("height", e.target.value)}
          style={{ width: "100%", accentColor: "#4dabf7" }}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 12, color: "#888", marginBottom: 4, display: "block" }}>
          Вес: {formData.weight} кг
        </label>
        <input
          type="range"
          min="30"
          max="200"
          value={formData.weight}
          onChange={(e) => handleChange("weight", e.target.value)}
          style={{ width: "100%", accentColor: "#4dabf7" }}
        />
      </div>

      <div style={{ background: "#1a1a1a", borderRadius: 12, padding: 16, marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#888" }}>Индекс массы тела (ИМТ)</span>
          <span style={{ color: "#4dabf7", fontWeight: 700 }}>
            {(formData.weight / ((formData.height / 100) ** 2)).toFixed(1)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default Step2Body;