import {getEmail, handleError, handleSuccess} from '@src/common/helpers'
import {IException} from '@src/types/logger'
import express, {Request, Response, Router} from 'express'

import {morphSaleDb} from '../product-sale/morphs'
import {IExternalSale} from '../product-sale/types'
import productService from '../product/service'
import {morphExternalSale} from './morphs'
import service from './service'

const router: Router = express.Router()

/*
 * GET: `/api/sale`
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const email = getEmail(req, res)
    const sales = await service.getAll(email)

    handleSuccess(res, sales.map(morphSaleDb))
  } catch (e) {
    handleError(res, e as IException)
  }
})

/*
 * POST:    `/api/sale/form`
 * PAYLOAD: IExternalSale
 */
router.post('/form', async (req: Request<unknown, unknown, IExternalSale>, res: Response) => {
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

export default router
