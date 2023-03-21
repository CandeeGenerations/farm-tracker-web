import {getUserEmail} from '@/pages/api/_common/helpers'
import {ILoggedProduct, morphLoggedProductDb} from '@/pages/api/_morphs/product.morph'
import {PrismaClient} from '@prisma/client'
import {NextApiRequest, NextApiResponse} from 'next'

const prisma = new PrismaClient()

// GET /api/product/:productId/logs
const handle = async (req: NextApiRequest, res: NextApiResponse): Promise<ILoggedProduct[]> => {
  if (req.method !== 'GET') {
    res.status(500).send({error: 'Method not supported'})
    return
  }

  const userEmail = await getUserEmail(req, res)

  if (!userEmail) {
    res.status(500).send({error: 'Not authenticated'})
    return
  }

  const productId = req.query.productId.toString()
  const loggedProducts = await prisma.loggedProduct.findMany({where: {productId, owner: userEmail}})

  res.json(loggedProducts.map(morphLoggedProductDb))
}

// noinspection JSUnusedGlobalSymbols
export default handle
