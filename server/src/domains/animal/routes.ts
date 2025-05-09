import {Animal} from '@generated/client'
import {getEmail, handleError, handleSuccess} from '@src/common/helpers'
import {IException} from '@src/types/logger'
import express, {Request, Response, Router} from 'express'
import lodash from 'lodash'

import {morphAnimal, morphAnimalDb} from './morphs'
import service from './service'
import {IAnimal} from './types'

const router: Router = express.Router()

/*
 * POST:    `/api/animal/import`
 * PAYLOAD: IAnimal[]
 */
router.post('/import', async (req: Request, res: Response) => {
  try {
    const email = getEmail(req, res)
    const existingAnimals = await service.getAll(email)
    const existingSpecies = lodash.uniq(existingAnimals.map((x) => x.species))
    const existingBreeds = lodash.uniqBy(
      existingAnimals.map((x) => ({
        name: x.breed,
        species: x.species,
      })),
      'name',
    )

    const animals: IAnimal[] = req.body
    const createdAnimals: Animal[] = []

    for (const animal of animals) {
      const species = existingSpecies.find((x) => x.toLowerCase().trim() === animal.species.toLowerCase())

      if (species) {
        animal.species = species
      }

      const breed = existingBreeds
        .filter((x) => x.species === animal.species)
        .map((x) => x.name)
        .find((x) => x.toLowerCase().trim() === animal.breed.toLowerCase())

      if (breed) {
        animal.breed = breed
      }

      animal.owner = email

      const newAnimal = await service.create(morphAnimal(animal))

      createdAnimals.push(newAnimal)
    }

    handleSuccess(res, createdAnimals.map(morphAnimalDb))
  } catch (e) {
    handleError(res, e as IException)
  }
})

/*
 * GET: `/api/animal`
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const email = getEmail(req, res)
    const animals = await service.getAll(email)

    handleSuccess(res, animals.map(morphAnimalDb))
  } catch (e) {
    handleError(res, e as IException)
  }
})

/*
 * GET:   `/api/animal/:animalId`
 * QUERY:
 *        - :animalId : `641546e3e6dffedba604e2b3`
 */
router.get('/:animalId', async (req: Request<{animalId: string}>, res: Response) => {
  try {
    const animal = await service.getSingle(req.params.animalId)

    if (!animal) {
      handleError(res, {name: 'Animal not found', message: 'Animal not found'})
      return
    }

    handleSuccess(res, morphAnimalDb(animal))
  } catch (e) {
    handleError(res, e as IException)
  }
})

/*
 * POST:    `/api/animal`
 * PAYLOAD: IAnimal
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const email = getEmail(req, res)
    const newAnimal: IAnimal = req.body

    newAnimal.owner = email

    const animal = await service.create(morphAnimal(newAnimal))

    handleSuccess(res, morphAnimalDb(animal))
  } catch (e) {
    handleError(res, e as IException)
  }
})

/*
 * POST:    `/api/animal/:animalId`
 * QUERY:
 *          - :animalId : `641546e3e6dffedba604e2b3`
 * PAYLOAD: IAnimal
 */
router.post('/:animalId', async (req: Request<{animalId: string}>, res: Response) => {
  try {
    const updatedAnimal: IAnimal = req.body
    const id: string = req.params.animalId
    let animal = await service.getSingle(id)

    if (!animal) {
      handleError(res, {name: 'Animal not found', message: 'Animal not found'})
      return
    }

    animal = {...animal, ...morphAnimal(updatedAnimal)}
    delete animal.children

    await service.update(id, animal)

    handleSuccess(res, morphAnimalDb(animal))
  } catch (e) {
    handleError(res, e as IException)
  }
})

/*
 * DELETE:  `/api/animal/:animalId`
 * QUERY:
 *          - :animalId : `641546e3e6dffedba604e2b3`
 */
router.delete('/:animalId', async (req: Request<{animalId: string}>, res: Response) => {
  try {
    await service.remove(req.params.animalId)

    handleSuccess(res)
  } catch (e) {
    handleError(res, e as IException)
  }
})

export default router
