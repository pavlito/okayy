import React from 'react';
import { useTheme } from 'next-themes';

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) return <div style={{ width: 96, height: 32 }} />;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2,
        padding: 2,
        borderRadius: 9999,
        border: '1px solid var(--gray4)',
        background: 'var(--gray2)',
      }}
    >
      <button
        aria-label="Light theme"
        title="Light"
        onClick={() => setTheme('light')}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 28,
          height: 28,
          borderRadius: 9999,
          border: 'none',
          cursor: 'pointer',
          background: theme === 'light' ? 'var(--gray6)' : 'transparent',
          color: theme === 'light' ? 'var(--gray12)' : 'var(--gray9)',
          transition: 'background 150ms, color 150ms',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      </button>
      <button
        aria-label="System theme"
        title="System"
        onClick={() => setTheme('system')}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 28,
          height: 28,
          borderRadius: 9999,
          border: 'none',
          cursor: 'pointer',
          background: theme === 'system' ? 'var(--gray6)' : 'transparent',
          color: theme === 'system' ? 'var(--gray12)' : 'var(--gray9)',
          transition: 'background 150ms, color 150ms',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      </button>
      <button
        aria-label="Dark theme"
        title="Dark"
        onClick={() => setTheme('dark')}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 28,
          height: 28,
          borderRadius: 9999,
          border: 'none',
          cursor: 'pointer',
          background: theme === 'dark' ? 'var(--gray6)' : 'transparent',
          color: theme === 'dark' ? 'var(--gray12)' : 'var(--gray9)',
          transition: 'background 150ms, color 150ms',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>
    </div>
  );
}
