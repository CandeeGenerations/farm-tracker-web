import {Prisma, Product} from '@generated/client'
import client from '@src/common/client'

import {ProductWithExpenses} from './types'

const include: Prisma.ProductInclude = {expenses: true, loggedProducts: true, sales: true}

const getAll = async (owner: string): Promise<ProductWithExpenses[]> =>
  await client.product.findMany({where: {owner}, include})

const getSingle = async (id: string): Promise<ProductWithExpenses | null> =>
  await client.product.findFirst({where: {id}, include})

const getSingleByName = async (name: string): Promise<ProductWithExpenses | null> =>
  await client.product.findFirst({where: {name}, include})

const create = async (data: Product): Promise<ProductWithExpenses> => await client.product.create({data, include})

const update =
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  async (id: string, {id: _, ...data}: Product): Promise<ProductWithExpenses> =>
    await client.product.update({where: {id}, data, include})

const remove = async (id: string): Promise<ProductWithExpenses> => await client.product.delete({where: {id}, include})

export default {getAll, getSingle, getSingleByName, create, update, remove}
