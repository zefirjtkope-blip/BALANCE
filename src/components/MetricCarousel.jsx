import React, { useRef, useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import SegmentedCircle from "./SegmentedCircle";

// Компонент плавно изменяющегося числа (остаётся для подписей, но число в круге теперь своё)
const AnimatedNumber = ({ value, duration = 250 }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValue = useRef(value);
  const animationRef = useRef();

  useEffect(() => {
    if (value === displayValue) return;
    const startTime = performance.now();
    const startValue = previousValue.current;
    const change = value - startValue;
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = startValue + change * progress;
      setDisplayValue(Math.round(current));
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    animationRef.current = requestAnimationFrame(animate);
    previousValue.current = value;
    return () => cancelAnimationFrame(animationRef.current);
  }, [value, duration]);

  return <>{displayValue}</>;
};

const MetricCarousel = ({ metrics, onMetricChange }) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);
  const itemWidth = 0.7; // viewportFraction 70%

  // Текущее смещение (x) контейнера
  const x = useMotionValue(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  // Функция для вычисления scale и opacity для элемента по его индексу
  const getElementTransform = (index) => {
    if (!containerWidth) return { scale: 1, opacity: 1 };
    const distance = Math.abs(x.get() / (containerWidth * itemWidth) - index);
    const scale = Math.max(0.7, 1 - distance * 0.15);
    const opacity = Math.max(0, 1 - distance * 0.5);
    return { scale, opacity };
  };

  // При изменении x обновляем активный индекс (центральный элемент)
  useEffect(() => {
    if (!containerWidth) return;
    const unsubscribe = x.onChange((latestX) => {
      const rawIndex = -latestX / (containerWidth * itemWidth);
      const roundedIndex = Math.round(rawIndex);
      if (roundedIndex >= 0 && roundedIndex < metrics.length) {
        setActiveIndex(roundedIndex);
        onMetricChange?.(roundedIndex);
      }
    });
    return unsubscribe;
  }, [x, containerWidth, metrics.length, onMetricChange]);

  // Snap после отпускания
  const handleDragEnd = (event, info) => {
    const targetX = -activeIndex * containerWidth * itemWidth;
    x.set(targetX, { duration: 0.3, ease: [0.33, 1, 0.68, 1] }); // easeOutCubic
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        overflow: "hidden",
        position: "relative",
        height: 240,
        marginBottom: 32,
        marginTop: 16,
      }}
    >
      <motion.div
        drag="x"
        dragConstraints={{
          left: -(metrics.length - 1) * containerWidth * itemWidth,
          right: 0,
        }}
        dragElastic={0.1}
        style={{ x, display: "flex", alignItems: "center", height: "100%", cursor: "grab" }}
        onDragEnd={handleDragEnd}
      >
        {metrics.map((metric, index) => {
          const { scale, opacity } = getElementTransform(index);
          return (
            <motion.div
              key={index}
              style={{
                width: containerWidth * itemWidth,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                scale,
                opacity,
              }}
            >
              <SegmentedCircle
                value={metric.value}
                max={metric.max}
                color={metric.color}
                size={160}
                glow={true}
              />
              <div
                style={{
                  marginTop: 12,
                  fontSize: 14,
                  color: "#fff",
                  opacity: 0.6,
                  fontWeight: 500,
                }}
              >
                {metric.label}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default MetricCarousel;