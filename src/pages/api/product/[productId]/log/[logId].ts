import {ILoggedProduct, morphLoggedProduct} from '@/pages/api/_morphs/product.morph'
import {LoggedProduct, PrismaClient} from '@prisma/client'
import {NextApiRequest, NextApiResponse} from 'next'

const prisma = new PrismaClient()

// UPDATE /api/product/:productId/log/:logId
const handle = async (req: NextApiRequest, res: NextApiResponse): Promise<LoggedProduct> => {
  const id = req.query.logId.toString()
  const updatedLogProduct: ILoggedProduct = req.body
  let loggedProduct = await prisma.loggedProduct.findUnique({where: {id}})

  if (!loggedProduct) {
    res.status(500).send({error: 'Logged Product not found'})
    return
  }

  if (req.method === 'DELETE') {
    await handleDelete(id, res)
    return
  }

  if (req.method !== 'POST') {
    res.status(500).send({error: 'Method not supported'})
    return
  }

  loggedProduct = {...loggedProduct, ...morphLoggedProduct(updatedLogProduct)}
  delete loggedProduct.id

  await prisma.loggedProduct.update({data: loggedProduct, where: {id}})

  res.json(loggedProduct)
}

// DELETE /api/product/:productId/log/:logId
async function handleDelete(id: string, res: NextApiResponse): Promise<void> {
  const loggedProduct = await prisma.loggedProduct.delete({where: {id}})

  res.json(loggedProduct)
}

// noinspection JSUnusedGlobalSymbols
export default handle
