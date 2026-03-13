import {writeFileSync} from 'fs'
import {join} from 'path'

import {PrismaClient} from '../generated/prisma/client'

const prisma = new PrismaClient()

async function main() {
  const owner = 'tcjcandee@gmail.com'
  const cutoffDate = new Date('2026-01-01T00:00:00.000Z')

  // Step 1: Dump ALL sales (full table backup) with all fields
  console.log('Dumping all sales from the table...')
  const allSales = await prisma.sale.findMany({
    select: {
      id: true,
      productId: true,
      owner: true,
      customerName: true,
      notes: true,
      amount: true,
      quantity: true,
      saleDate: true,
    },
  })
  const backupPath = join(__dirname, '..', `sale-backup-${Date.now()}.json`)
  writeFileSync(backupPath, JSON.stringify(allSales, null, 2))
  console.log(`Backed up ${allSales.length} total sales to ${backupPath}`)

  // Step 2: Find sales to delete
  const salesToDelete = await prisma.sale.findMany({
    where: {
      owner,
      saleDate: {lt: cutoffDate},
    },
    select: {id: true, saleDate: true},
  })
  console.log(`Found ${salesToDelete.length} sales for ${owner} with saleDate before ${cutoffDate.toISOString()}`)

  if (salesToDelete.length === 0) {
    console.log('Nothing to delete. Exiting.')
    return
  }

  // Step 3: Delete
  const result = await prisma.sale.deleteMany({
    where: {
      owner,
      saleDate: {lt: cutoffDate},
    },
  })
  console.log(`Deleted ${result.count} sales.`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
