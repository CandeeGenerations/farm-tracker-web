import {Expense} from '@prisma/client'
import express, {Request, Response} from 'express'
import {getEmail, handleError, handleSuccess} from '../../common/helpers.js'
import {IException} from '../../types/logger.js'
import {morphExpense, morphExpenseDb} from './morphs.js'
import service from './service.js'
import {IExpense} from './types.js'

const route = '/:productId/expense'

export default express
  .Router()

  /*
   * POST:    `/api/product/:productId/expense/import`
   * QUERY:
   *        - :productId : `641546e3e6dffedba604e2b3`
   * PAYLOAD: IExpense[]
   */
  .post(`${route}/import`, async (req: Request<{productId: string}>, res: Response) => {
    try {
      const email = getEmail(req, res)
      const productId = req.params.productId
      const expenses: IExpense[] = req.body
      const createdExpenses: Expense[] = []

      for (const expense of expenses) {
        expense.owner = email
        expense.productId = productId

        const newExpense = await service.create(morphExpense(expense))

        createdExpenses.push(newExpense)
      }

      handleSuccess(res, createdExpenses.map(morphExpenseDb))
    } catch (e) {
      handleError(res, e as IException)
    }
  })

  /*
   * GET: `/api/product/:productId/expense`
   * QUERY:
   *        - :productId : `641546e3e6dffedba604e2b3`
   */
  .get(`${route}/`, async (req: Request<{productId: string}>, res: Response) => {
    try {
      const email = getEmail(req, res)
      const expenses = await service.getAll(email, req.params.productId)

      handleSuccess(res, expenses.map(morphExpenseDb))
    } catch (e) {
      handleError(res, e as IException)
    }
  })

  /*
   * GET:   `/api/product/:productId/expense/:expenseId`
   * QUERY:
   *        - :productId : `641546e3e6dffedba604e2b3`
   *        - :expenseId : `641546e3e6dffedba604e2b3`
   */
  .get(`${route}/:expenseId`, async (req: Request<{productId: string; expenseId: string}>, res: Response) => {
    try {
      const expense = await service.getSingle(req.params.expenseId)

      if (!expense) {
        handleError(res, {name: 'Expense not found', message: 'Expense not found'})
        return
      }

      handleSuccess(res, morphExpenseDb(expense))
    } catch (e) {
      handleError(res, e as IException)
    }
  })

  /*
   * POST:    `/api/product/:productId/expense`
   * QUERY:
   *        - :productId : `641546e3e6dffedba604e2b3`
   * PAYLOAD: IExpense
   */
  .post(`${route}/`, async (req: Request<{productId: string}>, res: Response) => {
    try {
      const email = getEmail(req, res)
      const newExpense: IExpense = req.body

      newExpense.owner = email
      newExpense.productId = req.params.productId

      const expense = await service.create(morphExpense(newExpense))

      handleSuccess(res, morphExpenseDb(expense))
    } catch (e) {
      handleError(res, e as IException)
    }
  })

  /*
   * POST:    `/api/product/:productId/expense/:expenseId`
   * QUERY:
   *          - :productId : `641546e3e6dffedba604e2b3`
   *          - :expenseId : `641546e3e6dffedba604e2b3`
   * PAYLOAD: IExpense
   */
  .post(`${route}/:expenseId`, async (req: Request<{productId: string; expenseId: string}>, res: Response) => {
    try {
      const updatedExpense: IExpense = req.body
      const id: string = req.params.expenseId
      let expense = await service.getSingle(id)

      if (!expense) {
        handleError(res, {name: 'Expense not found', message: 'Expense not found'})
        return
      }

      expense = {...expense, ...morphExpense(updatedExpense)}

      await service.update(id, expense)

      handleSuccess(res, morphExpenseDb(expense))
    } catch (e) {
      handleError(res, e as IException)
    }
  })

  /*
   * DELETE:  `/api/product/:productId/expense/:expenseId`
   * QUERY:
   *          - :productId : `641546e3e6dffedba604e2b3`
   *          - :expenseId : `641546e3e6dffedba604e2b3`
   */
  .delete(`${route}/:expenseId`, async (req: Request<{productId: string; expenseId: string}>, res: Response) => {
    try {
      await service.remove(req.params.expenseId)

      handleSuccess(res)
    } catch (e) {
      handleError(res, e as IException)
    }
  })
