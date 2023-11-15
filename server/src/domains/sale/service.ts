import {Sale} from '@prisma/client'
import client from '../../common/client.js'

const getAll = async (owner: string, productId: string): Promise<Sale[]> =>
  await client.sale.findMany({where: {owner, productId}})

const getSingle = async (id: string): Promise<Sale | null> => await client.sale.findFirst({where: {id}})

const create = async (data: Sale): Promise<Sale> => await client.sale.create({data})

const update =
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  async (id: string, {id: _, ...data}: Sale): Promise<Sale> => await client.sale.update({where: {id}, data})

const remove = async (id: string): Promise<Sale> => await client.sale.delete({where: {id}})

export default {getAll, getSingle, create, update, remove}
