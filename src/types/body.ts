// 체성분 기록
export interface BodyRecord {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number; // kg
  bodyFatPercent?: number; // %
  muscleMass?: number; // kg
  notes: string;
}

// 체성분 목표
export interface BodyGoal {
  targetWeight?: number;
  targetBodyFat?: number;
  targetMuscleMass?: number;
}
