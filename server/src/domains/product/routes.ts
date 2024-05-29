import {Product} from '@prisma/client'
import express, {Request, Response} from 'express'
import lodash from 'lodash'
import {getEmail, handleError, handleSuccess} from '../../common/helpers.js'
import {IException} from '../../types/logger.js'
import {morphProduct, morphProductDb} from './morphs.js'
import service from './service.js'
import {IProduct} from './types.js'

export default express
  .Router()

  /*
   * POST:    `/api/product/import`
   * PAYLOAD: IProduct[]
   */
  .post('/import', async (req: Request, res: Response) => {
    try {
      const email = getEmail(req, res)
      const existingProducts = await service.getAll(email)
      const existingSpecies = lodash.uniq(existingProducts.map(x => x.species))

      const products: IProduct[] = req.body
      const createdProducts: Product[] = []

      for (const product of products) {
        const species = existingSpecies.find(x => x.toLowerCase().trim() === product.species.toLowerCase())

        if (species) {
          product.species = species
        }

        product.owner = email

        const newProduct = await service.create(morphProduct(product))

        createdProducts.push(newProduct)
      }

      handleSuccess(res, createdProducts.map(morphProductDb))
    } catch (e) {
      handleError(res, e as IException)
    }
  })

  /*
   * GET: `/api/product`
   */
  .get('/', async (req: Request, res: Response) => {
    try {
      const email = getEmail(req, res)
      const products = await service.getAll(email)

      handleSuccess(res, products.map(morphProductDb))
    } catch (e) {
      handleError(res, e as IException)
    }
  })

  /*
   * GET:   `/api/product/:productId`
   * QUERY:
   *        - :productId : `641546e3e6dffedba604e2b3`
   */
  .get('/:productId', async (req: Request<{productId: string}>, res: Response) => {
    try {
      const product = await service.getSingle(req.params.productId)

      if (!product) {
        handleError(res, {name: 'Product not found', message: 'Product not found'})
        return
      }

      handleSuccess(res, morphProductDb(product))
    } catch (e) {
      handleError(res, e as IException)
    }
  })

  /*
   * POST:    `/api/product`
   * PAYLOAD: IProduct
   */
  .post('/', async (req: Request, res: Response) => {
    try {
      const email = getEmail(req, res)
      const newProduct: IProduct = req.body

      newProduct.owner = email

      const product = await service.create(morphProduct(newProduct))

      handleSuccess(res, morphProductDb(product))
    } catch (e) {
      handleError(res, e as IException)
    }
  })

  /*
   * POST:    `/api/product/:productId`
   * QUERY:
   *          - :productId : `641546e3e6dffedba604e2b3`
   * PAYLOAD: IProduct
   */
  .post('/:productId', async (req: Request<{productId: string}>, res: Response) => {
    try {
      const updatedProduct: IProduct = req.body
      const id: string = req.params.productId
      let product = await service.getSingle(id)

      if (!product) {
        handleError(res, {name: 'Product not found', message: 'Product not found'})
        return
      }

      product = {...product, ...morphProduct(updatedProduct)}
      product.expenses = []
      product.loggedProducts = []

      await service.update(id, product)

      handleSuccess(res, morphProductDb(product))
    } catch (e) {
      handleError(res, e as IException)
    }
  })

  /*
   * DELETE:  `/api/product/:productId`
   * QUERY:
   *          - :productId : `641546e3e6dffedba604e2b3`
   */
  .delete('/:productId', async (req: Request<{productId: string}>, res: Response) => {
    try {
      await service.remove(req.params.productId)

      handleSuccess(res)
    } catch (e) {
      handleError(res, e as IException)
    }
  })
