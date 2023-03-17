import {IExpense, morphExpense} from '@/morphs/product.morph'
import {Expense, PrismaClient} from '@prisma/client'
import {NextApiRequest, NextApiResponse} from 'next'

const prisma = new PrismaClient()

// CREATE /api/product/:productId/expense
const handle = async (req: NextApiRequest, res: NextApiResponse): Promise<Expense> => {
  if (req.method !== 'POST') {
    res.status(500).send({error: 'Method not supported'})
    return
  }

  const productId = req.query.productId.toString()
  const newExpense: IExpense = req.body
  const expense = await prisma.expense.create({data: morphExpense({...newExpense, productId})})

  res.json(expense)
}

// noinspection JSUnusedGlobalSymbols
export default handle
