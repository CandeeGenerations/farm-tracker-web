import express, {Request, Response} from 'express'
import {getEmail, handleError, handleSuccess} from '../../common/helpers.js'
import {IException} from '../../types/logger.js'
import {morphSaleDb} from '../product-sale/morphs.js'
import service from './service.js'

export default express
  .Router()

  /*
   * GET: `/api/sale`
   */
  .get('/', async (req: Request, res: Response) => {
    try {
      const email = getEmail(req, res)
      const sales = await service.getAll(email)

      handleSuccess(res, sales.map(morphSaleDb))
    } catch (e) {
      handleError(res, e as IException)
    }
  })
