'use client';

export default function Header({ title }: { title?: string }) {
  const today = new Date();
  const dateStr = today.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-lg border-b border-border">
      <div className="mx-auto max-w-lg flex items-center justify-between h-14 px-4">
        <div>
          <h1 className="text-lg font-bold">{title ?? 'FitLife'}</h1>
          <p className="text-xs text-muted">{dateStr}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-sm font-bold text-primary">F</span>
        </div>
      </div>
    </header>
  );
}
