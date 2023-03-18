import {IProduct, morphProductDb} from '@/pages/api/_morphs/product.morph'
import {PrismaClient} from '@prisma/client'
import {NextApiRequest, NextApiResponse} from 'next'
import {getServerSession} from 'next-auth/next'
import {authOptions} from './auth/[...nextauth]'

const prisma = new PrismaClient()

// GET /api/products
const handle = async (req: NextApiRequest, res: NextApiResponse): Promise<IProduct[]> => {
  if (req.method !== 'GET') {
    res.status(500).send({error: 'Method not supported'})
    return
  }

  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res.status(500).send({error: 'Not authenticated'})
    return
  }

  const products = await prisma.product.findMany({
    where: {owner: session.user.email},
    include: {expenses: true, loggedProducts: true},
  })

  res.json(products.map(morphProductDb))
}

export default handle
