import React, { useState, useEffect, useRef } from "react";

const SegmentedCircle = ({ value, max, color, size = 160, segments = 60, glow = true }) => {
  const [activeCount, setActiveCount] = useState(0);
  const prevCountRef = useRef(0);
  const animationRef = useRef();

  useEffect(() => {
    const targetCount = Math.floor((value / max) * segments);
    if (targetCount === prevCountRef.current) {
      setActiveCount(targetCount);
      return;
    }
    const startCount = prevCountRef.current;
    const startTime = performance.now();
    const duration = 700;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out кубический
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.round(startCount + (targetCount - startCount) * eased);
      setActiveCount(currentCount);
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setActiveCount(targetCount);
        prevCountRef.current = targetCount;
      }
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [value, max, segments]);

  const anglePerSegment = (2 * Math.PI) / segments;
  const radius = size / 2;
  const innerRadius = radius * 0.7;
  const outerRadius = radius;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {glow && (
          <defs>
            <filter id={`softGlow-${color.replace('#', '')}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="10" result="blur" />
              <feFlood floodColor={color} result="glowColor" />
              <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
              <feMerge>
                <feMergeNode in="softGlow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        )}
        {Array.from({ length: segments }).map((_, i) => {
          const startAngle = i * anglePerSegment - Math.PI / 2;
          const endAngle = (i + 1) * anglePerSegment - Math.PI / 2;
          const isActive = i < activeCount;

          const x1 = radius + outerRadius * Math.cos(startAngle);
          const y1 = radius + outerRadius * Math.sin(startAngle);
          const x2 = radius + outerRadius * Math.cos(endAngle);
          const y2 = radius + outerRadius * Math.sin(endAngle);
          const x3 = radius + innerRadius * Math.cos(endAngle);
          const y3 = radius + innerRadius * Math.sin(endAngle);
          const x4 = radius + innerRadius * Math.cos(startAngle);
          const y4 = radius + innerRadius * Math.sin(startAngle);

          const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
          const pathData = [
            `M ${x1} ${y1}`,
            `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            `L ${x3} ${y3}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
            "Z",
          ].join(" ");

          return (
            <path
              key={i}
              d={pathData}
              fill={color}
              opacity={isActive ? 1 : 0.2}
              filter={isActive && glow ? `url(#softGlow-${color.replace('#', '')})` : undefined}
            />
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: 28,
          fontWeight: 600,
          color: "#fff",
          textAlign: "center",
        }}
      >
        {Math.round(value)}
      </div>
    </div>
  );
};

export default SegmentedCircle;