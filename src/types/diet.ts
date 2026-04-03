// 식사 타입
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

// 음식 카테고리
export type FoodCategory =
  | 'rice'      // 밥/곡물
  | 'noodle'    // 면류
  | 'soup'      // 국/찌개
  | 'meat'      // 고기
  | 'fish'      // 생선/해산물
  | 'vegetable' // 채소/샐러드
  | 'egg'       // 달걀/유제품
  | 'fruit'     // 과일
  | 'bread'     // 빵/베이커리
  | 'drink'     // 음료
  | 'snack'     // 간식
  | 'supplement'; // 보충제

// 영양소 정보 (100g 기준)
export interface NutritionPer100g {
  calories: number;  // kcal
  protein: number;   // g
  carbs: number;     // g
  fat: number;       // g
}

// 음식 정의
export interface Food {
  id: string;
  name: string;
  nameEn: string;
  category: FoodCategory;
  defaultServingG: number; // 기본 1인분 (g)
  nutrition: NutritionPer100g;
}

// 식사 내 음식 항목
export interface MealEntry {
  foodId: string;
  amountG: number; // 실제 섭취량 (g)
}

// 식사 기록
export interface MealRecord {
  id: string;
  date: string;      // ISO date (YYYY-MM-DD)
  mealType: MealType;
  entries: MealEntry[];
  notes: string;
  createdAt: string;  // ISO datetime
}

// 식사 타입 한국어 맵
export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: '아침',
  lunch: '점심',
  dinner: '저녁',
  snack: '간식',
};

export const MEAL_TYPE_ICONS: Record<MealType, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍪',
};

// 음식 카테고리 한국어 맵
export const FOOD_CATEGORY_LABELS: Record<FoodCategory, string> = {
  rice: '밥/곡물',
  noodle: '면류',
  soup: '국/찌개',
  meat: '고기',
  fish: '해산물',
  vegetable: '채소',
  egg: '달걀/유제품',
  fruit: '과일',
  bread: '빵',
  drink: '음료',
  snack: '간식',
  supplement: '보충제',
};
