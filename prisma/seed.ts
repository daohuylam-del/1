import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password', 10);
  const user = await prisma.user.create({
    data: { email: 'admin@example.com', password }
  });

  const clientA = await prisma.client.create({ data: { name: 'Client A' } });
  const clientB = await prisma.client.create({ data: { name: 'Client B' } });

  const ad1 = await prisma.adAccount.create({ data: { name: 'AdAccount 1', clientId: clientA.id } });
  const ad2 = await prisma.adAccount.create({ data: { name: 'AdAccount 2', clientId: clientA.id } });
  const ad3 = await prisma.adAccount.create({ data: { name: 'AdAccount 3', clientId: clientB.id } });

  // History for ad1 switching from clientA to clientB mid month
  const start = new Date('2024-01-01');
  const mid = new Date('2024-01-15');
  await prisma.accountClientHistory.createMany({
    data: [
      { adAccountId: ad1.id, clientId: clientA.id, startDate: start, endDate: mid },
      { adAccountId: ad1.id, clientId: clientB.id, startDate: mid, endDate: null },
    ],
  });

  // Bank, accounts, cards
  const bank = await prisma.bank.create({ data: { name: 'Bank' } });
  const bankAccount = await prisma.bankAccount.create({ data: { name: 'Main Account', bankId: bank.id } });
  const card1 = await prisma.card.create({ data: { number: '1111', bankAccountId: bankAccount.id } });
  const card2 = await prisma.card.create({ data: { number: '2222', bankAccountId: bankAccount.id } });

  // Funding history for ad1 changing card mid cycle
  const cardSwitch = new Date('2024-01-20');
  await prisma.adAccountFunding.createMany({
    data: [
      { adAccountId: ad1.id, cardId: card1.id, startDate: start, endDate: cardSwitch },
      { adAccountId: ad1.id, cardId: card2.id, startDate: cardSwitch, endDate: null },
    ],
  });

  // Spends
  await prisma.spend.createMany({
    data: [
      { adAccountId: ad1.id, date: new Date('2024-01-10'), amount: 100, currency: 'USD' },
      { adAccountId: ad1.id, date: new Date('2024-01-18'), amount: 2000000, currency: 'VND' },
      { adAccountId: ad1.id, date: new Date('2024-01-25'), amount: 150, currency: 'USD' },
    ],
  });

  // Deposits
  await prisma.deposit.createMany({
    data: [
      { cardId: card1.id, date: new Date('2024-01-09'), amount: 100, currency: 'USD' },
      { cardId: card2.id, date: new Date('2024-01-22'), amount: 200, currency: 'USD' },
    ],
  });

  // FX Rates
  await prisma.fXRate.createMany({
    data: [
      { date: new Date('2024-01-01'), fromCurrency: 'USD', toCurrency: 'VND', rate: 23500 },
      { date: new Date('2024-01-15'), fromCurrency: 'USD', toCurrency: 'VND', rate: 23600 },
    ],
  });

  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
