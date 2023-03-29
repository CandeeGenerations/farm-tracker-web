import {Product} from '@prisma/client'
import client from '../../common/client'
import {ProductWithExpenses} from './types'

const getAll = async (owner: string): Promise<ProductWithExpenses[]> =>
  await client.product.findMany({where: {owner}, include: {expenses: true, loggedProducts: true}})

const getSingle = async (id: string): Promise<ProductWithExpenses | null> =>
  await client.product.findFirst({where: {id}, include: {expenses: true, loggedProducts: true}})

const create = async (data: Product): Promise<ProductWithExpenses> =>
  await client.product.create({data, include: {expenses: true, loggedProducts: true}})

const update =
  // eslint-disable-next-line no-unused-vars
  async (id: string, {id: _, ...data}: Product): Promise<ProductWithExpenses> =>
    await client.product.update({where: {id}, data, include: {expenses: true, loggedProducts: true}})

const remove = async (id: string): Promise<ProductWithExpenses> =>
  await client.product.delete({where: {id}, include: {expenses: true, loggedProducts: true}})

export default {getAll, getSingle, create, update, remove}
