import {PrismaClient, Product} from '@prisma/client'
import express, {Request, Response} from 'express'
import _uniq from 'lodash/uniq'
import {getEmail, handleError, handleSuccess} from '../../common/helpers'
import {IException} from '../../types/logger'
import {morphProduct, morphProductDb} from './morphs'
import service from './service'
import {IProduct} from './types'

const prisma = new PrismaClient()

export default express
  .Router()

  /*
   * GET: `/api/product`
   */
  .get('/', async (req: Request, res: Response) => {
    try {
      const email = getEmail(req, res)
      const products = await service.getAll(prisma)(email)

      handleSuccess(res, products.map(morphProductDb))
    } catch (e) {
      handleError(res, e as IException)
    } finally {
      await prisma.$disconnect()
    }
  })

  /*
   * GET:   `/api/product/:productId`
   * QUERY:
   *        - :productId : `641546e3e6dffedba604e2b3`
   */
  .get('/:productId', async (req: Request<{productId: string}>, res: Response) => {
    try {
      const product = await service.getSingle(prisma)(req.params.productId)

      if (!product) {
        handleError(res, {name: 'Product not found', message: 'Product not found'})
        return
      }

      handleSuccess(res, morphProductDb(product))
    } catch (e) {
      handleError(res, e as IException)
    } finally {
      await prisma.$disconnect()
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

      const product = await service.create(prisma)(morphProduct(newProduct))

      handleSuccess(res, morphProductDb(product))
    } catch (e) {
      handleError(res, e as IException)
    } finally {
      await prisma.$disconnect()
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
      let product = await service.getSingle(prisma)(id)

      if (!product) {
        handleError(res, {name: 'Product not found', message: 'Product not found'})
        return
      }

      product = {...product, ...morphProduct(updatedProduct)}
      product.expenses = []
      product.loggedProducts = []

      await service.update(prisma)(id, product)

      handleSuccess(res, morphProductDb(product))
    } catch (e) {
      handleError(res, e as IException)
    } finally {
      await prisma.$disconnect()
    }
  })

  /*
   * POST:    `/api/product/import`
   * PAYLOAD: IProduct[]
   */
  .post('/import', async (req: Request, res: Response) => {
    try {
      const email = getEmail(req, res)
      const existingProducts = await service.getAll(prisma)(email)
      const existingSpecies = _uniq(existingProducts.map(x => x.species))

      const products: IProduct[] = req.body
      const createdProducts: Product[] = []

      for (const product of products) {
        const species = existingSpecies.find(x => x.toLowerCase().trim() === product.species.toLowerCase())

        if (species) {
          product.species = species
        }

        product.owner = email

        const newProduct = await service.create(prisma)(morphProduct(product))

        createdProducts.push(newProduct)
      }

      handleSuccess(res, createdProducts.map(morphProductDb))
    } catch (e) {
      handleError(res, e as IException)
    } finally {
      await prisma.$disconnect()
    }
  })

  /*
   * DELETE:  `/api/product/:productId`
   * QUERY:
   *          - :productId : `641546e3e6dffedba604e2b3`
   */
  .delete('/:productId', async (req: Request<{productId: string}>, res: Response) => {
    try {
      await service.remove(prisma)(req.params.productId)

      handleSuccess(res)
    } catch (e) {
      handleError(res, e as IException)
    } finally {
      await prisma.$disconnect()
    }
  })
