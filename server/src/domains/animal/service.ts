import {Animal, PrismaClient} from '@prisma/client'
import {AnimalWithChildren} from './types'

const getAll =
  (prisma: PrismaClient) =>
  async (owner: string): Promise<Animal[]> =>
    await prisma.animal.findMany({where: {owner}})

const getSingle =
  (prisma: PrismaClient) =>
  async (id: string): Promise<AnimalWithChildren | null> =>
    await prisma.animal.findFirst({where: {id}, include: {children: true}})

const create =
  (prisma: PrismaClient) =>
  async (data: Animal): Promise<Animal> =>
    await prisma.animal.create({data})

const update =
  (prisma: PrismaClient) =>
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  async (id: string, {id: _, ...data}: Animal): Promise<Animal> =>
    await prisma.animal.update({where: {id}, data})

const remove =
  (prisma: PrismaClient) =>
  async (id: string): Promise<Animal> =>
    await prisma.animal.delete({where: {id}})

export default {getAll, getSingle, create, update, remove}
