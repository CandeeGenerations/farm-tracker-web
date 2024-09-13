/* eslint-disable @typescript-eslint/no-explicit-any */
import {Expense} from '@prisma/client'
import dayjs from 'dayjs'
import morphism from 'morphism'

import {IExpense} from './types.js'

export const morphExpenseDb = (source: Expense): IExpense =>
  morphism(
    {
      id: ({id}: Expense) => id,
      productId: ({productId}: Expense) => productId,
      item: ({item}: Expense) => item,
      quantity: ({quantity}: Expense) => Number(quantity),
      owner: ({owner}: Expense) => owner,
      amount: ({amount}: Expense) => parseFloat(amount.toString()),
      purchaseDate: ({purchaseDate}: Expense) => (purchaseDate ? dayjs(purchaseDate).format() : null),
    },
    source as any,
  ) as IExpense

export const morphExpense = (source: IExpense): Expense =>
  morphism(
    {
      id: ({id}: IExpense) => id,
      productId: ({productId}: IExpense) => productId,
      item: ({item}: IExpense) => item.trim(),
      quantity: ({quantity}: IExpense) => Number(quantity),
      owner: ({owner}: IExpense) => owner,
      amount: ({amount}: IExpense) => parseFloat(amount.toString()),
      purchaseDate: ({purchaseDate}: IExpense) => (purchaseDate ? new Date(purchaseDate) : null),
    },
    source as any,
  ) as Expense
