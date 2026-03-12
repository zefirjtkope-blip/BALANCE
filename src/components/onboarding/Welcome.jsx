import React from "react";
import { motion } from "framer-motion";

function Welcome({ onNext, data = {}, updateData, onPrev }) {
  const handleNext = () => {
    if (onNext) {
      onNext({});
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
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
      className="text-center fade-in"
      style={{ padding: "40px 0" }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        style={{ fontSize: "64px", marginBottom: "24px" }}
        variants={itemVariants}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🍎
      </motion.div>

      <motion.h1
        style={{ fontSize: "32px", fontWeight: "700", marginBottom: "16px" }}
        variants={itemVariants}
      >
        Cal AI
      </motion.h1>

      <motion.p
        style={{
          fontSize: "18px",
          color: "var(--secondary-text-color)",
          marginBottom: "40px",
          lineHeight: "1.5",
        }}
        variants={itemVariants}
      >
        Персональный помощник для подсчета калорий.
        <br />
        Узнайте свою дневную норму за 2 минуты!
      </motion.p>

      <motion.div
        className="card"
        style={{
          marginBottom: "32px",
          textAlign: "left",
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          padding: "24px",
        }}
        variants={itemVariants}
      >
        <h3
          style={{
            marginBottom: "16px",
            fontSize: "18px",
            color: "var(--text-color)",
          }}
        >
          Что мы сделаем:
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { icon: "📊", text: "Определим ваши параметры" },
            { icon: "🎯", text: "Выберем цель" },
            { icon: "🧮", text: "Рассчитаем калории" },
          ].map((item, index) => (
            <motion.div
              key={index}
              style={{ display: "flex", alignItems: "center", gap: "12px" }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <motion.span
                style={{ fontSize: "20px" }}
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3,
                  ease: "easeInOut",
                }}
              >
                {item.icon}
              </motion.span>
              <span style={{ color: "var(--text-color)" }}>{item.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.button
        className="btn btn-primary"
        onClick={handleNext}
        style={{
          fontSize: "18px",
          padding: "16px 32px",
          background: "linear-gradient(135deg, #007AFF, #00D4FF)",
          border: "none",
          borderRadius: "12px",
          color: "#ffffff",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(0, 122, 255, 0.3)",
        }}
        variants={itemVariants}
        whileHover={{
          transform: "translateY(-2px)",
          boxShadow: "0 6px 20px rgba(0, 122, 255, 0.4)",
        }}
        whileTap={{ scale: 0.98 }}
      >
        Начать ✨
      </motion.button>
    </motion.div>
  );
}

export default Welcome;