import { LuApple, LuDrumstick, LuMilk, LuWheat, LuCandy, LuPizza, LuPackage } from 'react-icons/lu';

export const getCategoryIcon = (cat) => {
  const map = {
    'Vegetables/Fruits': LuApple,
    'Meat/Fish': LuDrumstick,
    'Dairy': LuMilk,
    'Grains': LuWheat,
    'Sweets': LuCandy,
    'Fast food': LuPizza,
    'Other': LuPackage,
  };
  return map[cat];
};

export const getCategoryColor = (cat) => {
  const map = {
    'Vegetables/Fruits': '#2ed47a',
    'Meat/Fish': '#ff6b6b',
    'Dairy': '#3a8dff',
    'Grains': '#ffd43b',
    'Sweets': '#b197fc',
    'Fast food': '#ff922b',
    'Other': '#888',
  };
  return map[cat];
};