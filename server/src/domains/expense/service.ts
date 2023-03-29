import {Expense, PrismaClient} from '@prisma/client'

const getAll =
  (prisma: PrismaClient) =>
  async (owner: string, productId: string): Promise<Expense[]> =>
    await prisma.expense.findMany({where: {owner, productId}})

const getSingle =
  (prisma: PrismaClient) =>
  async (id: string): Promise<Expense | null> =>
    await prisma.expense.findFirst({where: {id}})

const create =
  (prisma: PrismaClient) =>
  async (data: Expense): Promise<Expense> =>
    await prisma.expense.create({data})

const update =
  (prisma: PrismaClient) =>
  // eslint-disable-next-line no-unused-vars
  async (id: string, {id: _, ...data}: Expense): Promise<Expense> =>
    await prisma.expense.update({where: {id}, data})

const remove =
  (prisma: PrismaClient) =>
  async (id: string): Promise<Expense> =>
    await prisma.expense.delete({where: {id}})

export default {getAll, getSingle, create, update, remove}
