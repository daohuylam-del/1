import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create clients
  const alpha = await prisma.client.create({
    data: { name: 'Alpha Agency' },
  });
  const beta = await prisma.client.create({
    data: { name: 'Beta Corp' },
  });

  // Create cards
  const card1 = await prisma.card.create({
    data: { last4: '4242', currency: 'USD' },
  });
  const card2 = await prisma.card.create({
    data: { last4: '5555', currency: 'USD' },
  });

  // Create ad accounts
  const ad1 = await prisma.adAccount.create({
    data: {
      name: 'FB-1',
      platform: 'facebook',
      currency: 'USD',
      clientId: alpha.id,
    },
  });
  const ad2 = await prisma.adAccount.create({
    data: {
      name: 'FB-2',
      platform: 'facebook',
      currency: 'USD',
      clientId: alpha.id,
    },
  });
  const ad3 = await prisma.adAccount.create({
    data: {
      name: 'GG-1',
      platform: 'google',
      currency: 'VND',
      clientId: beta.id,
    },
  });

  // Ad account switching clients mid-month
  await prisma.adAccountClientHistory.create({
    data: {
      adAccountId: ad2.id,
      clientId: alpha.id,
      startDate: new Date('2023-05-01'),
      endDate: new Date('2023-05-15'),
    },
  });
  await prisma.adAccountClientHistory.create({
    data: {
      adAccountId: ad2.id,
      clientId: beta.id,
      startDate: new Date('2023-05-16'),
    },
  });

  // Funding timeline with card change
  await prisma.fundingTimeline.create({
    data: {
      adAccountId: ad1.id,
      cardId: card1.id,
      startDate: new Date('2023-05-01'),
      endDate: new Date('2023-05-10'),
    },
  });
  await prisma.fundingTimeline.create({
    data: {
      adAccountId: ad1.id,
      cardId: card2.id,
      startDate: new Date('2023-05-11'),
    },
  });

  // Sample spends (USD & VND)
  await prisma.spend.createMany({
    data: [
      {
        adAccountId: ad1.id,
        date: new Date('2023-05-01'),
        amount: 100,
        currency: 'USD',
      },
      {
        adAccountId: ad1.id,
        date: new Date('2023-05-02'),
        amount: 150,
        currency: 'USD',
      },
      {
        adAccountId: ad3.id,
        date: new Date('2023-05-01'),
        amount: 2000000,
        currency: 'VND',
      },
    ],
  });

  // Deposits
  await prisma.deposit.createMany({
    data: [
      {
        cardId: card1.id,
        date: new Date('2023-05-05'),
        amount: 500,
        currency: 'USD',
      },
      {
        cardId: card2.id,
        date: new Date('2023-05-20'),
        amount: 800,
        currency: 'USD',
      },
    ],
  });

  // Card statements and card transactions
  const statement = await prisma.cardStatement.create({
    data: {
      cardId: card1.id,
      startDate: new Date('2023-05-01'),
      endDate: new Date('2023-05-31'),
    },
  });

  await prisma.cardTransaction.createMany({
    data: [
      {
        cardStatementId: statement.id,
        date: new Date('2023-05-05'),
        amount: 100,
        currency: 'USD',
        description: 'FB Ads charge',
      },
      {
        cardStatementId: statement.id,
        date: new Date('2023-05-06'),
        amount: 50,
        currency: 'USD',
        description: 'Google Ads charge',
      },
    ],
  });

  // Bank transactions
  await prisma.bankTransaction.createMany({
    data: [
      {
        date: new Date('2023-05-07'),
        amount: -500,
        currency: 'USD',
        description: 'Payment to card',
      },
      {
        date: new Date('2023-05-25'),
        amount: -800,
        currency: 'USD',
        description: 'Payment to card',
      },
    ],
  });

  // FX rates
  await prisma.fxRate.createMany({
    data: [
      {
        date: new Date('2023-05-01'),
        fromCurrency: 'USD',
        toCurrency: 'VND',
        rate: 23475,
      },
      {
        date: new Date('2023-05-01'),
        fromCurrency: 'VND',
        toCurrency: 'USD',
        rate: 1 / 23475,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
