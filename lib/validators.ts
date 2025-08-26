import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export type Client = z.infer<typeof clientSchema> & { id: string };

export const adAccountSchema = z.object({
  internalId: z.string(),
  fbAdAccountId: z.string(),
  status: z.string(),
  accountCurrency: z.string(),
  cardFeeDecimal: z.number(),
});

export type AdAccount = z.infer<typeof adAccountSchema> & { id: string };
