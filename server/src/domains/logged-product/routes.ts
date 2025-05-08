import {LoggedProduct} from '@generated/client'
import {getEmail, handleError, handleSuccess} from '@src/common/helpers'
import {IException} from '@src/types/logger'
import express, {Request, Response, Router} from 'express'
import lodash from 'lodash'

import animalService from '../animal/service'
import productService from '../product/service'
import {morphLoggedProduct, morphLoggedProductDb} from './morphs'
import service from './service'
import {ILoggedProduct} from './types'

const route = '/:productId/logged-product'
const router: Router = express.Router()
export const logImporterRouter: Router = express.Router()

/*
 * POST:    `/api/logged-product/import`
 * PAYLOAD: ILoggedProduct[]
 */
logImporterRouter.post('/import', async (req: Request<{productId: string}>, res: Response) => {
  try {
    const email = getEmail(req, res)
    const existingProducts = await productService.getAll(email)
    const existingAnimals = await animalService.getAll(email)
    const existingSpecies = lodash.uniq(existingAnimals.map((x) => x.species))
    const existingBreeds = lodash.uniqBy(
      existingAnimals.map((x) => ({
        name: x.breed,
        species: x.species,
      })),
      'name',
    )

    const loggedProducts: (ILoggedProduct & {productKey: string})[] = req.body
    const createdLoggedProducts: LoggedProduct[] = []

    for (const loggedProduct of loggedProducts) {
      const product = existingProducts.find((x) => x.productKey === loggedProduct.productKey)

      if (!product) {
        handleError(res, {name: 'Product not found', message: 'Product not found'})
        break
      }

      const species = existingSpecies.find((x) => x.toLowerCase().trim() === product.species?.toLowerCase())

      loggedProduct.productId = product.id

      if (species) {
        loggedProduct.species = species
      }

      const breed = existingBreeds
        .filter((x) => x.species === loggedProduct.species)
        .map((x) => x.name)
        .find((x) => x.toLowerCase().trim() === loggedProduct.breed?.toLowerCase())

      if (breed) {
        loggedProduct.breed = breed
      }

      loggedProduct.owner = email

      const newLoggedProduct = await service.create(morphLoggedProduct(loggedProduct))

      createdLoggedProducts.push(newLoggedProduct)
    }

    handleSuccess(res, createdLoggedProducts.map(morphLoggedProductDb))
  } catch (e) {
    handleError(res, e as IException)
  }
})

/*
 * GET: `/api/product/:productId/logged-product`
 * QUERY:
 *        - :productId : `641546e3e6dffedba604e2b3`
 */
router.get(`${route}/`, async (req: Request<{productId: string}>, res: Response) => {
  try {
    const email = getEmail(req, res)
    const loggedProducts = await service.getAll(email, req.params.productId)

    handleSuccess(res, loggedProducts.map(morphLoggedProductDb))
  } catch (e) {
    handleError(res, e as IException)
  }
})

/*
 * GET:   `/api/product/:productId/logged-product/:loggedProductId`
 * QUERY:
 *        - :productId : `641546e3e6dffedba604e2b3`
 *        - :loggedProductId : `641546e3e6dffedba604e2b3`
 */
router.get(
  `${route}:loggedProductId`,
  async (req: Request<{productId: string; loggedProductId: string}>, res: Response) => {
    try {
      const loggedProduct = await service.getSingle(req.params.loggedProductId)

      if (!loggedProduct) {
        handleError(res, {name: 'LoggedProduct not found', message: 'LoggedProduct not found'})
        return
      }

      handleSuccess(res, morphLoggedProductDb(loggedProduct))
    } catch (e) {
      handleError(res, e as IException)
    }
  },
)

/*
 * POST:    `/api/product/:productId/logged-product`
 * QUERY:
 *        - :productId : `641546e3e6dffedba604e2b3`
 * PAYLOAD: ILoggedProduct
 */
router.post(`${route}`, async (req: Request<{productId: string}>, res: Response) => {
  try {
    const email = getEmail(req, res)
    const newLoggedProduct: ILoggedProduct = req.body

    newLoggedProduct.owner = email
    newLoggedProduct.productId = req.params.productId

    const loggedProduct = await service.create(morphLoggedProduct(newLoggedProduct))

    handleSuccess(res, morphLoggedProductDb(loggedProduct))
  } catch (e) {
    handleError(res, e as IException)
  }
})

/*
 * POST:    `/api/product/:productId/logged-product/:loggedProductId`
 * QUERY:
 *          - :productId : `641546e3e6dffedba604e2b3`
 *          - :loggedProductId : `641546e3e6dffedba604e2b3`
 * PAYLOAD: ILoggedProduct
 */
router.post(
  `${route}/:loggedProductId`,
  async (req: Request<{productId: string; loggedProductId: string}>, res: Response) => {
    try {
      const updatedLoggedProduct: ILoggedProduct = req.body
      const id: string = req.params.loggedProductId
      let loggedProduct = await service.getSingle(id)

      if (!loggedProduct) {
        handleError(res, {name: 'LoggedProduct not found', message: 'LoggedProduct not found'})
        return
      }

      loggedProduct = {...loggedProduct, ...morphLoggedProduct(updatedLoggedProduct)}

      await service.update(id, loggedProduct)

      handleSuccess(res, morphLoggedProductDb(loggedProduct))
    } catch (e) {
      handleError(res, e as IException)
    }
  },
)

/*
 * DELETE:  `/api/product/:productId/logged-product/:loggedProductId`
 * QUERY:
 *          - :productId : `641546e3e6dffedba604e2b3`
 *          - :loggedProductId : `641546e3e6dffedba604e2b3`
 */
router.delete(
  `${route}/:loggedProductId`,
  async (req: Request<{productId: string; loggedProductId: string}>, res: Response) => {
    try {
      await service.remove(req.params.loggedProductId)

      handleSuccess(res)
    } catch (e) {
      handleError(res, e as IException)
    }
  },
)

export default router
