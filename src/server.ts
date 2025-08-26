import express from 'express';
import bodyParser from 'body-parser';
import { fuzzyMatchTransactions, Transaction } from '../lib/reconcile';

const app = express();
app.use(bodyParser.json());

const cardTransactions: Transaction[] = [];
const bankTransactions: Transaction[] = [];
const manualMatches: { cardId: string; bankId: string }[] = [];

app.post('/api/card-transactions/import', (req, res) => {
  const txns: Transaction[] = req.body.transactions || [];
  cardTransactions.push(...txns);
  res.json({ imported: txns.length });
});

app.post('/api/bank-transactions/import', (req, res) => {
  const txns: Transaction[] = req.body.transactions || [];
  bankTransactions.push(...txns);
  res.json({ imported: txns.length });
});

app.post('/api/reconcile/match', (req, res) => {
  const { cardId, bankId } = req.body;
  if (!cardId || !bankId) {
    return res.status(400).json({ error: 'cardId and bankId are required' });
  }
  manualMatches.push({ cardId, bankId });
  res.json({ status: 'ok' });
});

function filterByMonth(txns: Transaction[], month: string) {
  const [y, m] = month.split('-').map(Number);
  return txns.filter(t => {
    const d = new Date(t.date);
    return d.getFullYear() === y && d.getMonth() + 1 === m;
  });
}

app.get('/api/reconcile/overview', (req, res) => {
  const month = req.query.month as string;
  if (!month) {
    return res.status(400).json({ error: 'month query param required' });
  }

  let card = filterByMonth(cardTransactions, month);
  let bank = filterByMonth(bankTransactions, month);

  const cardTotal = card.reduce((sum, t) => sum + t.amountBaseDecimal, 0);
  const bankTotal = bank.reduce((sum, t) => sum + t.amountBaseDecimal, 0);

  let matched = 0;
  let partial = 0;
  let unmatched = 0;

  // apply manual matches
  manualMatches.forEach(({ cardId, bankId }) => {
    const ci = card.findIndex(c => c.id === cardId);
    const bi = bank.findIndex(b => b.id === bankId);
    if (ci >= 0 && bi >= 0) {
      matched++;
      card.splice(ci, 1);
      bank.splice(bi, 1);
    }
  });

  const { pairs, unmatchedBank } = fuzzyMatchTransactions(card, bank, 3);
  pairs.forEach(p => {
    if (p.status === 'MATCHED') matched++;
    else if (p.status === 'PARTIAL') partial++;
    else unmatched++;
  });
  unmatched += unmatchedBank.length;

  const variance = cardTotal - bankTotal;

  res.json({ matched, partial, unmatched, variance });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
