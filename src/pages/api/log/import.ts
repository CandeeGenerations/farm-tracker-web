import {ILoggedProduct, morphLoggedProduct} from '@/pages/api/_morphs/product.morph'
import {LoggedProduct, PrismaClient} from '@prisma/client'
import _uniq from 'lodash/uniq'
import _uniqBy from 'lodash/uniqBy'
import {NextApiRequest, NextApiResponse} from 'next'

const prisma = new PrismaClient()

// CREATE /api/log/import
const handle = async (req: NextApiRequest, res: NextApiResponse): Promise<LoggedProduct[]> => {
  if (req.method !== 'POST') {
    res.status(500).send({error: 'Method not supported'})
    return
  }

  const existingProducts = await prisma.product.findMany()
  const existingAnimals = await prisma.animal.findMany()
  const existingSpecies = _uniq(existingAnimals.map(x => x.species))
  const existingBreeds = _uniqBy(
    existingAnimals.map(x => ({
      name: x.breed,
      species: x.species,
    })),
    'name',
  )

  const loggedProducts: (ILoggedProduct & {productKey: string})[] = req.body
  const createdLoggedProducts: LoggedProduct[] = []

  for (const loggedProduct of loggedProducts) {
    const product = existingProducts.find(x => x.productKey === loggedProduct.productKey)
    const species = existingSpecies.find(x => x.toLowerCase().trim() === product.species?.toLowerCase())

    loggedProduct.productId = product.id

    if (species) {
      loggedProduct.species = species
    }

    const breed = existingBreeds
      .filter(x => x.species === loggedProduct.species)
      .map(x => x.name)
      .find(x => x.toLowerCase().trim() === loggedProduct.breed?.toLowerCase())

    if (breed) {
      loggedProduct.breed = breed
    }

    const newLoggedProduct = await prisma.loggedProduct.create({data: morphLoggedProduct(loggedProduct)})

    createdLoggedProducts.push(newLoggedProduct)
  }

  res.json(createdLoggedProducts)
}

export default handle
