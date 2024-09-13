import {Expense, LoggedProduct, Product, Sale} from '@prisma/client'

import {Breed} from '../animal/types'
import {IExpense} from '../expense/types'
import {ILoggedProduct} from '../logged-product/types'
import {ISale} from '../product-sale/types'

export interface IProduct {
  id: string
  productKey: string
  name: string
  species: string
  unit: string
  expenses: IExpense[]
  loggedProducts: ILoggedProduct[]
  sales: ISale[]
  owner: string
}

export type ProductMetadata = {
  dbSpecies: string[]
  dbBreeds?: Breed[]
  dbProducts?: IProduct[]
}

export type ProductWithExpenses = {
  expenses?: Expense[]
  loggedProducts?: LoggedProduct[]
  sales?: Sale[]
} & Product
