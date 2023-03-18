import {ILoggedProduct, morphLoggedProduct, morphLoggedProductDb} from '@/pages/api/_morphs/product.morph'
import {PrismaClient} from '@prisma/client'
import {NextApiRequest, NextApiResponse} from 'next'
import {getServerSession} from 'next-auth/next'
import {authOptions} from '../../../auth/[...nextauth]'

const prisma = new PrismaClient()

// CREATE /api/product/:productId/log
const handle = async (req: NextApiRequest, res: NextApiResponse): Promise<ILoggedProduct> => {
  if (req.method !== 'POST') {
    res.status(500).send({error: 'Method not supported'})
    return
  }

  const session = await getServerSession(req, res, authOptions)
  const productId = req.query.productId.toString()
  const newLoggedProduct: ILoggedProduct = req.body

  newLoggedProduct.owner = session.user.email

  const loggedProduct = await prisma.loggedProduct.create({data: morphLoggedProduct({...newLoggedProduct, productId})})

  res.json(morphLoggedProductDb(loggedProduct))
}

// noinspection JSUnusedGlobalSymbols
export default handle
