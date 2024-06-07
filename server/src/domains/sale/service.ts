import {Sale} from '@prisma/client'
import client from '../../common/client.js'

const getAll = async (owner: string): Promise<Sale[]> =>
  await client.sale.findMany({where: {owner}, include: {product: true}})

export default {getAll}
