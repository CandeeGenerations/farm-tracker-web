import {Expense, LoggedProduct, Product, Sale} from '@prisma/client'
import {Breed} from '../animal/types.js'
import {IExpense} from '../expense/types.js'
import {ILoggedProduct} from '../logged-product/types.js'
import {ISale} from '../sale/types.js'

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
