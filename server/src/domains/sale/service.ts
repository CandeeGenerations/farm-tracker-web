import {Sale} from '@generated/client'
import client from '@src/common/client'

const getAll = async (owner: string): Promise<Sale[]> =>
  await client.sale.findMany({where: {owner}, include: {product: true}})

const create = async (data: Sale): Promise<Sale> => await client.sale.create({data})

export default {getAll, create}
