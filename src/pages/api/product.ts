import {IProduct, morphProductDb} from '@/pages/api/_morphs/product.morph'
import {PrismaClient, Product} from '@prisma/client'
import {paramCase} from 'change-case'
import {NextApiRequest, NextApiResponse} from 'next'
import {generateString} from '@/helpers'

const prisma = new PrismaClient()

// CREATE /api/product
const handle = async (req: NextApiRequest, res: NextApiResponse): Promise<IProduct> => {
  if (req.method !== 'POST') {
    res.status(500).send({error: 'Method not supported'})
    return
  }

  const newProduct: Product = req.body
  const product = await prisma.product.create({
    data: {
      ...newProduct,
      name: newProduct.name.trim(),
      productKey: `${paramCase(newProduct.name.trim())}-${generateString()}`,
    },
    include: {expenses: true, loggedProducts: true},
  })

  res.json(morphProductDb(product))
}

export default handle
