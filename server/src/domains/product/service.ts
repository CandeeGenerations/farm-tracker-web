import {PrismaClient, Product} from '@prisma/client'
import {ProductWithExpenses} from './types'

const getAll =
  (prisma: PrismaClient) =>
  async (owner: string): Promise<ProductWithExpenses[]> =>
    await prisma.product.findMany({where: {owner}, include: {expenses: true, loggedProducts: true}})

const getSingle =
  (prisma: PrismaClient) =>
  async (id: string): Promise<ProductWithExpenses | null> =>
    await prisma.product.findFirst({where: {id}, include: {expenses: true, loggedProducts: true}})

const create =
  (prisma: PrismaClient) =>
  async (data: Product): Promise<ProductWithExpenses> =>
    await prisma.product.create({data, include: {expenses: true, loggedProducts: true}})

const update =
  (prisma: PrismaClient) =>
  // eslint-disable-next-line no-unused-vars
  async (id: string, {id: _, ...data}: Product): Promise<ProductWithExpenses> =>
    await prisma.product.update({where: {id}, data, include: {expenses: true, loggedProducts: true}})

const remove =
  (prisma: PrismaClient) =>
  async (id: string): Promise<ProductWithExpenses> =>
    await prisma.product.delete({where: {id}, include: {expenses: true, loggedProducts: true}})

export default {getAll, getSingle, create, update, remove}
