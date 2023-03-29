import {Expense, PrismaClient} from '@prisma/client'
import express, {Request, Response} from 'express'
import {getEmail, handleError, handleSuccess} from '../../common/helpers'
import {IException} from '../../types/logger'
import {morphExpense, morphExpenseDb} from './morphs'
import service from './service'
import {IExpense} from './types'

const prisma = new PrismaClient()

export default express
  .Router()

  /*
   * GET: `/api/product/:productId/expense`
   * QUERY:
   *        - :productId : `641546e3e6dffedba604e2b3`
   */
  .get('/', async (req: Request<{productId: string}>, res: Response) => {
    try {
      const email = getEmail(req, res)
      const expenses = await service.getAll(prisma)(email, req.params.productId)

      handleSuccess(res, expenses.map(morphExpenseDb))
    } catch (e) {
      handleError(res, e as IException)
    } finally {
      await prisma.$disconnect()
    }
  })

  /*
   * GET:   `/api/product/:productId/expense/:expenseId`
   * QUERY:
   *        - :productId : `641546e3e6dffedba604e2b3`
   *        - :expenseId : `641546e3e6dffedba604e2b3`
   */
  .get('/:expenseId', async (req: Request<{productId: string; expenseId: string}>, res: Response) => {
    try {
      const expense = await service.getSingle(prisma)(req.params.expenseId)

      if (!expense) {
        handleError(res, {name: 'Expense not found', message: 'Expense not found'})
        return
      }

      handleSuccess(res, morphExpenseDb(expense))
    } catch (e) {
      handleError(res, e as IException)
    } finally {
      await prisma.$disconnect()
    }
  })

  /*
   * POST:    `/api/product/:productId/expense`
   * QUERY:
   *        - :productId : `641546e3e6dffedba604e2b3`
   * PAYLOAD: IExpense
   */
  .post('/', async (req: Request<{productId: string}>, res: Response) => {
    try {
      const email = getEmail(req, res)
      const newExpense: IExpense = req.body

      newExpense.owner = email
      newExpense.productId = req.params.productId

      const expense = await service.create(prisma)(morphExpense(newExpense))

      handleSuccess(res, morphExpenseDb(expense))
    } catch (e) {
      handleError(res, e as IException)
    } finally {
      await prisma.$disconnect()
    }
  })

  /*
   * POST:    `/api/product/:productId/expense/:expenseId`
   * QUERY:
   *          - :productId : `641546e3e6dffedba604e2b3`
   *          - :expenseId : `641546e3e6dffedba604e2b3`
   * PAYLOAD: IExpense
   */
  .post('/:expenseId', async (req: Request<{productId: string; expenseId: string}>, res: Response) => {
    try {
      const updatedExpense: IExpense = req.body
      const id: string = req.params.expenseId
      let expense = await service.getSingle(prisma)(id)

      if (!expense) {
        handleError(res, {name: 'Expense not found', message: 'Expense not found'})
        return
      }

      expense = {...expense, ...morphExpense(updatedExpense)}

      await service.update(prisma)(id, expense)

      handleSuccess(res, morphExpenseDb(expense))
    } catch (e) {
      handleError(res, e as IException)
    } finally {
      await prisma.$disconnect()
    }
  })

  /*
   * POST:    `/api/product/:productId/expense/import`
   * QUERY:
   *        - :productId : `641546e3e6dffedba604e2b3`
   * PAYLOAD: IExpense[]
   */
  .post('/import', async (req: Request<{productId: string}>, res: Response) => {
    try {
      const email = getEmail(req, res)
      const productId = req.params.productId
      const expenses: IExpense[] = req.body
      const createdExpenses: Expense[] = []

      for (const expense of expenses) {
        expense.owner = email
        expense.productId = productId

        const newExpense = await service.create(prisma)(morphExpense(expense))

        createdExpenses.push(newExpense)
      }

      handleSuccess(res, createdExpenses.map(morphExpenseDb))
    } catch (e) {
      handleError(res, e as IException)
    } finally {
      await prisma.$disconnect()
    }
  })

  /*
   * DELETE:  `/api/product/:productId/expense/:expenseId`
   * QUERY:
   *          - :productId : `641546e3e6dffedba604e2b3`
   *          - :expenseId : `641546e3e6dffedba604e2b3`
   */
  .delete('/:expenseId', async (req: Request<{productId: string; expenseId: string}>, res: Response) => {
    try {
      await service.remove(prisma)(req.params.expenseId)

      handleSuccess(res)
    } catch (e) {
      handleError(res, e as IException)
    } finally {
      await prisma.$disconnect()
    }
  })
