import {getUserEmail} from '@/pages/api/_common/helpers'
import {IAnimal, morphAnimal, morphAnimalDb} from '@/pages/api/_morphs/animal.morph'
import {Animal, PrismaClient} from '@prisma/client'
import _uniq from 'lodash/uniq'
import _uniqBy from 'lodash/uniqBy'
import {NextApiRequest, NextApiResponse} from 'next'

const prisma = new PrismaClient()

// CREATE /api/animal/import
const handle = async (req: NextApiRequest, res: NextApiResponse): Promise<IAnimal[]> => {
  if (req.method !== 'POST') {
    res.status(500).send({error: 'Method not supported'})
    return
  }

  const userEmail = await getUserEmail(req, res)
  const existingAnimals = await prisma.animal.findMany()
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

    animal.owner = userEmail

    const newAnimal = await prisma.animal.create({data: morphAnimal(animal)})

    createdAnimals.push(newAnimal)
  }

  res.json(createdAnimals.map(morphAnimalDb))
}

export default handle
