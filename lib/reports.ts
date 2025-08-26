export interface Spend {
  date: string; // ISO date string
  adAccount: string;
  amount: number; // spend amount without fee
  fee: number; // additional fee
  currency: string;
}

export interface AccountClientHistory {
  date: string; // ISO date string
  balance: number; // balance after transaction
  currency: string;
}

export interface FXRate {
  date: string; // ISO date string
  from: string;
  to: string;
  rate: number; // conversion rate from -> to
}

export interface ReportOptions {
  /** Desired report currency. If different from spend or balance currency, conversion will be applied using fxRates */
  reportCurrency: string;
  /** FX rate list used to convert currencies */
  fxRates: FXRate[];
}

export interface DailyAccountDetail {
  date: string;
  adAccount: string;
  spend: number;
  spendWithFee: number;
}

export interface ClientMonthReport {
  totalSpend: number;
  totalFee: number;
  totalSpendWithFee: number;
  balances: { date: string; balance: number }[];
  perDay: { date: string; spend: number; spendWithFee: number }[];
  perAccount: { adAccount: string; spend: number; spendWithFee: number }[];
}

function findRate(date: string, from: string, to: string, fxRates: FXRate[]): number | undefined {
  const rate = fxRates.find(r => r.date === date && r.from === from && r.to === to);
  return rate?.rate;
}

function convert(amount: number, date: string, from: string, to: string, fxRates: FXRate[]): number {
  if (from === to) return amount;
  const rate = findRate(date, from, to, fxRates);
  if (!rate) throw new Error(`Missing FX rate from ${from} to ${to} on ${date}`);
  return amount * rate;
}

export function joinSpendsWithHistory(spends: Spend[], history: AccountClientHistory[]): Map<string, { spend: Spend[]; history: AccountClientHistory | null }>{
  const map = new Map<string, { spend: Spend[]; history: AccountClientHistory | null }>();
  for (const s of spends) {
    const key = s.date;
    if (!map.has(key)) {
      map.set(key, { spend: [], history: null });
    }
    map.get(key)!.spend.push(s);
  }
  for (const h of history) {
    const key = h.date;
    if (!map.has(key)) {
      map.set(key, { spend: [], history: h });
    } else {
      map.get(key)!.history = h;
    }
  }
  return map;
}

export function buildClientMonthReport(spends: Spend[], history: AccountClientHistory[], opts: ReportOptions): ClientMonthReport {
  const joined = joinSpendsWithHistory(spends, history);
  let totalSpend = 0;
  let totalFee = 0;
  const perDay: { date: string; spend: number; spendWithFee: number }[] = [];
  const perAccountMap: Map<string, { spend: number; spendWithFee: number }> = new Map();
  const balances: { date: string; balance: number }[] = [];

  for (const [date, entry] of Array.from(joined.entries()).sort(([a], [b]) => a.localeCompare(b))) {
    let daySpend = 0;
    let dayFee = 0;
    for (const s of entry.spend) {
      const spendConverted = convert(s.amount, date, s.currency, opts.reportCurrency, opts.fxRates);
      const feeConverted = convert(s.fee, date, s.currency, opts.reportCurrency, opts.fxRates);
      daySpend += spendConverted;
      dayFee += feeConverted;
      const account = perAccountMap.get(s.adAccount) || { spend: 0, spendWithFee: 0 };
      account.spend += spendConverted;
      account.spendWithFee += spendConverted + feeConverted;
      perAccountMap.set(s.adAccount, account);
    }
    const spendWithFee = daySpend + dayFee;
    perDay.push({ date, spend: daySpend, spendWithFee });
    totalSpend += daySpend;
    totalFee += dayFee;
    if (entry.history) {
      const balance = convert(entry.history.balance, date, entry.history.currency, opts.reportCurrency, opts.fxRates);
      balances.push({ date, balance });
    }
  }

  const perAccount = Array.from(perAccountMap.entries()).map(([adAccount, data]) => ({ adAccount, ...data }));

  return {
    totalSpend,
    totalFee,
    totalSpendWithFee: totalSpend + totalFee,
    balances,
    perDay,
    perAccount
  };
}

export function reportToCSV(report: ClientMonthReport): string {
  const lines: string[] = [];
  lines.push('date,adAccount,spend,spendWithFee');
  for (const day of report.perDay) {
    // For per-day summary
    lines.push(`${day.date},ALL,${day.spend},${day.spendWithFee}`);
  }
  for (const acc of report.perAccount) {
    lines.push(`TOTAL,${acc.adAccount},${acc.spend},${acc.spendWithFee}`);
  }
  return lines.join('\n');
}

export function buildCardsStatement(spends: Spend[], opts: ReportOptions): DailyAccountDetail[] {
  return spends.map(s => {
    const spendConverted = convert(s.amount, s.date, s.currency, opts.reportCurrency, opts.fxRates);
    const feeConverted = convert(s.fee, s.date, s.currency, opts.reportCurrency, opts.fxRates);
    return {
      date: s.date,
      adAccount: s.adAccount,
      spend: spendConverted,
      spendWithFee: spendConverted + feeConverted
    };
  });
}

export interface KPIReport {
  totalSpendWithFee: number;
  averageDailySpend: number;
}

export function buildKPIReport(spends: Spend[], opts: ReportOptions): KPIReport {
  const details = buildCardsStatement(spends, opts);
  const total = details.reduce((sum, d) => sum + d.spendWithFee, 0);
  const days = new Set(details.map(d => d.date)).size;
  return {
    totalSpendWithFee: total,
    averageDailySpend: days ? total / days : 0
  };
}
