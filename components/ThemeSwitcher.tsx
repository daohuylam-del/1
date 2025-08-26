import { useTheme } from '../contexts/ThemeContext';

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} style={{ marginLeft: '1rem' }}>
      {theme === 'light' ? '🌞' : '🌙'}
    </button>
  );
}
