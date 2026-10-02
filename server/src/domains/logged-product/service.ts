import {LoggedProduct} from '@generated/client'
import client from '@src/common/client'

const getAll = async (owner: string, productId: string): Promise<LoggedProduct[]> =>
  await client.loggedProduct.findMany({where: {owner, productId}})

const getSingle = async (id: string): Promise<LoggedProduct | null> =>
  await client.loggedProduct.findFirst({where: {id}})

const create = async (data: LoggedProduct): Promise<LoggedProduct> => await client.loggedProduct.create({data})

const update =
  // oxlint-disable-next-line no-unused-vars
  async (id: string, {id: _, ...data}: LoggedProduct): Promise<LoggedProduct> =>
    await client.loggedProduct.update({where: {id}, data})

const remove = async (id: string): Promise<LoggedProduct> => await client.loggedProduct.delete({where: {id}})

export default {getAll, getSingle, create, update, remove}
