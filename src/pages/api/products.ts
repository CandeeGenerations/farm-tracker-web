import {IProduct, morphProductDb} from '@/pages/api/_morphs/product.morph'
import {PrismaClient, Product} from '@prisma/client'
import {NextApiRequest, NextApiResponse} from 'next'

const prisma = new PrismaClient()

// GET /api/products
const handle = async (req: NextApiRequest, res: NextApiResponse): Promise<IProduct[]> => {
  if (req.method !== 'GET') {
    res.status(500).send({error: 'Method not supported'})
    return
  }

  const products = await prisma.product.findMany({include: {expenses: true, loggedProducts: true}})

  res.json(products.map(morphProductDb))
}

export default handle
