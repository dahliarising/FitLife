'use client';

import { useState } from 'react';
import { foods } from '@/data/foods';
import { Food, FoodCategory, FOOD_CATEGORY_LABELS } from '@/types/diet';

interface FoodPickerProps {
  onSelect: (food: Food) => void;
  selectedIds: string[];
}

const CATEGORIES: (FoodCategory | 'all')[] = [
  'all', 'rice', 'meat', 'fish', 'egg', 'vegetable', 'soup',
  'noodle', 'fruit', 'bread', 'drink', 'snack', 'supplement',
];

export default function FoodPicker({ onSelect, selectedIds }: FoodPickerProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<FoodCategory | 'all'>('all');

  const filtered = foods.filter((f) => {
    if (selectedIds.includes(f.id)) return false;
    const matchesSearch =
      search === '' ||
      f.name.includes(search) ||
      f.nameEn.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || f.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-3">
      {/* 검색 */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="음식 검색..."
        className="w-full px-4 py-2.5 rounded-xl bg-surface-hover border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
      />

      {/* 카테고리 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              category === cat
                ? 'bg-primary text-white'
                : 'bg-surface-hover text-muted hover:text-foreground'
            }`}
          >
            {cat === 'all' ? '전체' : FOOD_CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* 음식 목록 */}
      <div className="space-y-1 max-h-[50vh] overflow-y-auto">
        {filtered.map((food) => (
          <button
            key={food.id}
            onClick={() => onSelect(food)}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-hover transition-colors text-left"
          >
            <div>
              <p className="text-sm font-medium">{food.name}</p>
              <p className="text-xs text-muted">
                {food.defaultServingG}g · {food.nutrition.calories}kcal/100g
              </p>
            </div>
            <div className="text-right text-xs text-muted">
              <p>P {food.nutrition.protein}g</p>
              <p>C {food.nutrition.carbs}g · F {food.nutrition.fat}g</p>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted py-8">
            검색 결과가 없습니다
          </p>
        )}
      </div>
    </div>
  );
}
