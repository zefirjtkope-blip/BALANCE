import React, { useState } from "react";
import { motion } from "framer-motion";

const BodyMetricsStep = ({ data = {}, updateData }) => {
  const [formData, setFormData] = useState({
    height: data.height || 170,
    weight: data.weight || 70,
    ...data,
  });

  const handleInputChange = (field, value) => {
    const numValue = parseFloat(value);
    const newData = { ...formData, [field]: numValue };
    setFormData(newData);
    updateData(newData);
  };

  const calculateBMI = () => {
    if (formData.height && formData.weight) {
      const heightInMeters = formData.height / 100;
      const bmi = formData.weight / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return null;
    const bmiValue = parseFloat(bmi);

    if (bmiValue < 18.5)
      return { text: "Недостаток веса", color: "#74B9FF", emoji: "📉" };
    if (bmiValue < 25)
      return { text: "Нормальный вес", color: "#00B894", emoji: "✅" };
    if (bmiValue < 30)
      return { text: "Избыточный вес", color: "#FDCB6E", emoji: "⚠️" };
    return { text: "Ожирение", color: "#E17055", emoji: "⚠️" };
  };

  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(bmi);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  };

  return (
    <motion.div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        maxWidth: "500px",
        margin: "0 auto",
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Заголовок */}
      <motion.div
        style={{ textAlign: "center", marginBottom: "16px" }}
        variants={itemVariants}
      >
        <h3
          style={{
            fontSize: "28px",
            margin: "0 0 8px",
            color: "var(--text-color)",
            fontWeight: "700",
          }}
        >
          Параметры тела 📏
        </h3>
        <p
          style={{
            fontSize: "16px",
            color: "var(--secondary-text-color)",
            margin: 0,
            lineHeight: "1.5",
          }}
        >
          Укажите ваш рост и вес для расчета индивидуальных рекомендаций
        </p>
      </motion.div>

      {/* Рост */}
      <motion.div variants={itemVariants}>
        <label
          style={{
            display: "block",
            marginBottom: "12px",
            fontSize: "18px",
            fontWeight: "600",
            color: "var(--text-color)",
            textAlign: "center",
          }}
        >
          Рост: {formData.height} см 📏
        </label>

        <div style={{ position: "relative" }}>
          <motion.input
            type="range"
            min="120"
            max="220"
            value={formData.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
            style={{
              width: "100%",
              height: "8px",
              borderRadius: "4px",
              background: `linear-gradient(90deg, 
                var(--primary-color) 0%, 
                var(--primary-color) ${
                  ((formData.height - 120) / (220 - 120)) * 100
                }%, 
                rgba(255, 255, 255, 0.2) ${
                  ((formData.height - 120) / (220 - 120)) * 100
                }%, 
                rgba(255, 255, 255, 0.2) 100%)`,
              outline: "none",
              appearance: "none",
              cursor: "pointer",
            }}
            whileHover={{ transform: "scaleY(1.2)" }}
          />

          <style>{`
            input[type="range"]::-webkit-slider-thumb {
              appearance: none;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: linear-gradient(135deg, #007AFF, #00D4FF);
              cursor: pointer;
              box-shadow: 0 4px 12px rgba(0, 122, 255, 0.4);
              transition: all 0.3s ease;
            }
            input[type="range"]::-webkit-slider-thumb:hover {
              transform: scale(1.2);
              box-shadow: 0 6px 16px rgba(0, 122, 255, 0.6);
            }
            input[type="range"]::-moz-range-thumb {
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: linear-gradient(135deg, #007AFF, #00D4FF);
              cursor: pointer;
              border: none;
              box-shadow: 0 4px 12px rgba(0, 122, 255, 0.4);
            }
          `}</style>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "8px",
              fontSize: "12px",
              color: "var(--secondary-text-color)",
            }}
          >
            <span>120 см</span>
            <span>170 см</span>
            <span>220 см</span>
          </div>
        </div>
      </motion.div>

      {/* Вес */}
      <motion.div variants={itemVariants}>
        <label
          style={{
            display: "block",
            marginBottom: "12px",
            fontSize: "18px",
            fontWeight: "600",
            color: "var(--text-color)",
            textAlign: "center",
          }}
        >
          Вес: {formData.weight} кг ⚖️
        </label>

        <div style={{ position: "relative" }}>
          <motion.input
            type="range"
            min="30"
            max="150"
            value={formData.weight}
            onChange={(e) => handleInputChange("weight", e.target.value)}
            style={{
              width: "100%",
              height: "8px",
              borderRadius: "4px",
              background: `linear-gradient(90deg, 
                var(--primary-color) 0%, 
                var(--primary-color) ${
                  ((formData.weight - 30) / (150 - 30)) * 100
                }%, 
                rgba(255, 255, 255, 0.2) ${
                  ((formData.weight - 30) / (150 - 30)) * 100
                }%, 
                rgba(255, 255, 255, 0.2) 100%)`,
              outline: "none",
              appearance: "none",
              cursor: "pointer",
            }}
            whileHover={{ transform: "scaleY(1.2)" }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "8px",
              fontSize: "12px",
              color: "var(--secondary-text-color)",
            }}
          >
            <span>30 кг</span>
            <span>90 кг</span>
            <span>150 кг</span>
          </div>
        </div>
      </motion.div>

      {/* BMI Калькулятор */}
      {bmi && (
        <motion.div
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: `2px solid ${bmiCategory.color}`,
            borderRadius: "20px",
            padding: "24px",
            textAlign: "center",
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            delay: 0.3,
          }}
        >
          <motion.div
            style={{ fontSize: "32px", marginBottom: "12px" }}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {bmiCategory.emoji}
          </motion.div>

          <h4
            style={{
              fontSize: "24px",
              margin: "0 0 8px",
              color: bmiCategory.color,
              fontWeight: "700",
            }}
          >
            ИМТ: {bmi}
          </h4>

          <p
            style={{
              fontSize: "16px",
              color: "var(--text-color)",
              margin: "0 0 8px",
              fontWeight: "600",
            }}
          >
            {bmiCategory.text}
          </p>

          <motion.div
            style={{
              fontSize: "14px",
              color: "var(--secondary-text-color)",
              lineHeight: "1.4",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            ИМТ (Индекс массы тела) поможет нам подобрать оптимальные
            рекомендации по питанию
          </motion.div>
        </motion.div>
      )}

      {/* Визуализация человечка */}
      <motion.div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "32px",
          padding: "24px",
          background: "rgba(255, 255, 255, 0.03)",
          borderRadius: "16px",
        }}
        variants={itemVariants}
      >
        {/* Иконка роста */}
        <motion.div
          style={{ textAlign: "center" }}
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            style={{
              fontSize: "48px",
              marginBottom: "8px",
            }}
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🧍
          </motion.div>
          <div
            style={{
              fontSize: "14px",
              color: "var(--secondary-text-color)",
            }}
          >
            {formData.height} см
          </div>
        </motion.div>

        {/* Иконка веса */}
        <motion.div
          style={{ textAlign: "center" }}
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            style={{
              fontSize: "48px",
              marginBottom: "8px",
            }}
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            ⚖️
          </motion.div>
          <div
            style={{
              fontSize: "14px",
              color: "var(--secondary-text-color)",
            }}
          >
            {formData.weight} кг
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default BodyMetricsStep;