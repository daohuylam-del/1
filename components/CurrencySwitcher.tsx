import { useCurrency } from '../contexts/CurrencyContext';

const currencies = ['USD', 'EUR', 'VND'];

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  return (
    <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ marginLeft: '1rem' }}>
      {currencies.map(c => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}
