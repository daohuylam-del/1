import type { AppProps } from 'next/app';
import '../styles/global.css';
import { ThemeProvider } from '../contexts/ThemeContext';
import { CurrencyProvider } from '../contexts/CurrencyContext';
import ThemeSwitcher from '../components/ThemeSwitcher';
import CurrencySwitcher from '../components/CurrencySwitcher';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <div style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <CurrencySwitcher />
            <ThemeSwitcher />
          </div>
          <Component {...pageProps} />
        </div>
      </CurrencyProvider>
    </ThemeProvider>
  );
}
