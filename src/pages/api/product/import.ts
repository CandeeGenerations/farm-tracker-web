import {IProduct, morphProduct} from '@/pages/api/_morphs/product.morph'
import {PrismaClient, Product} from '@prisma/client'
import _uniq from 'lodash/uniq'
import {NextApiRequest, NextApiResponse} from 'next'

const prisma = new PrismaClient()

// CREATE /api/product/import
const handle = async (req: NextApiRequest, res: NextApiResponse): Promise<Product[]> => {
  if (req.method !== 'POST') {
    res.status(500).send({error: 'Method not supported'})
    return
  }

  const existingAnimals = await prisma.animal.findMany()
  const existingSpecies = _uniq(existingAnimals.map(x => x.species))

  const products: IProduct[] = req.body
  const createdProducts: Product[] = []

  for (const product of products) {
    const species = existingSpecies.find(x => x.toLowerCase().trim() === product.species.toLowerCase())

    if (species) {
      product.species = species
    }

    const newProduct = await prisma.product.create({
      data: morphProduct({...product, unit: product.unit.trim().toLowerCase()}),
    })

    createdProducts.push(newProduct)
  }

  res.json(createdProducts)
}

export default handle
