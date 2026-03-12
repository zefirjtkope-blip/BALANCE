// src/components/AddFoodSheet.jsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, useDragControls, useMotionValue, useTransform, animate } from 'framer-motion';
import { LuMinus, LuPlus, LuX, LuInfo } from 'react-icons/lu';
import { getCategoryIcon, getCategoryColor } from '../utils/categoryUtils';

const AnimatedNumber = ({ value, duration = 200 }) => {
  const [displayValue, setDisplayValue] = useState(value);
  useEffect(() => {
    const startTime = performance.now();
    const startValue = displayValue;
    const change = value - startValue;
    if (change === 0) return;
    let raf;
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + change * eased);
      setDisplayValue(current);
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{displayValue}</>;
};

const AddFoodSheet = React.memo(({
  isOpen,
  onClose,
  product,
  onAdd,
  onAddToMeal,
  foodEntries = [],
  calorieData = {},
}) => {
  const [weight, setWeight] = useState(100);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const dragControls = useDragControls();
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 100], [1, 0.5]);

  useEffect(() => {
    if (product) setWeight(100);
  }, [product]);

  const totals = useMemo(() => {
    if (!product) return { calories: 0, protein: 0, fat: 0, carbs: 0 };
    const multiplier = weight / 100;
    return {
      calories: Math.round(product.calories * multiplier),
      protein: Math.round((product.protein || 0) * multiplier),
      fat: Math.round((product.fat || 0) * multiplier),
      carbs: Math.round((product.carbs || 0) * multiplier),
    };
  }, [product, weight]);

  const impact = useMemo(() => {
    const today = new Date().toDateString();
    const consumed = foodEntries
      .filter(e => e.date === today)
      .reduce((acc, e) => ({
        calories: acc.calories + (e.calories || 0),
        protein: acc.protein + (e.protein || 0),
        fat: acc.fat + (e.fat || 0),
        carbs: acc.carbs + (e.carbs || 0),
      }), { calories: 0, protein: 0, fat: 0, carbs: 0 });

    const after = {
      calories: consumed.calories + totals.calories,
      protein: consumed.protein + totals.protein,
      fat: consumed.fat + totals.fat,
      carbs: consumed.carbs + totals.carbs,
    };

    const targetCalories = calorieData?.targetCalories || 2000;
    const targetProtein = calorieData?.protein || 150;
    const targetFat = calorieData?.fat || 70;
    const targetCarbs = calorieData?.carbs || 200;

    return {
      after,
      targetCalories,
      targetProtein,
      targetFat,
      targetCarbs,
      isOverCalories: after.calories > targetCalories,
      isOverProtein: after.protein > targetProtein,
      isOverFat: after.fat > targetFat,
      isOverCarbs: after.carbs > targetCarbs,
    };
  }, [foodEntries, calorieData, totals]);

  const handleAdd = useCallback((type) => {
    setIsAdding(true);
    const entry = { ...product, weight, ...totals };
    setTimeout(() => {
      if (type === 'product') {
        onAdd(entry);
      } else {
        onAddToMeal(entry);
      }
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsAdding(false);
        if (type === 'product') onClose();
      }, 600);
    }, 300);
  }, [product, weight, totals, onAdd, onAddToMeal, onClose]);

  const handleWeightChange = useCallback((newWeight) => {
    setWeight(Math.max(1, Math.min(2000, newWeight)));
  }, []);

  const handleDragEnd = (event, info) => {
    if (info.offset.y > 50) {
      onClose();
    } else {
      animate(y, 0, { type: 'spring', bounce: 0 });
    }
  };

  if (!product || !isOpen) return null;

  const Icon = getCategoryIcon(product.category) || (() => null);
  const color = getCategoryColor(product.category);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
      onClick={onClose}
    >
      <motion.div
        drag="y"
        dragControls={dragControls}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(20, 20, 26, 0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: '24px 20px',
          zIndex: 1001,
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 -8px 30px rgba(0,0,0,0.4)',
          touchAction: 'pan-y',
          y,
          opacity,
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ width: 40, height: 4, background: '#333', borderRadius: 2 }} />
        </div>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h3 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{product.name}</h3>
          <div style={{ fontSize: 16, color: '#aaa' }}>{product.calories} ккал / 100 г</div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 14, color: '#888', marginBottom: 8, display: 'block' }}>Вес</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            <button
              onClick={() => handleWeightChange(weight - 10)}
              style={{
                width: 48,
                height: 48,
                borderRadius: 30,
                border: '1px solid #2a2a2a',
                background: '#0a0a0a',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#1f1f27'}
              onMouseLeave={e => e.currentTarget.style.background = '#0a0a0a'}
            >
              <LuMinus size={24} />
            </button>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <input
                type="number"
                value={weight}
                onChange={(e) => handleWeightChange(parseInt(e.target.value) || 1)}
                style={{
                  fontSize: 40,
                  fontWeight: 600,
                  color: '#fff',
                  lineHeight: 1.2,
                  width: '100%',
                  textAlign: 'center',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                }}
              />
              <div style={{ fontSize: 14, color: '#888' }}>граммы</div>
            </div>
            <button
              onClick={() => handleWeightChange(weight + 10)}
              style={{
                width: 48,
                height: 48,
                borderRadius: 30,
                border: '1px solid #2a2a2a',
                background: '#0a0a0a',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#1f1f27'}
              onMouseLeave={e => e.currentTarget.style.background = '#0a0a0a'}
            >
              <LuPlus size={24} />
            </button>
          </div>
        </div>

        <div style={{
          background: '#1a1a1a',
          borderRadius: 20,
          padding: 20,
          marginBottom: 24,
          border: '1px solid #2a2a2a',
          boxShadow: '0 0 0 1px #3a8dff10, 0 0 30px #3a8dff20',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 14, color: '#888' }}>Итого:</span>
            <span style={{ fontSize: 36, fontWeight: 700, color: '#3a8dff', filter: 'drop-shadow(0 0 8px #3a8dff80)' }}>
              <AnimatedNumber value={totals.calories} />
            </span>
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: '#aaa' }}>Белки: <span style={{ color: '#8a5cff', fontWeight: 600 }}><AnimatedNumber value={totals.protein} /> г</span></div>
            <div style={{ fontSize: 13, color: '#aaa' }}>Жиры: <span style={{ color: '#2ed47a', fontWeight: 600 }}><AnimatedNumber value={totals.fat} /> г</span></div>
            <div style={{ fontSize: 13, color: '#aaa' }}>Углеводы: <span style={{ color: '#2ed9ff', fontWeight: 600 }}><AnimatedNumber value={totals.carbs} /> г</span></div>
          </div>

          <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: 16, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <div style={{ fontSize: 13, color: '#aaa' }}>После добавления:</div>
              <div
                style={{ position: 'relative', cursor: 'pointer' }}
                onMouseEnter={() => setShowInfo(true)}
                onMouseLeave={() => setShowInfo(false)}
              >
                <LuInfo size={14} color="#666" />
                {showInfo && (
                  <div style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginBottom: 8,
                    background: '#1f1f27',
                    border: '1px solid #2a2a2a',
                    borderRadius: 8,
                    padding: '6px 10px',
                    fontSize: 12,
                    color: '#ccc',
                    whiteSpace: 'nowrap',
                    zIndex: 10,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  }}>
                    Прогноз после добавления продукта
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: '#888' }}>Калории</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: impact.isOverCalories ? '#ff6b6b' : '#2ed47a' }}>
                  {impact.after.calories} / {impact.targetCalories}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#888' }}>Белки</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: impact.isOverProtein ? '#ff6b6b' : '#8a5cff' }}>
                  {impact.after.protein} / {impact.targetProtein} г
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#888' }}>Жиры</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: impact.isOverFat ? '#ff6b6b' : '#2ed47a' }}>
                  {impact.after.fat} / {impact.targetFat} г
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#888' }}>Углеводы</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: impact.isOverCarbs ? '#ff6b6b' : '#2ed9ff' }}>
                  {impact.after.carbs} / {impact.targetCarbs} г
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAdd('product')}
            disabled={isAdding}
            style={{
              flex: 2,
              padding: '16px 24px',
              borderRadius: 16,
              border: 'none',
              background: 'linear-gradient(135deg, #3a8dff, #1864ab)',
              color: '#fff',
              fontSize: 16,
              fontWeight: 600,
              cursor: isAdding ? 'default' : 'pointer',
              opacity: isAdding ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 4px 12px #3a8dff40',
            }}
          >
            {showSuccess ? '✓' : 'Добавить'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAdd('meal')}
            disabled={isAdding}
            style={{
              flex: 1,
              padding: '16px 24px',
              borderRadius: 16,
              border: '1px solid #3a8dff',
              background: 'transparent',
              color: '#3a8dff',
              fontSize: 16,
              fontWeight: 600,
              cursor: isAdding ? 'default' : 'pointer',
              opacity: isAdding ? 0.7 : 1,
            }}
          >
            В блюдо
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
});

export default AddFoodSheet;