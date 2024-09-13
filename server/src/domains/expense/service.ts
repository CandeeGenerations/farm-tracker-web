import {Expense} from '@prisma/client'
import client from '@src/common/client.js'

const getAll = async (owner: string, productId: string): Promise<Expense[]> =>
  await client.expense.findMany({where: {owner, productId}})

const getSingle = async (id: string): Promise<Expense | null> => await client.expense.findFirst({where: {id}})

const create = async (data: Expense): Promise<Expense> => await client.expense.create({data})

const update =
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  async (id: string, {id: _, ...data}: Expense): Promise<Expense> => await client.expense.update({where: {id}, data})

const remove = async (id: string): Promise<Expense> => await client.expense.delete({where: {id}})

export default {getAll, getSingle, create, update, remove}
