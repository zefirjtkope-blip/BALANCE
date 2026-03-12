import React from "react";
import { motion } from "framer-motion";
import { FaHome, FaSearch, FaUser, FaCalendarAlt } from "react-icons/fa";

const BottomNav = ({ currentScreen, onNavigate }) => {
  const navItems = [
    { id: "results", icon: <FaHome />, label: "Главная" },
    { id: "summary", icon: <FaCalendarAlt />, label: "Дневник" },
    { id: "food", icon: <FaSearch />, label: "Поиск" },
    { id: "settings", icon: <FaUser />, label: "Профиль" },
  ];

  const easeOutCubic = [0.33, 1, 0.68, 1];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        padding: "0 20px 16px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          width: "100%",
          maxWidth: "400px",
          padding: "8px 16px 12px",
          background: "rgba(20, 20, 20, 0.3)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "40px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
          pointerEvents: "auto",
          position: "relative",
        }}
      >
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                background: "none",
                border: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                cursor: "pointer",
                padding: "6px 0",
                borderRadius: "30px",
                transition: "all 0.2s",
                flex: 1,
                maxWidth: "64px",
                position: "relative",
              }}
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.12 : 1,
                  y: isActive ? -3 : 0,
                }}
                transition={{
                  duration: 0.28,
                  ease: easeOutCubic,
                }}
                style={{
                  fontSize: "22px",
                  color: isActive ? "#2ed9ff" : "rgba(255, 255, 255, 0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  filter: isActive ? "drop-shadow(0 0 16px #2ed9ff)" : "none",
                }}
              >
                {item.icon}
              </motion.div>
              <span
                style={{
                  fontSize: "10px",
                  color: isActive ? "#2ed9ff" : "rgba(255, 255, 255, 0.5)",
                  fontWeight: isActive ? "600" : "400",
                }}
              >
                {item.label}
              </span>

              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  transition={{
                    duration: 0.28,
                    ease: easeOutCubic,
                  }}
                  style={{
                    position: "absolute",
                    bottom: -8,
                    left: "25%",
                    width: "50%",
                    height: 3,
                    backgroundColor: "#2ed9ff",
                    borderRadius: 3,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;