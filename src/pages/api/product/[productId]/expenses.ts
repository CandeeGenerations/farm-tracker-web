import {IExpense, morphExpenseDb} from '@/pages/api/_morphs/product.morph'
import {PrismaClient} from '@prisma/client'
import {NextApiRequest, NextApiResponse} from 'next'

const prisma = new PrismaClient()

// GET /api/product/:productId/expenses
const handle = async (req: NextApiRequest, res: NextApiResponse): Promise<IExpense[]> => {
  if (req.method !== 'GET') {
    res.status(500).send({error: 'Method not supported'})
    return
  }

  const productId = req.query.productId.toString()
  const expenses = await prisma.expense.findMany({where: {productId}})

  res.json(expenses.map(morphExpenseDb))
}

// noinspection JSUnusedGlobalSymbols
export default handle
