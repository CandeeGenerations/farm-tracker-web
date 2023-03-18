import {ILoggedProduct, morphLoggedProductDb} from '@/pages/api/_morphs/product.morph'
import {PrismaClient} from '@prisma/client'
import {NextApiRequest, NextApiResponse} from 'next'
import {getServerSession} from 'next-auth/next'
import {authOptions} from '../../auth/[...nextauth]'

const prisma = new PrismaClient()

// GET /api/product/:productId/logs
const handle = async (req: NextApiRequest, res: NextApiResponse): Promise<ILoggedProduct[]> => {
  if (req.method !== 'GET') {
    res.status(500).send({error: 'Method not supported'})
    return
  }

  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res.status(500).send({error: 'Not authenticated'})
    return
  }

  const productId = req.query.productId.toString()
  const loggedProducts = await prisma.loggedProduct.findMany({where: {productId, owner: session.user.email}})

  res.json(loggedProducts.map(morphLoggedProductDb))
}

// noinspection JSUnusedGlobalSymbols
export default handle
