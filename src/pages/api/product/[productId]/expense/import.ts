import {getUserEmail} from '@/pages/api/_common/helpers'
import {IExpense, morphExpense, morphExpenseDb} from '@/pages/api/_morphs/product.morph'
import {Expense, PrismaClient} from '@prisma/client'
import {NextApiRequest, NextApiResponse} from 'next'

const prisma = new PrismaClient()

// CREATE /api/product/:productId/expense/import
const handle = async (req: NextApiRequest, res: NextApiResponse): Promise<IExpense[]> => {
  if (req.method !== 'POST') {
    res.status(500).send({error: 'Method not supported'})
    return
  }

  const userEmail = await getUserEmail(req, res)
  const productId = req.query.productId.toString()
  const expenses: IExpense[] = req.body
  const createdExpenses: Expense[] = []

  for (const expense of expenses) {
    expense.owner = userEmail

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

  res.json(createdExpenses.map(morphExpenseDb))
}

export default handle
