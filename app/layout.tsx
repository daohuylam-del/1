'use client';
import React, { useEffect, useState } from 'react';
import '../src/styles/tailwind.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const stored = window.localStorage.getItem('theme');
    if (stored) setTheme(stored);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    window.localStorage.setItem('theme', next);
  };

  return (
    <html lang="en" className={theme}>
      <body className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="font-bold">Ad Manager</h1>
          <div className="space-x-2">
            <button onClick={toggleTheme} className="px-2 py-1 border rounded">Toggle Theme</button>
            <button className="px-2 py-1 border rounded">Install App</button>
          </div>
        </header>
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
