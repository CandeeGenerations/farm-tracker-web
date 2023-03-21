import {generateString} from '@/helpers'
import {getUserEmail} from '@/pages/api/_common/helpers'
import {IProduct, morphProduct, morphProductDb} from '@/pages/api/_morphs/product.morph'
import {PrismaClient, Product} from '@prisma/client'
import {paramCase} from 'change-case'
import _uniq from 'lodash/uniq'
import {NextApiRequest, NextApiResponse} from 'next'

const prisma = new PrismaClient()

// CREATE /api/product/import
const handle = async (req: NextApiRequest, res: NextApiResponse): Promise<IProduct[]> => {
  if (req.method !== 'POST') {
    res.status(500).send({error: 'Method not supported'})
    return
  }

  const userEmail = await getUserEmail(req, res)
  const existingAnimals = await prisma.animal.findMany()
  const existingSpecies = _uniq(existingAnimals.map(x => x.species))

  const products: IProduct[] = req.body
  const createdProducts: Product[] = []

  for (const product of products) {
    const species = existingSpecies.find(x => x.toLowerCase().trim() === product.species.toLowerCase())

    if (species) {
      product.species = species
    }

    product.owner = userEmail

    const newProduct = await prisma.product.create({
      data: morphProduct({
        ...product,
        productKey: `${paramCase(product.name.trim())}-${generateString()}`,
        unit: product.unit.trim().toLowerCase(),
      }),
    })

    createdProducts.push(newProduct)
  }

  res.json(createdProducts.map(morphProductDb))
}

export default handle
