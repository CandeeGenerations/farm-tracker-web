import {IProduct, morphProduct, morphProductDb} from '@/pages/api/_morphs/product.morph'
import {Expense, LoggedProduct, PrismaClient, Product} from '@prisma/client'
import {NextApiRequest, NextApiResponse} from 'next'

const prisma = new PrismaClient()

// UPDATE /api/product/:productId
const handle = async (req: NextApiRequest, res: NextApiResponse): Promise<IProduct> => {
  const id = req.query.productId.toString()
  const updatedProduct: IProduct = req.body
  let product = await prisma.product.findUnique({where: {id}, include: {expenses: true, loggedProducts: true}})

  if (!product) {
    res.status(500).send({error: 'Product not found'})
    return
  }

  if (req.method === 'DELETE') {
    await handleDelete(product, res)
    return
  }

  if (req.method === 'GET') {
    await handleGet(id, res)
    return
  }

  if (req.method !== 'POST') {
    res.status(500).send({error: 'Method not supported'})
    return
  }

  product = {...product, ...morphProduct(updatedProduct)}
  delete product.id
  delete product.expenses

  await prisma.product.update({data: product as Product, where: {id}})

  res.json(morphProductDb(product))
}

// GET /api/product/:productId
async function handleGet(id: string, res: NextApiResponse): Promise<IProduct> {
  const product = await prisma.product.findUnique({where: {id}, include: {expenses: true, loggedProducts: true}})

  if (!product) {
    res.status(500).send({error: 'Product not found'})
    return
  }

  res.json(morphProductDb(product))
}

// DELETE /api/product/:productId
async function handleDelete(
  product: Product & {expenses: Expense[]; loggedProducts: LoggedProduct[]},
  res: NextApiResponse,
): Promise<void> {
  for (const expenses of product.expenses) {
    await prisma.expense.delete({where: {id: expenses.id}})
  }

  for (const loggedProduct of product.loggedProducts) {
    await prisma.loggedProduct.delete({where: {id: loggedProduct.id}})
  }

  await prisma.product.delete({where: {id: product.id}})

  res.json({success: true})
}

export default handle
