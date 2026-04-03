/** Canvas로 운동 기록 공유 카드 이미지 생성 */
export function generateShareCard(data: {
  title: string;
  stats: { label: string; value: string }[];
  date: string;
}): Promise<Blob> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d')!;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 1920);
    grad.addColorStop(0, '#1e1b4b');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);

    // Decorative circles
    ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
    ctx.beginPath();
    ctx.arc(200, 400, 300, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(880, 1400, 250, 0, Math.PI * 2);
    ctx.fill();

    // Logo
    ctx.fillStyle = '#6366f1';
    ctx.font = 'bold 48px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FitLife', 540, 300);

    // Date
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '32px system-ui, -apple-system, sans-serif';
    ctx.fillText(data.date, 540, 370);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px system-ui, -apple-system, sans-serif';
    ctx.fillText(data.title, 540, 600);

    // Stats
    const startY = 780;
    data.stats.forEach((stat, i) => {
      const y = startY + i * 200;

      // Value
      ctx.fillStyle = '#6366f1';
      ctx.font = 'bold 96px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(stat.value, 540, y);

      // Label
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '36px system-ui, -apple-system, sans-serif';
      ctx.fillText(stat.label, 540, y + 50);
    });

    // Watermark
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '28px system-ui, -apple-system, sans-serif';
    ctx.fillText('Powered by FitLife', 540, 1800);

    canvas.toBlob((blob) => resolve(blob!), 'image/png');
  });
}

/** 공유 카드를 다운로드 또는 공유 */
export async function shareWorkoutCard(data: {
  title: string;
  stats: { label: string; value: string }[];
  date: string;
}) {
  const blob = await generateShareCard(data);
  const file = new File([blob], 'fitlife-workout.png', { type: 'image/png' });

  // Web Share API 지원 시 네이티브 공유
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: 'FitLife 운동 기록' });
    return;
  }

  // Fallback: 다운로드
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'fitlife-workout.png';
  a.click();
  URL.revokeObjectURL(url);
}
