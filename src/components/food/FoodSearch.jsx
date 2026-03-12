import React, { useState, useEffect, useRef } from "react";
import { searchFood } from "../../data/foodDatabase";
import { getWeightSuggestions } from "../../utils/foodRecognition";
import { FaSearch, FaSpinner, FaTrash, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const FoodSearch = ({ onFoodAdd }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [weight, setWeight] = useState(100);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mealMode, setMealMode] = useState(false);
  const [mealItems, setMealItems] = useState([]);
  const [mealName, setMealName] = useState("");
  const [recentSearches] = useState(["Яблоко", "Куриная грудка", "Рис"]);
  const [savedMeals, setSavedMeals] = useState([]);
  const [showSavedMeals, setShowSavedMeals] = useState(false);

  const timerRef = useRef(null);

  // Загружаем сохранённые рецепты из localStorage
  useEffect(() => {
    const saved = localStorage.getItem("savedMeals");
    if (saved) {
      setSavedMeals(JSON.parse(saved));
    }
  }, []);

  // Сохраняем рецепты в localStorage при изменении
  useEffect(() => {
    localStorage.setItem("savedMeals", JSON.stringify(savedMeals));
  }, [savedMeals]);

  // Debounced поиск
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const results = await searchFood(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error("Ошибка поиска:", error);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timerRef.current);
  }, [searchQuery]);

  const handleFoodSelect = (food) => {
    setSelectedFood(food);
    setWeight(100);
  };

  const handleAddSingle = () => {
    if (!selectedFood || !weight) return;
    setIsAdding(true);
    const multiplier = weight / 100;
    const newEntry = {
      type: "product",
      name: selectedFood.name,
      calories: Math.round(selectedFood.calories * multiplier),
      protein: Math.round((selectedFood.proteins || 0) * multiplier),
      fat: Math.round((selectedFood.fats || 0) * multiplier),
      carbs: Math.round((selectedFood.carbs || 0) * multiplier),
      weight,
      emoji: selectedFood.emoji || '🍽️',
    };
    onFoodAdd([newEntry]);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedFood(null);
    setWeight(100);
    setIsAdding(false);
  };

  const handleAddToMeal = () => {
    if (!selectedFood || !weight) return;
    const multiplier = weight / 100;
    const newItem = {
      id: Date.now() + Math.random(),
      name: selectedFood.name,
      calories: Math.round(selectedFood.calories * multiplier),
      protein: Math.round((selectedFood.proteins || 0) * multiplier),
      fat: Math.round((selectedFood.fats || 0) * multiplier),
      carbs: Math.round((selectedFood.carbs || 0) * multiplier),
      weight,
      emoji: selectedFood.emoji || '🍽️',
    };
    setMealItems([...mealItems, newItem]);
    setMealMode(true);
    setSelectedFood(null);
    setWeight(100);
  };

  const handleRemoveFromMeal = (id) => {
    setMealItems(mealItems.filter((item) => item.id !== id));
    if (mealItems.length === 0) {
      setMealMode(false);
    }
  };

  const handleSaveMeal = () => {
    if (mealItems.length === 0) return;

    // Сохраняем рецепт
    const newMeal = {
      id: Date.now() + Math.random(),
      name: mealName.trim() || `Блюдо от ${new Date().toLocaleDateString()}`,
      items: mealItems,
      createdAt: new Date().toISOString(),
    };
    setSavedMeals([...savedMeals, newMeal]);

    // Добавляем в дневник как единую запись-блюдо
    const totalCalories = mealItems.reduce((sum, i) => sum + i.calories, 0);
    const totalProtein = mealItems.reduce((sum, i) => sum + i.protein, 0);
    const totalFat = mealItems.reduce((sum, i) => sum + i.fat, 0);
    const totalCarbs = mealItems.reduce((sum, i) => sum + i.carbs, 0);

    const mealEntry = {
      type: "meal",
      name: newMeal.name,
      calories: totalCalories,
      protein: totalProtein,
      fat: totalFat,
      carbs: totalCarbs,
      emoji: "🍲",
      items: mealItems, // сохраняем состав для детализации
    };

    // Передаём в App как массив с одним элементом
    onFoodAdd([mealEntry]);

    setMealItems([]);
    setMealMode(false);
    setMealName("");
  };

  const handleCancelMeal = () => {
    setMealItems([]);
    setMealMode(false);
    setMealName("");
  };

  const handleSelectMeal = (meal) => {
    onFoodAdd([{
      type: "meal",
      name: meal.name,
      calories: meal.items.reduce((sum, i) => sum + i.calories, 0),
      protein: meal.items.reduce((sum, i) => sum + i.protein, 0),
      fat: meal.items.reduce((sum, i) => sum + i.fat, 0),
      carbs: meal.items.reduce((sum, i) => sum + i.carbs, 0),
      emoji: "🍲",
      items: meal.items,
    }]);
    setShowSavedMeals(false);
  };

  const handleDeleteMeal = (mealId) => {
    setSavedMeals(savedMeals.filter((m) => m.id !== mealId));
  };

  const weightSuggestions = selectedFood
    ? getWeightSuggestions(selectedFood.name.toLowerCase())
    : [];

  const mealTotals = mealItems.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      fat: acc.fat + item.fat,
      carbs: acc.carbs + item.carbs,
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div>
      {/* Поле поиска */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{ marginBottom: 20 }}
      >
        <div style={{ position: 'relative' }}>
          <FaSearch
            style={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#888',
              fontSize: 18,
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Найти продукт... (например, яблоко)"
            style={{
              width: '100%',
              padding: '18px 18px 18px 50px',
              borderRadius: 16,
              border: '2px solid transparent',
              background: '#1a1a1a',
              color: '#fff',
              fontSize: 16,
              outline: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              transition: 'all 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#4dabf7')}
            onBlur={(e) => (e.target.style.borderColor = 'transparent')}
          />
          {loading && (
            <FaSpinner
              style={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#888',
                animation: 'spin 1s linear infinite',
              }}
            />
          )}
        </div>
      </motion.div>

      {/* Индикатор режима блюда */}
      {mealMode && (
        <div
          style={{
            background: '#2a2a2a',
            borderRadius: 12,
            padding: '8px 12px',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ color: '#4dabf7', fontWeight: 600 }}>
            Режим блюда: {mealItems.length} продукт(ов)
          </span>
          <button
            onClick={handleCancelMeal}
            style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Кнопка показа сохранённых рецептов */}
      {!mealMode && (
        <button
          onClick={() => setShowSavedMeals(!showSavedMeals)}
          style={{
            width: '100%',
            padding: 12,
            borderRadius: 12,
            border: '1px solid #2a2a2a',
            background: '#1a1a1a',
            color: '#fff',
            fontSize: 14,
            cursor: 'pointer',
            marginBottom: 16,
            textAlign: 'left',
          }}
        >
          Мои рецепты {savedMeals.length > 0 ? `(${savedMeals.length})` : ''}
        </button>
      )}

      {/* Список сохранённых рецептов */}
      <AnimatePresence>
        {showSavedMeals && savedMeals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              background: '#1a1a1a',
              borderRadius: 16,
              padding: 16,
              marginBottom: 20,
              border: '1px solid #2a2a2a',
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: '#fff' }}>
              Сохранённые рецепты
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {savedMeals.map((meal) => (
                <div
                  key={meal.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 10,
                    background: '#0a0a0a',
                    borderRadius: 8,
                  }}
                >
                  <div
                    onClick={() => handleSelectMeal(meal)}
                    style={{ flex: 1, cursor: 'pointer' }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{meal.name}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>
                      {meal.items.length} продукта(ов) • {meal.items.reduce((sum, i) => sum + i.calories, 0)} ккал
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteMeal(meal.id)}
                    style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Подсказки: популярные продукты */}
      {!searchQuery && !selectedFood && !mealMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ marginBottom: 20 }}
        >
          <p style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Популярные запросы:</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {recentSearches.map((item) => (
              <button
                key={item}
                onClick={() => setSearchQuery(item)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 20,
                  border: '1px solid #2a2a2a',
                  background: '#1a1a1a',
                  color: '#fff',
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Блок выбранного продукта */}
      <AnimatePresence>
        {selectedFood && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            style={{
              background: '#1a1a1a',
              borderRadius: 20,
              padding: 20,
              border: '1px solid #2a2a2a',
              marginBottom: 20,
              boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <span style={{ fontSize: 48 }}>{selectedFood.emoji}</span>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{selectedFood.name}</div>
                <div style={{ fontSize: 14, color: '#888' }}>{selectedFood.category}</div>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 14, color: '#888', display: 'block', marginBottom: 8 }}>Вес (г)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="1"
                step="1"
                style={{
                  width: '100%',
                  padding: 14,
                  borderRadius: 12,
                  border: '1px solid #2a2a2a',
                  background: '#0a0a0a',
                  color: '#fff',
                  fontSize: 16,
                  outline: 'none',
                }}
              />
            </div>

            {weightSuggestions.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Быстрый выбор:</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {weightSuggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setWeight(s.weight)}
                      style={{
                        padding: '10px 16px',
                        borderRadius: 20,
                        border: '1px solid #2a2a2a',
                        background: '#0a0a0a',
                        color: '#fff',
                        fontSize: 14,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => (e.target.style.background = '#2a2a2a')}
                      onMouseLeave={(e) => (e.target.style.background = '#0a0a0a')}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 16, color: '#888' }}>Итого:</span>
              <span style={{ fontSize: 24, fontWeight: 700, color: '#4dabf7' }}>
                {Math.round(selectedFood.calories * (weight / 100))} ккал
              </span>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddSingle}
                disabled={isAdding}
                style={{
                  flex: 1,
                  padding: 14,
                  borderRadius: 12,
                  border: 'none',
                  background: 'linear-gradient(135deg, #4dabf7, #1864ab)',
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: isAdding ? 0.7 : 1,
                }}
              >
                Добавить продукт
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToMeal}
                style={{
                  flex: 1,
                  padding: 14,
                  borderRadius: 12,
                  border: '1px solid #4dabf7',
                  background: 'transparent',
                  color: '#4dabf7',
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                В блюдо
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Результаты поиска с фиксированной высотой и прокруткой */}
      {searchResults.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0 }}
          style={{ marginBottom: 20 }}
        >
          <p style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Результаты:</p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              maxHeight: 300,
              overflowY: 'auto',
              paddingRight: 6,
            }}
          >
            {searchResults.map((food) => (
              <motion.div
                key={food.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(0,0,0,0.5)' }}
                onClick={() => handleFoodSelect(food)}
                style={{
                  padding: 16,
                  borderRadius: 16,
                  background: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ fontSize: 32 }}>{food.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{food.name}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{food.category}</div>
                </div>
                <div style={{ fontSize: 14, color: '#4dabf7' }}>{food.calories} ккал</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Состояние "ничего не найдено" */}
      {!loading && searchQuery.trim() !== "" && searchResults.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: 30, color: '#888' }}
        >
          <div style={{ fontSize: 48, marginBottom: 10 }}>😕</div>
          <p>Ничего не найдено. Попробуйте другое название.</p>
        </motion.div>
      )}

      {/* Список продуктов в блюде */}
      <AnimatePresence>
        {mealMode && mealItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              background: '#1a1a1a',
              borderRadius: 20,
              padding: 20,
              border: '1px solid #2a2a2a',
              marginBottom: 20,
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: '#fff' }}>
              Состав блюда
            </h3>

            <input
              type="text"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              placeholder="Название блюда (необязательно)"
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 12,
                border: '1px solid #2a2a2a',
                background: '#0a0a0a',
                color: '#fff',
                fontSize: 14,
                marginBottom: 16,
                outline: 'none',
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              {mealItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#0a0a0a',
                    borderRadius: 12,
                    padding: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 24 }}>{item.emoji}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>{item.weight} г</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 14, color: '#4dabf7' }}>{item.calories} ккал</span>
                    <button
                      onClick={() => handleRemoveFromMeal(item.id)}
                      style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: '#0a0a0a', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ color: '#888' }}>Всего калорий:</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#4dabf7' }}>{mealTotals.calories}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: '#888' }}>Белки: {Math.round(mealTotals.protein)}г</span>
                <span style={{ fontSize: 12, color: '#888' }}>Жиры: {Math.round(mealTotals.fat)}г</span>
                <span style={{ fontSize: 12, color: '#888' }}>Углеводы: {Math.round(mealTotals.carbs)}г</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveMeal}
              style={{
                width: '100%',
                padding: 14,
                borderRadius: 12,
                border: 'none',
                background: 'linear-gradient(135deg, #51cf66, #2b8e3c)',
                color: '#fff',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Сохранить блюдо
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin {
          from { transform: translateY(-50%) rotate(0deg); }
          to { transform: translateY(-50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default FoodSearch;