import {IExpense, morphExpense} from '@/pages/api/_morphs/product.morph'
import {Expense, PrismaClient} from '@prisma/client'
import {NextApiRequest, NextApiResponse} from 'next'

const prisma = new PrismaClient()

// UPDATE /api/product/:productId/expense/:expenseId
const handle = async (req: NextApiRequest, res: NextApiResponse): Promise<Expense> => {
  const id = req.query.expenseId.toString()
  const updatedExpense: IExpense = req.body
  let expense = await prisma.expense.findUnique({where: {id}})

  if (!expense) {
    res.status(500).send({error: 'Expense not found'})
    return
  }

  if (req.method === 'DELETE') {
    await handleDelete(id, res)
    return
  }

  if (req.method !== 'POST') {
    res.status(500).send({error: 'Method not supported'})
    return
  }

  expense = {...expense, ...morphExpense(updatedExpense)}
  delete expense.id

  await prisma.expense.update({data: expense, where: {id}})

  res.json(expense)
}

// DELETE /api/product/:productId/expense/:expenseId
async function handleDelete(id: string, res: NextApiResponse): Promise<void> {
  const expense = await prisma.expense.delete({where: {id}})

  res.json(expense)
}

// noinspection JSUnusedGlobalSymbols
export default handle
