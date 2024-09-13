import {Animal} from '@prisma/client'
import client from '@src/common/client.js'

import {AnimalWithChildren} from './types.js'

const getAll = async (owner: string): Promise<Animal[]> => await client.animal.findMany({where: {owner}})

const getSingle = async (id: string): Promise<AnimalWithChildren | null> =>
  await client.animal.findFirst({where: {id}, include: {children: true}})

const create = async (data: Animal): Promise<Animal> => await client.animal.create({data})

const update =
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  async (id: string, {id: _, ...data}: Animal): Promise<Animal> => await client.animal.update({where: {id}, data})

const remove = async (id: string): Promise<Animal> => await client.animal.delete({where: {id}})

export default {getAll, getSingle, create, update, remove}
