// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function addDays(base: Date, days: number) {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  return d
}

async function reset() {
  // Xoá theo thứ tự quan hệ để tránh lỗi FK
  await prisma.$transaction([
    prisma.reconciliation.deleteMany(),
    prisma.cardTransaction.deleteMany(),
    prisma.bankTransaction.deleteMany(),
    prisma.cardStatement.deleteMany(),
    prisma.invoice.deleteMany(),
    prisma.deposit.deleteMany(),
    prisma.spend.deleteMany(),
    prisma.adAccountFunding.deleteMany(),
    prisma.accountClientHistory.deleteMany(),
    prisma.adAccount.deleteMany(),
    prisma.card.deleteMany(),
    prisma.bankAccount.deleteMany(),
    prisma.bank.deleteMany(),
    prisma.client.deleteMany(),
    prisma.fxRate.deleteMany(),
    prisma.user.deleteMany(),
  ])
}

async function main() {
  await reset()

  // 1) Clients
  const cA = await prisma.client.create({ data: { name: 'Client A' } })
  const cB = await prisma.client.create({ data: { name: 'Client B' } })

  // 2) Ad accounts
  const adA1 = await prisma.adAccount.create({
    data: { name: 'act_001', clientId: cA.id },
  })
  const adB1 = await prisma.adAccount.create({
    data: { name: 'act_002', clientId: cB.id },
  })

  // 3) Lịch sử mapping account ↔ client
  const start = addDays(new Date(), -30)
  await prisma.accountClientHistory.createMany({
    data: [
      { adAccountId: adA1.id, clientId: cA.id, startDate: start },
      { adAccountId: adB1.id, clientId: cB.id, startDate: start },
    ],
  })

  // 4) Ngân hàng, tài khoản, thẻ
  const bank = await prisma.bank.create({ data: { name: 'ACB' } })
  const bankAcc = await prisma.bankAccount.create({
    data: { bankId: bank.id, name: 'ACB-123456789' },
  })
  const card = await prisma.card.create({
    data: { bankAccountId: bankAcc.id, number: '4111-1111-1111-1111' },
  })

  // 5) Funding nguồn thẻ cho adA1
  await prisma.adAccountFunding.create({
    data: {
      adAccountId: adA1.id,
      cardId: card.id,
      startDate: start,
    },
  })

  // 6) Spend 14 ngày gần đây
  const today = new Date()
  for (let i = 14; i >= 0; i--) {
    const d = addDays(today, -i)
    await prisma.spend.create({
      data: {
        adAccountId: adA1.id,
        date: d,
        amount: Math.round(50 + Math.random() * 150), // USD
        currency: 'USD',
      },
    })
  }

  // 7) Deposit vào bank account (khớp với funding)
  await prisma.deposit.createMany({
    data: [
      {
        bankAccountId: bankAcc.id,
        date: addDays(today, -12),
        amount: 500,
        currency: 'USD',
      },
      {
        bankAccountId: bankAcc.id,
        date: addDays(today, -5),
        amount: 700,
        currency: 'USD',
      },
    ],
  })

  // 8) Invoice FB (gắn với ad account)
  await prisma.invoice.createMany({
    data: [
      {
        adAccountId: adA1.id,
        date: addDays(today, -10),
        amount: 300,
        currency: 'USD',
      },
      {
        adAccountId: adA1.id,
        date: addDays(today, -3),
        amount: 420,
        currency: 'USD',
      },
    ],
  })

  // 9) FXRate cho quy đổi (ví dụ USD ↔ VND)
  const base = addDays(today, -14)
  for (let i = 0; i <= 14; i++) {
    const d = addDays(base, i)
    await prisma.fxRate.create({
      data: {
        date: d,
        fromCurrency: 'USD',
        toCurrency: 'VND',
        rate: 25000 + Math.round(Math.random() * 500), // ví dụ 25k ±
      },
    })
  }

  // 10) Optional user (cho demo auth)
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: 'hashed_password_placeholder',
    },
  })

  console.log('✅ Seed data inserted.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
