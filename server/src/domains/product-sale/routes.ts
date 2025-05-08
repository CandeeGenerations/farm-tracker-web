import {Sale} from '@generated/client'
import {getEmail, handleError, handleSuccess} from '@src/common/helpers'
import {IException} from '@src/types/logger'
import express, {Request, Response, Router} from 'express'

import productService from '../product/service'
import {morphExternalSale, morphSale, morphSaleDb} from './morphs'
import service from './service'
import {IExternalSale, ISale} from './types'

const route = '/:productId/sale'

const router: Router = express.Router()

/*
 * POST:    `/api/product/:productId/sale/import`
 * QUERY:
 *        - :productId : `641546e3e6dffedba604e2b3`
 * PAYLOAD: ISale[]
 */
router.post(`${route}/import`, async (req: Request<{productId: string}, unknown, ISale[]>, res: Response) => {
  try {
    const email = getEmail(req, res)
    const productId = req.params.productId
    const sales = req.body
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
 * GET: `/api/product/:productId/sale`
 * QUERY:
 *        - :productId : `641546e3e6dffedba604e2b3`
 */
router.get(`${route}/`, async (req: Request<{productId: string}>, res: Response) => {
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
router.get(`${route}/:saleId`, async (req: Request<{productId: string; saleId: string}>, res: Response) => {
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
 * POST:    `/api/product/:productId/form-sale`
 * PAYLOAD: IExternalSale
 */
router.post(`${route}/form-sale`, async (req: Request<unknown, unknown, IExternalSale>, res: Response) => {
  try {
    const email = getEmail(req, res)
    const newSale = req.body
    const product = await productService.getSingleByName(newSale.productName)

    if (!product) {
      handleError(res, {name: 'Product not found', message: 'Product not found'})
      return
    }

    newSale.owner = email
    newSale.productId = product.id

    const sale = await service.create(morphExternalSale(newSale))

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
router.post(`${route}/`, async (req: Request<{productId: string}, unknown, ISale>, res: Response) => {
  try {
    const email = getEmail(req, res)
    const newSale = req.body

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
router.post(
  `${route}/:saleId`,
  async (req: Request<{productId: string; saleId: string}, unknown, ISale>, res: Response) => {
    try {
      const updatedSale = req.body
      const id = req.params.saleId
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
  },
)

/*
 * DELETE:  `/api/product/:productId/sale/:saleId`
 * QUERY:
 *          - :productId : `641546e3e6dffedba604e2b3`
 *          - :saleId : `641546e3e6dffedba604e2b3`
 */
router.delete(`${route}/:saleId`, async (req: Request<{productId: string; saleId: string}>, res: Response) => {
  try {
    await service.remove(req.params.saleId)

    handleSuccess(res)
  } catch (e) {
    handleError(res, e as IException)
  }
})

export default router
