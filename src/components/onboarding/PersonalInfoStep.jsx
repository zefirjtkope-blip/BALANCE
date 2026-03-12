import React, { useState } from "react";
import { motion } from "framer-motion";
import AnimatedDropdown from "../AnimatedDropdown";

const PersonalInfoStep = ({ data = {}, updateData }) => {
  const [formData, setFormData] = useState({
    name: data.name || "",
    gender: data.gender || null,
    age: data.age || null,
    ...data,
  });

  const handleInputChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    updateData(newData); // сразу передаём данные наверх
  };

  const genderOptions = [
    {
      value: "male",
      label: "Мужской",
      icon: "👨",
      description: "Мужчина",
    },
    {
      value: "female",
      label: "Женский",
      icon: "👩",
      description: "Женщина",
    },
  ];

  const ageRanges = [
    {
      group: "Молодость",
      items: [
        {
          value: "18-25",
          label: "18-25 лет",
          icon: "🌱",
          description: "Активный возраст",
        },
        {
          value: "26-35",
          label: "26-35 лет",
          icon: "💪",
          description: "Зрелость и энергия",
        },
      ],
    },
    {
      group: "Зрелость",
      items: [
        {
          value: "36-45",
          label: "36-45 лет",
          icon: "⭐",
          description: "Опытный возраст",
        },
        {
          value: "46-55",
          label: "46-55 лет",
          icon: "🌟",
          description: "Мудрость и стабильность",
        },
      ],
    },
    {
      group: "Мудрость",
      items: [
        {
          value: "56-65",
          label: "56-65 лет",
          icon: "🎖️",
          description: "Золотой возраст",
        },
        {
          value: "65+",
          label: "65+ лет",
          icon: "👑",
          description: "Почетный возраст",
        },
      ],
    },
  ];

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
        gap: "24px",
        maxWidth: "500px",
        margin: "0 auto",
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Приветствие */}
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
          Расскажите о себе 👋
        </h3>
        <p
          style={{
            fontSize: "16px",
            color: "var(--secondary-text-color)",
            margin: 0,
            lineHeight: "1.5",
          }}
        >
          Эта информация поможет нам персонализировать ваш опыт
        </p>
      </motion.div>

      {/* Поле имени */}
      <motion.div variants={itemVariants}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "16px",
            fontWeight: "600",
            color: "var(--text-color)",
          }}
        >
          Как вас зовут? 📝
        </label>
        <motion.input
          type="text"
          placeholder="Введите ваше имя"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          style={{
            width: "100%",
            padding: "16px 20px",
            borderRadius: "16px",
            border: "2px solid var(--border-color)",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            color: "var(--text-color)",
            fontSize: "16px",
            outline: "none",
            transition: "all 0.3s ease",
            boxSizing: "border-box",
          }}
          whileFocus={{
            borderColor: "var(--primary-color)",
            boxShadow: "0 0 0 3px rgba(0, 122, 255, 0.1)",
            transform: "translateY(-1px)",
          }}
        />
      </motion.div>

      {/* Выбор пола */}
      <motion.div variants={itemVariants}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "16px",
            fontWeight: "600",
            color: "var(--text-color)",
          }}
        >
          Выберите пол 👤
        </label>
        <AnimatedDropdown
          options={genderOptions}
          value={formData.gender}
          onChange={(value) => handleInputChange("gender", value)}
          placeholder="Выберите пол"
          icon="👤"
        />
      </motion.div>

      {/* Выбор возраста */}
      <motion.div variants={itemVariants}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "16px",
            fontWeight: "600",
            color: "var(--text-color)",
          }}
        >
          Укажите возрастную группу 🎂
        </label>
        <AnimatedDropdown
          options={ageRanges}
          value={formData.age}
          onChange={(value) => handleInputChange("age", value)}
          placeholder="Выберите возрастную группу"
          icon="🎂"
          searchable={false}
        />
      </motion.div>

      {/* Информационная карточка */}
      {formData.name && formData.gender && formData.age && (
        <motion.div
          style={{
            background: "rgba(0, 122, 255, 0.1)",
            border: "1px solid rgba(0, 122, 255, 0.2)",
            borderRadius: "16px",
            padding: "20px",
            textAlign: "center",
            marginTop: "16px",
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            delay: 0.2,
          }}
        >
          <motion.div
            style={{ fontSize: "24px", marginBottom: "8px" }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            👋
          </motion.div>
          <p
            style={{
              fontSize: "16px",
              color: "var(--text-color)",
              margin: "0 0 4px",
              fontWeight: "600",
            }}
          >
            Привет, {formData.name}!
          </p>
          <p
            style={{
              fontSize: "14px",
              color: "var(--secondary-text-color)",
              margin: 0,
            }}
          >
            Рады знакомству! Давайте продолжим настройку вашего профиля.
          </p>
        </motion.div>
      )}

      {/* Прогресс заполнения */}
      <motion.div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginTop: "16px",
        }}
        variants={itemVariants}
      >
        {[formData.name, formData.gender, formData.age].map((field, index) => (
          <motion.div
            key={index}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: field
                ? "var(--primary-color)"
                : "rgba(255, 255, 255, 0.2)",
              transition: "all 0.3s ease",
            }}
            animate={{
              scale: field ? [1, 1.2, 1] : 1,
              boxShadow: field ? "0 0 8px rgba(0, 122, 255, 0.5)" : "none",
            }}
            transition={{
              scale: { duration: 0.6, repeat: Infinity, ease: "easeInOut" },
              backgroundColor: { duration: 0.3 },
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default PersonalInfoStep;