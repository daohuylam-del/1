import express from 'express';
import { clientMonth } from './api/reports/client-month.js';
import { cardsStatement } from './api/reports/cards-statement.js';
import { kpis } from './api/reports/kpis.js';

const app = express();
app.use(express.json());

app.post('/api/reports/client-month', clientMonth);
app.post('/api/reports/cards-statement', cardsStatement);
app.post('/api/reports/kpis', kpis);

export default app;

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server listening on ${port}`));
}
