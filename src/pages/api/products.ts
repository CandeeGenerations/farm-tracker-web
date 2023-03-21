import {getUserEmail} from '@/pages/api/_common/helpers'
import {IProduct, morphProductDb} from '@/pages/api/_morphs/product.morph'
import {PrismaClient} from '@prisma/client'
import {NextApiRequest, NextApiResponse} from 'next'

const prisma = new PrismaClient()

// GET /api/products
const handle = async (req: NextApiRequest, res: NextApiResponse): Promise<IProduct[]> => {
  if (req.method !== 'GET') {
    res.status(500).send({error: 'Method not supported'})
    return
  }

  const userEmail = await getUserEmail(req, res)

  if (!userEmail) {
    res.status(500).send({error: 'Not authenticated'})
    return
  }

  const products = await prisma.product.findMany({
    where: {owner: userEmail},
    include: {expenses: true, loggedProducts: true},
  })

  res.json(products.map(morphProductDb))
}

export default handle
