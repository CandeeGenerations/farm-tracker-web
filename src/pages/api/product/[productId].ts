import {IProduct, morphProduct} from '@/morphs/product.morph'
import {Expense, PrismaClient, Product} from '@prisma/client'
import {NextApiRequest, NextApiResponse} from 'next'

const prisma = new PrismaClient()

// UPDATE /api/product/:productId
const handle = async (req: NextApiRequest, res: NextApiResponse): Promise<Product> => {
  const id = req.query.productId.toString()
  const updatedProduct: IProduct = req.body
  let product = await prisma.product.findUnique({where: {id}, include: {expenses: true}})

  if (!product) {
    res.status(500).send({error: 'Product not found'})
    return
  }

  if (req.method === 'DELETE') {
    await handleDelete(product, res)
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

  res.json(product)
}

// DELETE /api/product/:productId
async function handleDelete(product: Product & {expenses: Expense[]}, res: NextApiResponse): Promise<void> {
  for (const expenses of product.expenses) {
    await prisma.expense.delete({where: {id: expenses.id}})
  }

  const dbProduct = await prisma.product.delete({where: {id: product.id}})

  res.json(dbProduct)
}

// noinspection JSUnusedGlobalSymbols
export default handle
