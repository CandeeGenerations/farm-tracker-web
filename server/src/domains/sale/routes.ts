import {getEmail, handleError, handleSuccess} from '@src/common/helpers'
import {IException} from '@src/types/logger'
import express, {Request, Response, Router} from 'express'

import {morphSaleDb} from '../product-sale/morphs'
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

export default router
