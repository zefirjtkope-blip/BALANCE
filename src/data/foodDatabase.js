// src/data/foodDatabase.js
import { supabase } from '../supabaseClient';

// Категории продуктов с эмодзи и цветами (для совместимости)
export const FOOD_CATEGORIES = {
  Fruit: { emoji: "🍎", color: "#FCE4EC" },
  Vegetables: { emoji: "🥬", color: "#E8F5E8" },
  Meat: { emoji: "🍗", color: "#FFF3E0" },
  Fish: { emoji: "🐟", color: "#E0F2F1" },
  Dairy: { emoji: "🥛", color: "#E3F2FD" },
  Grains: { emoji: "🌾", color: "#FFF8E1" },
  Nuts: { emoji: "🥜", color: "#F3E5F5" },
  Fats: { emoji: "🫒", color: "#FFF3E0" },
  Sweets: { emoji: "🍫", color: "#F5F5F5" },
};

// Прямой поиск в Supabase с преобразованием полей
export async function searchFood(query) {
  const searchTerm = query.trim();
  if (!searchTerm) return [];

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .order('name')
      .limit(20);

    if (error) {
      console.error('Ошибка поиска продуктов:', error);
      return [];
    }

    // Преобразуем имена полей: proteins -> protein, fats -> fat, carbs -> carbs
    const transformed = data.map(item => ({
      ...item,
      protein: item.proteins,
      fat: item.fats,
      carbs: item.carbs,
    }));

    // Сортировка по релевантности (начинающиеся с запроса — первыми)
    const sorted = transformed.sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(searchTerm.toLowerCase());
      const bStarts = b.name.toLowerCase().startsWith(searchTerm.toLowerCase());
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    });

    return sorted;
  } catch (err) {
    console.error('Ошибка поиска продуктов:', err);
    return [];
  }
}

// Функция для умных рекомендаций (если используется)
export async function getRecommendedProducts(
  deficit,
  targetProtein,
  targetFat,
  targetCarbs,
  consumedProtein,
  consumedFat,
  consumedCarbs,
  limit = 3
) {
  let query = supabase.from('products').select('*');

  if (deficit === 'protein') {
    query = query.gt('protein', 5).order('protein', { ascending: false });
    if (consumedFat > targetFat) {
      query = query.order('fat', { ascending: true });
    }
  } else if (deficit === 'carbs') {
    query = query.gt('carbs', 10).order('carbs', { ascending: false });
  } else if (deficit === 'fat') {
    query = query.gt('fat', 5).order('fat', { ascending: false });
  } else {
    return [];
  }

  const { data, error } = await query.limit(limit);
  if (error) {
    console.error('Ошибка получения рекомендаций:', error);
    return [];
  }

  // Преобразуем имена полей
  return data.map(item => ({
    ...item,
    protein: item.proteins,
    fat: item.fats,
    carbs: item.carbs,
  }));
}