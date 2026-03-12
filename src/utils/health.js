export const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

export const getBMICategory = (bmi) => {
  if (bmi < 18.5) return { label: 'Недостаточный вес', color: '#4dabf7' };
  if (bmi < 25) return { label: 'Нормальный вес', color: '#51cf66' };
  if (bmi < 30) return { label: 'Избыточный вес', color: '#ff922b' };
  return { label: 'Ожирение', color: '#ff6b6b' };
};

export const calculateBMR = (profile) => {
  const { gender, age, weight, height } = profile;
  if (gender === 'male') {
    return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
  }
  return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
};

export const calculateTDEE = (bmr, activityLevel) => {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    high: 1.725,
    very_active: 1.9,
  };
  return Math.round(bmr * (multipliers[activityLevel] || 1.2));
};