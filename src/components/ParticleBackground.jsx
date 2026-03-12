import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

const DEFAULT_COLORS = ["#007aff", "#34c759", "#af52de", "#ff9500"];

const ParticleBackground = ({
  particleCount = 50,
  colors = DEFAULT_COLORS,
  opacity = 0.6,
  size = { min: 2, max: 6 },
  speed = { min: 20, max: 40 },
  className = "",
}) => {
  const [particles, setParticles] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * (size.max - size.min) + size.min,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 4,
        pulsePhase: Math.random() * Math.PI * 2,
        drift: {
          x: Math.random() * 100 - 50,
          y: Math.random() * 100 - 50,
        },
      }));
      setParticles(newParticles);
    }
  }, [dimensions, particleCount, colors, size]);

  const particleVariants = useMemo(() => ({
    floating: (particle) => ({
      x: [
        particle.x,
        particle.x + particle.drift.x,
        particle.x - particle.drift.x,
        particle.x,
      ],
      y: [
        particle.y,
        particle.y + particle.drift.y,
        particle.y - particle.drift.y,
        particle.y,
      ],
      rotate: [
        particle.rotation,
        particle.rotation + 360 * particle.rotationSpeed,
      ],
      scale: [1, 1.2, 0.8, 1],
      opacity: [opacity * 0.3, opacity, opacity * 0.5, opacity * 0.3],
      transition: {
        duration: Math.random() * (speed.max - speed.min) + speed.min,
        repeat: Infinity,
        ease: "easeInOut",
        delay: Math.random() * 5,
      },
    }),
  }), [opacity, speed.min, speed.max]);

  return (
    <div
      className={`particle-background ${className}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        zIndex: -1,
        overflow: "hidden",
      }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="particle"
          style={{
            position: "absolute",
            width: particle.size,
            height: particle.size,
            background: particle.color,
            borderRadius: "50%",
            filter: "blur(1px)",
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}40`,
          }}
          variants={particleVariants}
          animate="floating"
          custom={particle}
          initial={{ x: particle.x, y: particle.y, opacity: 0 }}
        />
      ))}
      {/* Остальные декоративные элементы без изменений */}
    </div>
  );
};

export default ParticleBackground;