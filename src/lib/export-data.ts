/** 전체 FitLife 데이터를 JSON으로 내보내기 */
export function exportAllDataAsJson(): void {
  const keys = [
    'fitlife_workouts', 'fitlife_meals', 'fitlife_sleep',
    'fitlife_meditation', 'fitlife_routine', 'fitlife_body',
    'fitlife_running', 'fitlife_habits', 'fitlife_habit_logs',
    'fitlife_username', 'fitlife_goals',
  ];

  const data: Record<string, unknown> = { exportedAt: new Date().toISOString() };
  for (const key of keys) {
    const raw = localStorage.getItem(key);
    if (raw) {
      try { data[key] = JSON.parse(raw); } catch { data[key] = raw; }
    }
  }

  downloadFile(JSON.stringify(data, null, 2), `fitlife-export-${dateStr()}.json`, 'application/json');
}

/** 운동 데이터를 CSV로 내보내기 */
export function exportWorkoutsAsCsv(): void {
  const raw = localStorage.getItem('fitlife_workouts');
  if (!raw) return;

  const sessions = JSON.parse(raw) as Array<{
    date: string;
    exercises: Array<{
      exerciseId: string;
      sets: Array<{ weight: number; reps: number; completed: boolean }>;
    }>;
  }>;

  const rows = ['Date,Exercise,Set,Weight(kg),Reps,Completed'];
  for (const s of sessions) {
    for (const e of s.exercises) {
      e.sets.forEach((set, i) => {
        rows.push(`${s.date},${e.exerciseId},${i + 1},${set.weight},${set.reps},${set.completed}`);
      });
    }
  }

  downloadFile(rows.join('\n'), `fitlife-workouts-${dateStr()}.csv`, 'text/csv');
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function dateStr() {
  return new Date().toISOString().split('T')[0];
}
