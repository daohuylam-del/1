import { Request, Response } from 'express';
import { buildClientMonthReport, reportToCSV, Spend, AccountClientHistory, FXRate, ReportOptions } from '../../lib/reports';

export function clientMonth(req: Request, res: Response) {
  const spends: Spend[] = req.body.spends || [];
  const history: AccountClientHistory[] = req.body.history || [];
  const fxRates: FXRate[] = req.body.fxRates || [];
  const reportCurrency: string = req.query.currency as string || req.body.reportCurrency || 'USD';
  const opts: ReportOptions = { reportCurrency, fxRates };
  const report = buildClientMonthReport(spends, history, opts);
  if (req.query.format === 'csv') {
    res.setHeader('Content-Type', 'text/csv');
    res.send(reportToCSV(report));
  } else {
    res.json(report);
  }
}
