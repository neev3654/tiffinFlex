import meals from './meals';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const weeklyMenu = days.map((day, i) => ({
  day,
  date: `2026-04-${27 + i}`,
  lunch: meals[i % meals.length],
  dinner: meals[(i + 5) % meals.length],
  swapOptions: [
    meals[(i + 2) % meals.length],
    meals[(i + 4) % meals.length],
    meals[(i + 7) % meals.length],
  ],
  isCustomized: i === 1 || i === 4,
  isSkipped: i === 6,
}));

export default weeklyMenu;
