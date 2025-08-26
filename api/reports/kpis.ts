import { Request, Response } from 'express';
import { buildKPIReport, Spend, FXRate, ReportOptions } from '../../lib/reports';

export function kpis(req: Request, res: Response) {
  const spends: Spend[] = req.body.spends || [];
  const fxRates: FXRate[] = req.body.fxRates || [];
  const reportCurrency: string = req.query.currency as string || req.body.reportCurrency || 'USD';
  const opts: ReportOptions = { reportCurrency, fxRates };
  const kpi = buildKPIReport(spends, opts);
  res.json(kpi);
}
