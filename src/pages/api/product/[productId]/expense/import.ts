import {IExpense, morphExpense} from '@/morphs/product.morph'
import {Expense, PrismaClient} from '@prisma/client'
import {NextApiRequest, NextApiResponse} from 'next'

const prisma = new PrismaClient()

// CREATE /api/product/:productId/expense/import
const handle = async (req: NextApiRequest, res: NextApiResponse): Promise<Expense[]> => {
  if (req.method !== 'POST') {
    res.status(500).send({error: 'Method not supported'})
    return
  }

  const productId = req.query.productId.toString()
  const expenses: IExpense[] = req.body
  const createdExpenses: Expense[] = []

  for (const expense of expenses) {
    const newExpense = await prisma.expense.create({
      data: morphExpense({
        ...expense,
        productId,
        amount: parseFloat(expense.amount.toString()),
        quantity: Number(expense.quantity),
      }),
    })

    createdExpenses.push(newExpense)
  }

  res.json(createdExpenses)
}

export default handle
