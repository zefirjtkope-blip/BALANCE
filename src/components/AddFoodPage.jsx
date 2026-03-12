import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LuSearch, LuLoader, LuPlus, LuMinus, LuX,
  LuApple, LuDrumstick, LuMilk, LuWheat, LuCandy, LuPizza, LuPackage,
  LuPencil, LuTrash2, LuChevronDown, LuChevronUp
} from 'react-icons/lu';
import { useDebounce } from '../hooks/useDebounce';
import { getCategoryIcon, getCategoryColor } from '../utils/categoryUtils';
import { calculateMacros } from '../utils/calorieCalculator';
import { searchFood } from '../data/foodDatabase';
import AddFoodSheet from './AddFoodSheet';
import ScrollablePage from './ScrollablePage';

// ========== Верхний блок с микро-статусом ==========
const HeaderStats = ({ consumed, target, proteinDiff }) => {
  const remaining = target - consumed;
  return (
    <div style={{ marginBottom: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, color: '#fff' }}>Добавить еду</h1>
      <p style={{ fontSize: 14, color: '#888', marginTop: 4 }}>Быстрое добавление продуктов</p>
      <div style={{ 
        display: 'flex', 
        gap: 24, 
        marginTop: 16, 
        background: '#141418', 
        borderRadius: 20, 
        padding: 16, 
        border: '1px solid #232329' 
      }}>
        <div>
          <div style={{ color: '#aaa' }}>Сегодня</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#fff' }}>{consumed} ккал</div>
        </div>
        <div>
          <div style={{ color: '#aaa' }}>Осталось</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: remaining > 0 ? '#2ed47a' : '#ff6b6b' }}>
            {Math.max(0, remaining)} ккал
          </div>
        </div>
        <div>
          <div style={{ color: '#aaa' }}>Белок</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: proteinDiff < 0 ? '#ff6b6b' : '#2ed47a' }}>
            {proteinDiff > 0 ? `+${proteinDiff} г` : `${proteinDiff} г`}
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== Умный поиск с дропдауном ==========
const SmartSearchInput = React.memo(({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }
    setLoading(true);
    searchFood(debouncedQuery)
      .then(data => {
        setResults(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [debouncedQuery]);

  return (
    <div style={{ marginBottom: 32, position: 'relative' }} className="search-container">
      <div style={{ position: 'relative' }}>
        <LuSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: 20 }} />
        <input
          type="text"
          placeholder="Поиск продуктов..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && results[0] && onSelect(results[0])}
          style={{
            width: '100%',
            padding: '18px 18px 18px 50px',
            borderRadius: 24,
            border: '1px solid rgba(255,255,255,0.1)',
            background: '#141418',
            color: '#fff',
            fontSize: 16,
            outline: 'none',
            boxShadow: query ? '0 0 0 2px #3a8dff40' : 'none',
            transition: 'box-shadow 0.2s',
          }}
        />
        {loading && <LuLoader style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: '#888', animation: 'spin 1s linear infinite' }} />}
      </div>
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: 16,
            marginTop: 8,
            maxHeight: 300,
            overflowY: 'auto',
            zIndex: 10,
            padding: 8,
          }}
        >
          {results.map(p => {
            const Icon = getCategoryIcon(p.category) || LuPackage;
            const color = getCategoryColor(p.category);
            return (
              <div
                key={p.id}
                onClick={() => { onSelect(p); setQuery(''); setResults([]); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 12,
                  borderRadius: 12,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#2a2a2a'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.05)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, color: '#fff' }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{p.calories} ккал / 100г</div>
                </div>
                <LuPlus size={18} color="#3a8dff" />
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
});

// ========== Компонент блюда (текущее собираемое блюдо) ==========
const MealBuilder = ({ mealItems, mealName, setMealName, onRemoveItem, onSaveMeal, onCancelMeal }) => {
  const [expanded, setExpanded] = useState(true);

  const totalCalories = mealItems.reduce((sum, i) => sum + (i.calories || 0), 0);
  const totalProtein = mealItems.reduce((sum, i) => sum + (i.protein || 0), 0);
  const totalFat = mealItems.reduce((sum, i) => sum + (i.fat || 0), 0);
  const totalCarbs = mealItems.reduce((sum, i) => sum + (i.carbs || 0), 0);

  if (mealItems.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      style={{
        background: '#141418',
        borderRadius: 20,
        padding: 16,
        border: '1px solid #232329',
        marginBottom: 24,
      }}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          marginBottom: expanded ? 16 : 0,
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>
          🍲 Собираемое блюдо ({mealItems.length})
        </h3>
        {expanded ? <LuChevronUp size={20} color="#888" /> : <LuChevronDown size={20} color="#888" />}
      </div>

      {expanded && (
        <>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {mealItems.map((item) => {
              const Icon = getCategoryIcon(item.category) || LuPackage;
              const color = getCategoryColor(item.category);
              return (
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
                    <Icon size={20} color={color} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>{item.weight} г</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 14, color: '#3a8dff' }}>{item.calories} ккал</span>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}
                    >
                      <LuTrash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ background: '#0a0a0a', borderRadius: 12, padding: 12, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: '#888' }}>Всего:</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>{totalCalories} ккал</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#888' }}>
              <span>Б: {Math.round(totalProtein)}г</span>
              <span>Ж: {Math.round(totalFat)}г</span>
              <span>У: {Math.round(totalCarbs)}г</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={onSaveMeal}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 12,
                border: 'none',
                background: 'linear-gradient(135deg, #2ed47a, #1864ab)',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Сохранить блюдо
            </button>
            <button
              onClick={onCancelMeal}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 12,
                border: '1px solid #2a2a2a',
                background: 'transparent',
                color: '#888',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Отмена
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

// ========== Компонент сохранённых рецептов ==========
const SavedMeals = ({ meals, onSelectMeal, onDeleteMeal }) => {
  if (!meals.length) return null;

  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 12 }}>📚 Мои рецепты</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {meals.map(meal => (
          <div
            key={meal.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 12,
              background: '#1a1a1a',
              borderRadius: 12,
              border: '1px solid #2a2a2a',
            }}
          >
            <div
              onClick={() => onSelectMeal(meal)}
              style={{ flex: 1, cursor: 'pointer' }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{meal.name}</div>
              <div style={{ fontSize: 12, color: '#888' }}>
                {meal.items.length} продукта(ов) • {meal.items.reduce((sum, i) => sum + i.calories, 0)} ккал
              </div>
            </div>
            <button
              onClick={() => onDeleteMeal(meal.id)}
              style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}
            >
              <LuTrash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ========== Рекомендации (пока заглушка, позже можно заменить на реальные) ==========
const Recommendations = React.memo(({ products, deficit, onSelect }) => {
  if (!products || products.length === 0) return null;

  const deficitText = deficit === 'protein' ? 'белок' : deficit === 'carbs' ? 'углеводы' : 'жиры';

  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 12 }}>
        ⚡ Рекомендуем добавить {deficitText}
      </h3>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
        {products.map(p => {
          const Icon = getCategoryIcon(p.category) || LuPackage;
          return (
            <div
              key={p.id}
              onClick={() => onSelect(p)}
              style={{
                background: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: 18,
                padding: 14,
                minWidth: 140,
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, background: 'rgba(58,141,255,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color="#3a8dff" />
                </div>
                <LuPlus size={20} color="#3a8dff" />
              </div>
              <div style={{ fontSize: 15, fontWeight: 500, color: '#fff' }}>{p.name}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                {p.calories} ккал • {deficit === 'protein' ? `${p.protein}г б` : deficit === 'carbs' ? `${p.carbs}г у` : `${p.fat}г ж`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

// ========== Недавние продукты ==========
const RecentProducts = React.memo(({ recent, onSelect }) => {
  if (!recent.length) return null;
  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 12 }}>Недавние</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {recent.map(p => (
          <ProductCard key={p.id} product={p} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
});

// ========== Популярные продукты ==========
const PopularProducts = React.memo(({ popular, onSelect }) => {
  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 12 }}>Популярное</h3>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
        {popular.map(p => {
          const Icon = getCategoryIcon(p.category) || LuPackage;
          const color = getCategoryColor(p.category);
          return (
            <div
              key={p.id}
              onClick={() => onSelect(p)}
              style={{
                background: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: 18,
                padding: 14,
                minWidth: 120,
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.05)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={color} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>{p.name}</div>
              </div>
              <div style={{ fontSize: 12, color: '#888' }}>{p.calories} ккал</div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

// ========== Горизонтальный скролл категорий ==========
const CategoryScroller = React.memo(({ categories, onSelectCategory }) => {
  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 12 }}>Категории</h3>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
        {categories.map(cat => {
          const Icon = getCategoryIcon(cat.key) || LuPackage;
          return (
            <div
              key={cat.key}
              onClick={() => onSelectCategory(cat.key)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 64, cursor: 'pointer' }}
            >
              <div style={{ width: 48, height: 48, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={24} color={cat.color} />
              </div>
              <span style={{ fontSize: 12, color: '#aaa' }}>{cat.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

// ========== Карточка продукта ==========
const ProductCard = React.memo(({ product, onSelect }) => {
  const Icon = getCategoryIcon(product.category) || LuPackage;
  const color = getCategoryColor(product.category);
  return (
    <div
      onClick={() => onSelect(product)}
      style={{
        background: '#1a1a1a',
        border: '1px solid #2a2a2a',
        borderRadius: 18,
        padding: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        cursor: 'pointer',
        transition: 'transform 0.2s',
      }}
    >
      <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.04)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={22} color={color} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 500, color: '#fff' }}>{product.name}</div>
        <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>{product.calories} ккал / 100г</div>
      </div>
      <LuPlus size={20} color="#3a8dff" />
    </div>
  );
});

// ========== Основная страница ==========
const AddFoodPage = ({ userProfile, calorieData, foodEntries, onFoodAdd }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [recent, setRecent] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [mealItems, setMealItems] = useState([]);
  const [mealName, setMealName] = useState('');
  const [savedMeals, setSavedMeals] = useState([]);
  const [showSavedMeals, setShowSavedMeals] = useState(false);

  // Загрузка недавних и рецептов
  useEffect(() => {
    const savedRecent = localStorage.getItem('recentProducts');
    if (savedRecent) setRecent(JSON.parse(savedRecent));
    const savedMealsData = localStorage.getItem('savedMeals');
    if (savedMealsData) setSavedMeals(JSON.parse(savedMealsData));
  }, []);

  // Сохранение рецептов при изменении
  useEffect(() => {
    localStorage.setItem('savedMeals', JSON.stringify(savedMeals));
  }, [savedMeals]);

  const addToRecent = useCallback((product) => {
    setRecent(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, 10);
      localStorage.setItem('recentProducts', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleSelectProduct = useCallback((product) => {
    setSelectedProduct(product);
    setSheetOpen(true);
  }, []);

  const handleAddProduct = useCallback((entry) => {
    onFoodAdd([entry]);
    addToRecent(entry);
    setSheetOpen(false);
    setSelectedProduct(null);
  }, [onFoodAdd, addToRecent]);

  const handleAddToMeal = useCallback((entry) => {
    setMealItems(prev => [...prev, { ...entry, id: Date.now() + Math.random() }]);
    setSheetOpen(false);
    setSelectedProduct(null);
  }, []);

  const handleRemoveFromMeal = useCallback((id) => {
    setMealItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleSaveMeal = useCallback(() => {
    if (mealItems.length === 0) return;

    const newMeal = {
      id: Date.now() + Math.random(),
      name: mealName.trim() || `Блюдо от ${new Date().toLocaleDateString()}`,
      items: mealItems,
      createdAt: new Date().toISOString(),
    };
    setSavedMeals(prev => [...prev, newMeal]);

    // Очищаем сборщик
    setMealItems([]);
    setMealName('');
  }, [mealItems, mealName]);

  const handleCancelMeal = useCallback(() => {
    setMealItems([]);
    setMealName('');
  }, []);

  const handleSelectMeal = useCallback((meal) => {
    // Добавляем все продукты блюда в дневник
    onFoodAdd(meal.items);
    setShowSavedMeals(false);
  }, [onFoodAdd]);

  const handleDeleteMeal = useCallback((mealId) => {
    setSavedMeals(prev => prev.filter(m => m.id !== mealId));
  }, []);

  // Расчёт макросов и дефицита
  const macros = useMemo(() => {
    if (!calorieData) return null;
    const target = calculateMacros(calorieData.targetCalories);
    const today = new Date().toDateString();
    const consumed = foodEntries.filter(e => e.date === today).reduce((acc, e) => ({
      protein: acc.protein + (e.protein || 0),
      fat: acc.fat + (e.fat || 0),
      carbs: acc.carbs + (e.carbs || 0),
    }), { protein: 0, fat: 0, carbs: 0 });
    return { target, consumed };
  }, [calorieData, foodEntries]);

  let deficit = null;
  if (macros) {
    if (macros.consumed.protein < macros.target.protein.grams * 0.7) deficit = 'protein';
    else if (macros.consumed.carbs < macros.target.carbs.grams * 0.7) deficit = 'carbs';
    else if (macros.consumed.fat < macros.target.fat.grams * 0.7) deficit = 'fat';
  }

  const proteinDiff = macros ? macros.consumed.protein - macros.target.protein.grams : 0;

  const popular = [
    { id: 1, name: 'Яблоко', calories: 52, category: 'Vegetables/Fruits' },
    { id: 2, name: 'Банан', calories: 96, category: 'Vegetables/Fruits' },
    { id: 3, name: 'Куриная грудка', calories: 165, category: 'Meat/Fish' },
    { id: 4, name: 'Гречка', calories: 110, category: 'Grains' },
    { id: 5, name: 'Творог', calories: 145, category: 'Dairy' },
  ];

  const categories = [
    { key: 'Vegetables/Fruits', color: '#2ed47a', label: 'Овощи/Фрукты' },
    { key: 'Meat/Fish', color: '#ff6b6b', label: 'Мясо/Рыба' },
    { key: 'Dairy', color: '#3a8dff', label: 'Молочные' },
    { key: 'Grains', color: '#ffd43b', label: 'Крупы' },
    { key: 'Sweets', color: '#b197fc', label: 'Сладкое' },
    { key: 'Fast food', color: '#ff922b', label: 'Фастфуд' },
  ];

  return (
    <ScrollablePage>
      <div style={{ padding: '20px 16px' }}>
        <HeaderStats
          consumed={foodEntries.filter(e => e.date === new Date().toDateString()).reduce((s, e) => s + (e.calories || 0), 0)}
          target={calorieData?.targetCalories || 2000}
          proteinDiff={Math.round(proteinDiff)}
        />

        <SmartSearchInput onSelect={handleSelectProduct} />

        {mealItems.length > 0 && (
          <MealBuilder
            mealItems={mealItems}
            mealName={mealName}
            setMealName={setMealName}
            onRemoveItem={handleRemoveFromMeal}
            onSaveMeal={handleSaveMeal}
            onCancelMeal={handleCancelMeal}
          />
        )}

        {!mealItems.length && (
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
            📚 Мои рецепты {savedMeals.length > 0 ? `(${savedMeals.length})` : ''}
          </button>
        )}

        {showSavedMeals && (
          <SavedMeals
            meals={savedMeals}
            onSelectMeal={handleSelectMeal}
            onDeleteMeal={handleDeleteMeal}
          />
        )}

        {deficit && (
          <Recommendations
            products={recommendedProducts}
            deficit={deficit}
            onSelect={handleSelectProduct}
          />
        )}

        <RecentProducts recent={recent} onSelect={handleSelectProduct} />

        <PopularProducts popular={popular} onSelect={handleSelectProduct} />

        <CategoryScroller categories={categories} onSelectCategory={(key) => console.log('Выбрана категория', key)} />

        <AddFoodSheet
          isOpen={sheetOpen}
          onClose={() => setSheetOpen(false)}
          product={selectedProduct}
          onAdd={handleAddProduct}
          onAddToMeal={handleAddToMeal}
          foodEntries={foodEntries}
          calorieData={calorieData}
        />
      </div>
    </ScrollablePage>
  );
};

export default AddFoodPage;