import { Request, Response } from 'express';
import { buildCardsStatement, Spend, FXRate, ReportOptions } from '../../lib/reports';

export function cardsStatement(req: Request, res: Response) {
  const spends: Spend[] = req.body.spends || [];
  const fxRates: FXRate[] = req.body.fxRates || [];
  const reportCurrency: string = req.query.currency as string || req.body.reportCurrency || 'USD';
  const opts: ReportOptions = { reportCurrency, fxRates };
  const statement = buildCardsStatement(spends, opts);
  res.json(statement);
}
