export interface Transaction {
  id: string;
  amountBaseDecimal: number;
  date: string; // ISO date string
  description?: string;
}

export interface MatchResult {
  card: Transaction;
  bank: Transaction | null;
  status: 'MATCHED' | 'PARTIAL' | 'UNMATCHED';
}

function dateDiffInDays(a: Date, b: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((a.getTime() - b.getTime()) / msPerDay);
}

/**
 * Fuzzy match card and bank transactions by amount and date.
 * A match occurs when amounts are equal and the date difference is within the
 * provided day range. A date difference of 0 is considered MATCHED while any
 * other difference within range is PARTIAL.
 */
export function fuzzyMatchTransactions(
  cardTxns: Transaction[],
  bankTxns: Transaction[],
  daysRange: number = 1
): { pairs: MatchResult[]; unmatchedBank: Transaction[] } {
  const bankPool = [...bankTxns];
  const pairs: MatchResult[] = [];

  cardTxns.forEach(card => {
    const idx = bankPool.findIndex(bank => {
      return (
        bank.amountBaseDecimal === card.amountBaseDecimal &&
        Math.abs(dateDiffInDays(new Date(bank.date), new Date(card.date))) <=
          daysRange
      );
    });

    if (idx >= 0) {
      const bank = bankPool.splice(idx, 1)[0];
      const days = Math.abs(
        dateDiffInDays(new Date(bank.date), new Date(card.date))
      );
      const status = days === 0 ? 'MATCHED' : 'PARTIAL';
      pairs.push({ card, bank, status });
    } else {
      pairs.push({ card, bank: null, status: 'UNMATCHED' });
    }
  });

  return { pairs, unmatchedBank: bankPool };
}
