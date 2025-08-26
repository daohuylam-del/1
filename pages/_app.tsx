import '../styles/globals.css';
import type { AppProps } from 'next/app';
import InstallButton from '../components/InstallButton';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <header>
        <InstallButton />
      </header>
      <Component {...pageProps} />
    </>
  );
}
