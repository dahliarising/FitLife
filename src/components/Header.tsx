'use client';

import Link from 'next/link';

export default function Header({ title }: { title?: string }) {
  const today = new Date();
  const dateStr = today.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="mx-auto max-w-lg flex items-center justify-between h-14 px-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight">{title ?? 'FitLife'}</h1>
          {!title && <p className="text-xs text-muted -mt-0.5">{dateStr}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Link href="/report" className="w-11 h-11 rounded-xl bg-surface-hover flex items-center justify-center hover:bg-primary/10 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4.5 h-4.5 text-muted">
              <path d="M15.5 2A1.5 1.5 0 0014 3.5v13a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0016.5 2h-1zM9.5 6A1.5 1.5 0 008 7.5v9A1.5 1.5 0 009.5 18h1a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0010.5 6h-1zM3.5 10A1.5 1.5 0 002 11.5v5A1.5 1.5 0 003.5 18h1A1.5 1.5 0 006 16.5v-5A1.5 1.5 0 004.5 10h-1z" />
            </svg>
          </Link>
          <Link href="/achievements" className="w-11 h-11 rounded-xl bg-surface-hover flex items-center justify-center hover:bg-primary/10 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4.5 h-4.5 text-muted">
              <path fillRule="evenodd" d="M10 1c-1.828 0-3.623.149-5.371.435a.75.75 0 00-.629.74v.387c-.827.157-1.642.345-2.445.564a.75.75 0 00-.552.698 5 5 0 004.503 5.152 6 6 0 002.946 1.822A1.51 1.51 0 018 12.001v1.751a.75.75 0 01-.22.53l-2.561 2.561a.75.75 0 00.53 1.281h8.502a.75.75 0 00.53-1.281L12.22 14.28a.75.75 0 01-.22-.53v-1.751a1.508 1.508 0 01-.452-1.003 6 6 0 002.946-1.822 5 5 0 004.503-5.152.75.75 0 00-.552-.698A31.804 31.804 0 0016 2.562v-.388a.75.75 0 00-.629-.74A33.227 33.227 0 0010 1zM4.5 5.017c.557-.092 1.118-.17 1.682-.234.21.165.438.313.68.44A3.5 3.5 0 014.5 5.018zM13.138 5.222c.243-.127.47-.274.68-.439.564.064 1.125.142 1.682.234a3.5 3.5 0 01-2.362.205z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
