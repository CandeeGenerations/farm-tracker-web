import {ILoggedProduct, morphLoggedProduct, morphLoggedProductDb} from '@/pages/api/_morphs/product.morph'
import {LoggedProduct, PrismaClient} from '@prisma/client'
import {NextApiRequest, NextApiResponse} from 'next'

const prisma = new PrismaClient()

// CREATE /api/product/:productId/log
const handle = async (req: NextApiRequest, res: NextApiResponse): Promise<ILoggedProduct> => {
  if (req.method !== 'POST') {
    res.status(500).send({error: 'Method not supported'})
    return
  }

  const productId = req.query.productId.toString()
  const newLoggedProduct: ILoggedProduct = req.body
  const loggedProduct = await prisma.loggedProduct.create({data: morphLoggedProduct({...newLoggedProduct, productId})})

  res.json(morphLoggedProductDb(loggedProduct))
}

// noinspection JSUnusedGlobalSymbols
export default handle
