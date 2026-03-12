import React, { useState } from "react";
import { motion } from "framer-motion";

const GoalStep = ({ data = {}, updateData }) => {
  const [selectedGoal, setSelectedGoal] = useState(data.goal || null);
  const [targetWeight, setTargetWeight] = useState(data.targetWeight || "");
  const [timeframe, setTimeframe] = useState(data.timeframe || "");

  const handleGoalSelect = (goalId) => {
    setSelectedGoal(goalId);
    updateData({
      goal: goalId,
      targetWeight,
      timeframe,
    });
  };

  const handleTargetWeightChange = (e) => {
    const value = e.target.value;
    setTargetWeight(value);
    updateData({
      goal: selectedGoal,
      targetWeight: value,
      timeframe,
    });
  };

  const handleTimeframeSelect = (value) => {
    setTimeframe(value);
    updateData({
      goal: selectedGoal,
      targetWeight,
      timeframe: value,
    });
  };

  const goals = [
    {
      id: "lose_weight",
      title: "Похудеть",
      subtitle: "Снизить вес",
      description: "Создать дефицит калорий для безопасного снижения веса",
      emoji: "📉",
      color: "#74B9FF",
      tips: [
        "Сбалансированное питание",
        "Контроль порций",
        "Регулярные приемы пищи",
      ],
      calorieAdjustment: -500,
    },
    {
      id: "maintain_weight",
      title: "Поддержать вес",
      subtitle: "Сохранить форму",
      description: "Поддерживать текущий вес и улучшить качество питания",
      emoji: "⚖️",
      color: "#00B894",
      tips: [
        "Сбалансированный рацион",
        "Здоровые привычки",
        "Регулярность питания",
      ],
      calorieAdjustment: 0,
    },
    {
      id: "gain_weight",
      title: "Набрать вес",
      subtitle: "Увеличить массу",
      description:
        "Здоровый набор веса с правильным соотношением питательных веществ",
      emoji: "📈",
      color: "#FDCB6E",
      tips: ["Увеличить калорийность", "Частые приемы пищи", "Белковая пища"],
      calorieAdjustment: +500,
    },
    {
      id: "build_muscle",
      title: "Набрать мышечную массу",
      subtitle: "Построить мускулатуру",
      description: "Увеличить мышечную массу с акцентом на белковое питание",
      emoji: "💪",
      color: "#E17055",
      tips: [
        "Высокобелковое питание",
        "Частые приемы пищи",
        "Сложные углеводы",
      ],
      calorieAdjustment: +300,
    },
  ];

  const timeframes = [
    { value: "1-month", label: "1 месяц", description: "Быстрый результат" },
    { value: "3-months", label: "3 месяца", description: "Оптимальный период" },
    {
      value: "6-months",
      label: "6 месяцев",
      description: "Устойчивый результат",
    },
    { value: "1-year", label: "1 год", description: "Долгосрочная цель" },
  ];

  const selectedGoalData = goals.find((g) => g.id === selectedGoal);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
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
        maxWidth: "700px",
        margin: "0 auto",
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Заголовок */}
      <motion.div
        style={{ textAlign: "center", marginBottom: "16px" }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h3
          style={{
            fontSize: "28px",
            margin: "0 0 8px",
            color: "var(--text-color)",
            fontWeight: "700",
          }}
        >
          Ваша цель 🎯
        </h3>
        <p
          style={{
            fontSize: "16px",
            color: "var(--secondary-text-color)",
            margin: 0,
            lineHeight: "1.5",
          }}
        >
          Выберите основную цель, которую хотите достичь
        </p>
      </motion.div>

      {/* Карточки целей */}
      <motion.div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
        variants={containerVariants}
      >
        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            style={{
              background:
                selectedGoal === goal.id
                  ? `linear-gradient(135deg, ${goal.color}25, ${goal.color}10)`
                  : "rgba(255, 255, 255, 0.05)",
              border:
                selectedGoal === goal.id
                  ? `2px solid ${goal.color}`
                  : "2px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "24px",
              padding: "28px",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}
            variants={cardVariants}
            whileHover={{
              transform: "translateY(-6px)",
              boxShadow: `0 12px 40px ${goal.color}30`,
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleGoalSelect(goal.id)}
          >
            {/* Декоративный элемент */}
            <motion.div
              style={{
                position: "absolute",
                top: "-30px",
                right: "-30px",
                width: "80px",
                height: "80px",
                background: `radial-gradient(circle, ${goal.color}25 0%, transparent 70%)`,
                borderRadius: "50%",
                filter: "blur(30px)",
                pointerEvents: "none",
              }}
              animate={{
                scale: selectedGoal === goal.id ? [1, 1.3, 1] : 1,
                opacity: selectedGoal === goal.id ? [0.4, 0.7, 0.4] : 0.3,
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Иконка и заголовок */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
                position: "relative",
              }}
            >
              <motion.div
                style={{
                  fontSize: "40px",
                  marginRight: "20px",
                  padding: "12px",
                  background: `${goal.color}20`,
                  borderRadius: "16px",
                  border: `2px solid ${goal.color}30`,
                }}
                animate={{
                  scale: selectedGoal === goal.id ? [1, 1.05, 1] : 1,
                  rotate: selectedGoal === goal.id ? [0, 5, -5, 0] : 0,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {goal.emoji}
              </motion.div>

              <div>
                <h4
                  style={{
                    fontSize: "20px",
                    margin: "0 0 6px",
                    color:
                      selectedGoal === goal.id
                        ? goal.color
                        : "var(--text-color)",
                    fontWeight: "700",
                    transition: "color 0.3s ease",
                  }}
                >
                  {goal.title}
                </h4>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--secondary-text-color)",
                    margin: 0,
                    fontWeight: "500",
                  }}
                >
                  {goal.subtitle}
                </p>
              </div>
            </div>

            {/* Описание */}
            <p
              style={{
                fontSize: "15px",
                color: "var(--secondary-text-color)",
                lineHeight: "1.5",
                marginBottom: "20px",
              }}
            >
              {goal.description}
            </p>

            {/* Советы */}
            <div style={{ marginBottom: "20px" }}>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--secondary-text-color)",
                  marginBottom: "12px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Ключевые принципы:
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {goal.tips.map((tip, idx) => (
                  <div
                    key={idx}
                    style={{
                      fontSize: "13px",
                      color:
                        selectedGoal === goal.id
                          ? goal.color
                          : "var(--text-color)",
                      background:
                        selectedGoal === goal.id
                          ? `${goal.color}15`
                          : "rgba(255, 255, 255, 0.08)",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border:
                        selectedGoal === goal.id
                          ? `1px solid ${goal.color}30`
                          : "1px solid rgba(255, 255, 255, 0.1)",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ color: goal.color }}>•</span>
                    {tip}
                  </div>
                ))}
              </div>
            </div>

            {/* Калорийность */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "16px",
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  color: "var(--secondary-text-color)",
                }}
              >
                Калории: {goal.calorieAdjustment >= 0 ? "+" : ""}
                {goal.calorieAdjustment}
              </span>

              {selectedGoal === goal.id && (
                <motion.div
                  style={{
                    color: goal.color,
                    fontSize: "20px",
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                  }}
                >
                  ✓
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Дополнительные настройки */}
      {selectedGoal &&
        (selectedGoal === "lose_weight" || selectedGoal === "gain_weight") && (
          <motion.div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              padding: "28px",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
              delay: 0.3,
            }}
          >
            <h4
              style={{
                fontSize: "18px",
                margin: "0 0 20px",
                color: "var(--text-color)",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              Дополнительные настройки 🎛️
            </h4>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "24px",
              }}
            >
              {/* Целевой вес */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "var(--text-color)",
                  }}
                >
                  Целевой вес (кг)
                </label>
                <motion.input
                  type="number"
                  placeholder="Введите целевой вес"
                  value={targetWeight}
                  onChange={handleTargetWeightChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "2px solid var(--border-color)",
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "var(--text-color)",
                    fontSize: "14px",
                    outline: "none",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                  }}
                  whileFocus={{
                    borderColor:
                      selectedGoalData?.color || "var(--primary-color)",
                    boxShadow: `0 0 0 3px ${
                      selectedGoalData?.color || "var(--primary-color)"
                    }20`,
                  }}
                />
              </div>

              {/* Временные рамки */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "var(--text-color)",
                  }}
                >
                  Временные рамки
                </label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "8px",
                  }}
                >
                  {timeframes.map((tf) => (
                    <motion.button
                      key={tf.value}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border:
                          timeframe === tf.value
                            ? `2px solid ${
                                selectedGoalData?.color ||
                                "var(--primary-color)"
                              }`
                            : "2px solid rgba(255, 255, 255, 0.1)",
                        background:
                          timeframe === tf.value
                            ? `${
                                selectedGoalData?.color ||
                                "var(--primary-color)"
                              }20`
                            : "rgba(255, 255, 255, 0.05)",
                        color:
                          timeframe === tf.value
                            ? selectedGoalData?.color || "var(--primary-color)"
                            : "var(--text-color)",
                        fontSize: "13px",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        textAlign: "center",
                      }}
                      whileHover={{
                        transform: "translateY(-1px)",
                        boxShadow: `0 4px 12px ${
                          selectedGoalData?.color || "var(--primary-color)"
                        }20`,
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTimeframeSelect(tf.value)}
                    >
                      <div style={{ fontWeight: "600" }}>{tf.label}</div>
                      <div
                        style={{
                          fontSize: "11px",
                          opacity: 0.8,
                          marginTop: "2px",
                        }}
                      >
                        {tf.description}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

      {/* Мотивационная панель */}
      {selectedGoal && (
        <motion.div
          style={{
            background: `linear-gradient(135deg, ${selectedGoalData.color}20, ${selectedGoalData.color}10)`,
            border: `1px solid ${selectedGoalData.color}30`,
            borderRadius: "20px",
            padding: "24px",
            textAlign: "center",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            delay: 0.4,
          }}
        >
          <motion.div
            style={{ fontSize: "28px", marginBottom: "12px" }}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🚀
          </motion.div>
          <h4
            style={{
              fontSize: "18px",
              margin: "0 0 8px",
              color: selectedGoalData.color,
              fontWeight: "700",
            }}
          >
            Отличный выбор!
          </h4>
          <p
            style={{
              fontSize: "15px",
              color: "var(--text-color)",
              margin: "0 0 12px",
              fontWeight: "500",
            }}
          >
            Мы создадим персональный план питания для достижения вашей цели
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "var(--secondary-text-color)",
              margin: 0,
              lineHeight: "1.4",
            }}
          >
            Помните: устойчивые результаты достигаются постепенно и с правильным
            подходом к питанию! 💪
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GoalStep;