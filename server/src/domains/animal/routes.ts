import {Animal, PrismaClient} from '@prisma/client'
import express, {Request, Response} from 'express'
import _uniq from 'lodash/uniq'
import _uniqBy from 'lodash/uniqBy'
import {getEmail, handleError, handleSuccess} from '../../common/helpers'
import {IException} from '../../types/logger'
import {morphAnimal, morphAnimalDb} from './morphs'
import service from './service'
import {IAnimal} from './types'

const prisma = new PrismaClient()

export default express
  .Router()

  /*
   * GET: `/api/animal`
   */
  .get('/', async (req: Request, res: Response) => {
    try {
      const email = getEmail(req, res)
      const animals = await service.getAll(prisma)(email)

      handleSuccess(res, animals.map(morphAnimalDb))
    } catch (e) {
      handleError(res, e as IException)
    } finally {
      await prisma.$disconnect()
    }
  })

  /*
   * GET:   `/api/animal/:animalId`
   * QUERY:
   *        - :animalId : `641546e3e6dffedba604e2b3`
   */
  .get('/:animalId', async (req: Request<{animalId: string}>, res: Response) => {
    try {
      const animal = await service.getSingle(prisma)(req.params.animalId)

      if (!animal) {
        handleError(res, {name: 'Animal not found', message: 'Animal not found'})
        return
      }

      handleSuccess(res, morphAnimalDb(animal))
    } catch (e) {
      handleError(res, e as IException)
    } finally {
      await prisma.$disconnect()
    }
  })

  /*
   * POST:    `/api/animal`
   * PAYLOAD: IAnimal
   */
  .post('/', async (req: Request, res: Response) => {
    try {
      const email = getEmail(req, res)
      const newAnimal: IAnimal = req.body

      newAnimal.owner = email

      const animal = await service.create(prisma)(morphAnimal(newAnimal))

      handleSuccess(res, morphAnimalDb(animal))
    } catch (e) {
      handleError(res, e as IException)
    } finally {
      await prisma.$disconnect()
    }
  })

  /*
   * POST:    `/api/animal/:animalId`
   * QUERY:
   *          - :animalId : `641546e3e6dffedba604e2b3`
   * PAYLOAD: IAnimal
   */
  .post('/:animalId', async (req: Request<{animalId: string}>, res: Response) => {
    try {
      const updatedAnimal: IAnimal = req.body
      const id: string = req.params.animalId
      let animal = await service.getSingle(prisma)(id)

      if (!animal) {
        handleError(res, {name: 'Animal not found', message: 'Animal not found'})
        return
      }

      animal = {...animal, ...morphAnimal(updatedAnimal)}
      delete animal.children

      await service.update(prisma)(id, animal)

      handleSuccess(res, morphAnimalDb(animal))
    } catch (e) {
      handleError(res, e as IException)
    } finally {
      await prisma.$disconnect()
    }
  })

  /*
   * POST:    `/api/animal/import`
   * PAYLOAD: IAnimal[]
   */
  .post('/import', async (req: Request, res: Response) => {
    try {
      const email = getEmail(req, res)
      const existingAnimals = await service.getAll(prisma)(email)
      const existingSpecies = _uniq(existingAnimals.map(x => x.species))
      const existingBreeds = _uniqBy(
        existingAnimals.map(x => ({
          name: x.breed,
          species: x.species,
        })),
        'name',
      )

      const animals: IAnimal[] = req.body
      const createdAnimals: Animal[] = []

      for (const animal of animals) {
        const species = existingSpecies.find(x => x.toLowerCase().trim() === animal.species.toLowerCase())

        if (species) {
          animal.species = species
        }

        const breed = existingBreeds
          .filter(x => x.species === animal.species)
          .map(x => x.name)
          .find(x => x.toLowerCase().trim() === animal.breed.toLowerCase())

        if (breed) {
          animal.breed = breed
        }

        animal.owner = email

        const newAnimal = await service.create(prisma)(morphAnimal(animal))

        createdAnimals.push(newAnimal)
      }

      handleSuccess(res, createdAnimals.map(morphAnimalDb))
    } catch (e) {
      handleError(res, e as IException)
    } finally {
      await prisma.$disconnect()
    }
  })

  /*
   * DELETE:  `/api/animal/:animalId`
   * QUERY:
   *          - :animalId : `641546e3e6dffedba604e2b3`
   */
  .delete('/:animalId', async (req: Request<{animalId: string}>, res: Response) => {
    try {
      await service.remove(prisma)(req.params.animalId)

      handleSuccess(res)
    } catch (e) {
      handleError(res, e as IException)
    } finally {
      await prisma.$disconnect()
    }
  })
