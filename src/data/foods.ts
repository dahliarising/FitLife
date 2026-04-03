import { Food } from '@/types/diet';

export const foods: Food[] = [
  // === 밥/곡물 ===
  { id: 'white-rice', name: '흰쌀밥', nameEn: 'White Rice', category: 'rice', defaultServingG: 210, nutrition: { calories: 130, protein: 2.7, carbs: 28.7, fat: 0.3 } },
  { id: 'brown-rice', name: '현미밥', nameEn: 'Brown Rice', category: 'rice', defaultServingG: 210, nutrition: { calories: 123, protein: 2.7, carbs: 25.6, fat: 1.0 } },
  { id: 'mixed-grain', name: '잡곡밥', nameEn: 'Mixed Grain Rice', category: 'rice', defaultServingG: 210, nutrition: { calories: 128, protein: 3.0, carbs: 27.0, fat: 0.7 } },
  { id: 'oatmeal', name: '오트밀', nameEn: 'Oatmeal', category: 'rice', defaultServingG: 40, nutrition: { calories: 379, protein: 13.2, carbs: 67.7, fat: 6.5 } },
  { id: 'sweet-potato', name: '고구마', nameEn: 'Sweet Potato', category: 'rice', defaultServingG: 150, nutrition: { calories: 86, protein: 1.6, carbs: 20.1, fat: 0.1 } },

  // === 면류 ===
  { id: 'ramen', name: '라면', nameEn: 'Ramen', category: 'noodle', defaultServingG: 120, nutrition: { calories: 462, protein: 9.4, carbs: 63.0, fat: 18.0 } },
  { id: 'udon', name: '우동', nameEn: 'Udon', category: 'noodle', defaultServingG: 200, nutrition: { calories: 105, protein: 2.6, carbs: 21.6, fat: 0.4 } },
  { id: 'japchae', name: '잡채', nameEn: 'Japchae', category: 'noodle', defaultServingG: 200, nutrition: { calories: 130, protein: 3.5, carbs: 20.0, fat: 4.0 } },
  { id: 'cold-noodle', name: '냉면', nameEn: 'Cold Noodle', category: 'noodle', defaultServingG: 200, nutrition: { calories: 130, protein: 4.5, carbs: 27.0, fat: 0.5 } },

  // === 국/찌개 ===
  { id: 'kimchi-jjigae', name: '김치찌개', nameEn: 'Kimchi Stew', category: 'soup', defaultServingG: 300, nutrition: { calories: 55, protein: 4.0, carbs: 4.5, fat: 2.5 } },
  { id: 'doenjang-jjigae', name: '된장찌개', nameEn: 'Doenjang Stew', category: 'soup', defaultServingG: 300, nutrition: { calories: 45, protein: 3.5, carbs: 4.0, fat: 2.0 } },
  { id: 'seaweed-soup', name: '미역국', nameEn: 'Seaweed Soup', category: 'soup', defaultServingG: 300, nutrition: { calories: 20, protein: 2.0, carbs: 2.0, fat: 0.8 } },
  { id: 'galbitang', name: '갈비탕', nameEn: 'Short Rib Soup', category: 'soup', defaultServingG: 400, nutrition: { calories: 65, protein: 5.0, carbs: 2.0, fat: 4.0 } },
  { id: 'budae-jjigae', name: '부대찌개', nameEn: 'Army Stew', category: 'soup', defaultServingG: 350, nutrition: { calories: 80, protein: 5.5, carbs: 6.0, fat: 4.5 } },

  // === 고기 ===
  { id: 'chicken-breast', name: '닭가슴살', nameEn: 'Chicken Breast', category: 'meat', defaultServingG: 100, nutrition: { calories: 109, protein: 23.1, carbs: 0, fat: 1.2 } },
  { id: 'chicken-thigh', name: '닭다리살', nameEn: 'Chicken Thigh', category: 'meat', defaultServingG: 100, nutrition: { calories: 177, protein: 18.0, carbs: 0, fat: 11.0 } },
  { id: 'pork-belly', name: '삼겹살', nameEn: 'Pork Belly', category: 'meat', defaultServingG: 150, nutrition: { calories: 331, protein: 14.5, carbs: 0, fat: 30.0 } },
  { id: 'beef-sirloin', name: '소고기 등심', nameEn: 'Beef Sirloin', category: 'meat', defaultServingG: 100, nutrition: { calories: 182, protein: 21.0, carbs: 0, fat: 10.5 } },
  { id: 'bulgogi', name: '불고기', nameEn: 'Bulgogi', category: 'meat', defaultServingG: 150, nutrition: { calories: 160, protein: 17.0, carbs: 8.0, fat: 7.0 } },
  { id: 'dakgalbi', name: '닭갈비', nameEn: 'Spicy Chicken', category: 'meat', defaultServingG: 200, nutrition: { calories: 140, protein: 15.0, carbs: 10.0, fat: 5.0 } },
  { id: 'pork-cutlet', name: '돈까스', nameEn: 'Pork Cutlet', category: 'meat', defaultServingG: 200, nutrition: { calories: 220, protein: 14.0, carbs: 15.0, fat: 12.0 } },

  // === 생선/해산물 ===
  { id: 'salmon', name: '연어', nameEn: 'Salmon', category: 'fish', defaultServingG: 100, nutrition: { calories: 208, protein: 20.0, carbs: 0, fat: 13.0 } },
  { id: 'tuna-sashimi', name: '참치 (회)', nameEn: 'Tuna Sashimi', category: 'fish', defaultServingG: 100, nutrition: { calories: 132, protein: 28.0, carbs: 0, fat: 1.3 } },
  { id: 'shrimp', name: '새우', nameEn: 'Shrimp', category: 'fish', defaultServingG: 100, nutrition: { calories: 99, protein: 20.1, carbs: 0.2, fat: 1.7 } },
  { id: 'grilled-mackerel', name: '고등어구이', nameEn: 'Grilled Mackerel', category: 'fish', defaultServingG: 100, nutrition: { calories: 205, protein: 18.6, carbs: 0, fat: 14.0 } },

  // === 달걀/유제품 ===
  { id: 'boiled-egg', name: '삶은 달걀', nameEn: 'Boiled Egg', category: 'egg', defaultServingG: 50, nutrition: { calories: 155, protein: 13.0, carbs: 1.1, fat: 11.0 } },
  { id: 'fried-egg', name: '계란후라이', nameEn: 'Fried Egg', category: 'egg', defaultServingG: 60, nutrition: { calories: 196, protein: 13.6, carbs: 0.6, fat: 15.3 } },
  { id: 'greek-yogurt', name: '그릭요거트', nameEn: 'Greek Yogurt', category: 'egg', defaultServingG: 150, nutrition: { calories: 97, protein: 9.0, carbs: 3.6, fat: 5.0 } },
  { id: 'milk', name: '우유', nameEn: 'Milk', category: 'egg', defaultServingG: 200, nutrition: { calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3 } },
  { id: 'cheese-slice', name: '슬라이스 치즈', nameEn: 'Cheese Slice', category: 'egg', defaultServingG: 20, nutrition: { calories: 310, protein: 20.0, carbs: 2.0, fat: 25.0 } },

  // === 채소 ===
  { id: 'kimchi', name: '김치', nameEn: 'Kimchi', category: 'vegetable', defaultServingG: 50, nutrition: { calories: 15, protein: 1.1, carbs: 2.4, fat: 0.5 } },
  { id: 'salad-mixed', name: '샐러드 (믹스)', nameEn: 'Mixed Salad', category: 'vegetable', defaultServingG: 100, nutrition: { calories: 20, protein: 1.5, carbs: 3.5, fat: 0.2 } },
  { id: 'broccoli', name: '브로콜리', nameEn: 'Broccoli', category: 'vegetable', defaultServingG: 100, nutrition: { calories: 34, protein: 2.8, carbs: 7.0, fat: 0.4 } },
  { id: 'spinach', name: '시금치', nameEn: 'Spinach', category: 'vegetable', defaultServingG: 70, nutrition: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 } },
  { id: 'tofu', name: '두부', nameEn: 'Tofu', category: 'vegetable', defaultServingG: 100, nutrition: { calories: 76, protein: 8.1, carbs: 1.9, fat: 4.2 } },

  // === 과일 ===
  { id: 'banana', name: '바나나', nameEn: 'Banana', category: 'fruit', defaultServingG: 120, nutrition: { calories: 89, protein: 1.1, carbs: 23.0, fat: 0.3 } },
  { id: 'apple', name: '사과', nameEn: 'Apple', category: 'fruit', defaultServingG: 200, nutrition: { calories: 52, protein: 0.3, carbs: 14.0, fat: 0.2 } },
  { id: 'blueberry', name: '블루베리', nameEn: 'Blueberry', category: 'fruit', defaultServingG: 100, nutrition: { calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3 } },
  { id: 'strawberry', name: '딸기', nameEn: 'Strawberry', category: 'fruit', defaultServingG: 150, nutrition: { calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3 } },

  // === 빵 ===
  { id: 'white-bread', name: '식빵', nameEn: 'White Bread', category: 'bread', defaultServingG: 30, nutrition: { calories: 265, protein: 9.0, carbs: 49.0, fat: 3.2 } },
  { id: 'croissant', name: '크루아상', nameEn: 'Croissant', category: 'bread', defaultServingG: 60, nutrition: { calories: 406, protein: 8.2, carbs: 45.8, fat: 21.0 } },
  { id: 'bagel', name: '베이글', nameEn: 'Bagel', category: 'bread', defaultServingG: 100, nutrition: { calories: 257, protein: 10.0, carbs: 50.0, fat: 1.6 } },

  // === 음료 ===
  { id: 'americano', name: '아메리카노', nameEn: 'Americano', category: 'drink', defaultServingG: 355, nutrition: { calories: 2, protein: 0.3, carbs: 0, fat: 0 } },
  { id: 'latte', name: '카페라떼', nameEn: 'Cafe Latte', category: 'drink', defaultServingG: 355, nutrition: { calories: 37, protein: 2.5, carbs: 3.5, fat: 1.3 } },
  { id: 'orange-juice', name: '오렌지주스', nameEn: 'Orange Juice', category: 'drink', defaultServingG: 250, nutrition: { calories: 45, protein: 0.7, carbs: 10.4, fat: 0.2 } },

  // === 간식 ===
  { id: 'protein-bar', name: '프로틴바', nameEn: 'Protein Bar', category: 'snack', defaultServingG: 60, nutrition: { calories: 367, protein: 33.3, carbs: 33.3, fat: 10.0 } },
  { id: 'almonds', name: '아몬드', nameEn: 'Almonds', category: 'snack', defaultServingG: 30, nutrition: { calories: 579, protein: 21.2, carbs: 21.7, fat: 49.9 } },
  { id: 'dark-chocolate', name: '다크초콜릿', nameEn: 'Dark Chocolate', category: 'snack', defaultServingG: 30, nutrition: { calories: 546, protein: 5.5, carbs: 60.0, fat: 31.3 } },
  { id: 'rice-cake', name: '떡', nameEn: 'Rice Cake', category: 'snack', defaultServingG: 100, nutrition: { calories: 225, protein: 4.5, carbs: 50.0, fat: 0.5 } },

  // === 보충제 ===
  { id: 'whey-protein', name: '유청 프로틴', nameEn: 'Whey Protein', category: 'supplement', defaultServingG: 30, nutrition: { calories: 380, protein: 76.7, carbs: 10.0, fat: 3.3 } },
  { id: 'creatine', name: '크레아틴', nameEn: 'Creatine', category: 'supplement', defaultServingG: 5, nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 } },
  { id: 'bcaa', name: 'BCAA', nameEn: 'BCAA', category: 'supplement', defaultServingG: 10, nutrition: { calories: 0, protein: 10.0, carbs: 0, fat: 0 } },
];

export function getFoodById(id: string): Food | undefined {
  return foods.find((f) => f.id === id);
}

export function getFoodsByCategory(category: string): Food[] {
  return foods.filter((f) => f.category === category);
}

/** 실제 섭취량(g) 기반 영양소 계산 */
export function calculateNutrition(food: Food, amountG: number) {
  const ratio = amountG / 100;
  return {
    calories: Math.round(food.nutrition.calories * ratio),
    protein: Math.round(food.nutrition.protein * ratio * 10) / 10,
    carbs: Math.round(food.nutrition.carbs * ratio * 10) / 10,
    fat: Math.round(food.nutrition.fat * ratio * 10) / 10,
  };
}
