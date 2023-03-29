import {LoggedProduct, PrismaClient} from '@prisma/client'

const getAll =
  (prisma: PrismaClient) =>
  async (owner: string, productId: string): Promise<LoggedProduct[]> =>
    await prisma.loggedProduct.findMany({where: {owner, productId}})

const getSingle =
  (prisma: PrismaClient) =>
  async (id: string): Promise<LoggedProduct | null> =>
    await prisma.loggedProduct.findFirst({where: {id}})

const create =
  (prisma: PrismaClient) =>
  async (data: LoggedProduct): Promise<LoggedProduct> =>
    await prisma.loggedProduct.create({data})

const update =
  (prisma: PrismaClient) =>
  // eslint-disable-next-line no-unused-vars
  async (id: string, {id: _, ...data}: LoggedProduct): Promise<LoggedProduct> =>
    await prisma.loggedProduct.update({where: {id}, data})

const remove =
  (prisma: PrismaClient) =>
  async (id: string): Promise<LoggedProduct> =>
    await prisma.loggedProduct.delete({where: {id}})

export default {getAll, getSingle, create, update, remove}
