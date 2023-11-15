import {Sale} from '@prisma/client'
import express, {Request, Response} from 'express'
import {getEmail, handleError, handleSuccess} from '../../common/helpers.js'
import {IException} from '../../types/logger.js'
import {morphSale, morphSaleDb} from './morphs.js'
import service from './service.js'
import {ISale} from './types.js'

const route = '/:productId/sale'

export default express
  .Router()

  /*
   * GET: `/api/product/:productId/sale`
   * QUERY:
   *        - :productId : `641546e3e6dffedba604e2b3`
   */
  .get(`${route}/`, async (req: Request<{productId: string}>, res: Response) => {
    try {
      const email = getEmail(req, res)
      const sales = await service.getAll(email, req.params.productId)

      handleSuccess(res, sales.map(morphSaleDb))
    } catch (e) {
      handleError(res, e as IException)
    }
  })

  /*
   * GET:   `/api/product/:productId/sale/:saleId`
   * QUERY:
   *        - :productId : `641546e3e6dffedba604e2b3`
   *        - :saleId : `641546e3e6dffedba604e2b3`
   */
  .get(`${route}/:saleId`, async (req: Request<{productId: string; saleId: string}>, res: Response) => {
    try {
      const sale = await service.getSingle(req.params.saleId)

      if (!sale) {
        handleError(res, {name: 'Sale not found', message: 'Sale not found'})
        return
      }

      handleSuccess(res, morphSaleDb(sale))
    } catch (e) {
      handleError(res, e as IException)
    }
  })

  /*
   * POST:    `/api/product/:productId/sale`
   * QUERY:
   *        - :productId : `641546e3e6dffedba604e2b3`
   * PAYLOAD: ISale
   */
  .post(`${route}/`, async (req: Request<{productId: string}>, res: Response) => {
    try {
      const email = getEmail(req, res)
      const newSale: ISale = req.body

      newSale.owner = email
      newSale.productId = req.params.productId

      const sale = await service.create(morphSale(newSale))

      handleSuccess(res, morphSaleDb(sale))
    } catch (e) {
      handleError(res, e as IException)
    }
  })

  /*
   * POST:    `/api/product/:productId/sale/:saleId`
   * QUERY:
   *          - :productId : `641546e3e6dffedba604e2b3`
   *          - :saleId : `641546e3e6dffedba604e2b3`
   * PAYLOAD: ISale
   */
  .post(`${route}/:saleId`, async (req: Request<{productId: string; saleId: string}>, res: Response) => {
    try {
      const updatedSale: ISale = req.body
      const id: string = req.params.saleId
      let sale = await service.getSingle(id)

      if (!sale) {
        handleError(res, {name: 'Sale not found', message: 'Sale not found'})
        return
      }

      sale = {...sale, ...morphSale(updatedSale)}

      await service.update(id, sale)

      handleSuccess(res, morphSaleDb(sale))
    } catch (e) {
      handleError(res, e as IException)
    }
  })

  /*
   * POST:    `/api/product/:productId/sale/import`
   * QUERY:
   *        - :productId : `641546e3e6dffedba604e2b3`
   * PAYLOAD: ISale[]
   */
  .post(`${route}/import`, async (req: Request<{productId: string}>, res: Response) => {
    try {
      const email = getEmail(req, res)
      const productId = req.params.productId
      const sales: ISale[] = req.body
      const createdSales: Sale[] = []

      for (const sale of sales) {
        sale.owner = email
        sale.productId = productId

        const newSale = await service.create(morphSale(sale))

        createdSales.push(newSale)
      }

      handleSuccess(res, createdSales.map(morphSaleDb))
    } catch (e) {
      handleError(res, e as IException)
    }
  })

  /*
   * DELETE:  `/api/product/:productId/sale/:saleId`
   * QUERY:
   *          - :productId : `641546e3e6dffedba604e2b3`
   *          - :saleId : `641546e3e6dffedba604e2b3`
   */
  .delete(`${route}/:saleId`, async (req: Request<{productId: string; saleId: string}>, res: Response) => {
    try {
      await service.remove(req.params.saleId)

      handleSuccess(res)
    } catch (e) {
      handleError(res, e as IException)
    }
  })
