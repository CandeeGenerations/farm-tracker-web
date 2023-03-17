import {ProductWithExpenses} from '@/types'
import {Product, Expense, LoggedProduct} from '@prisma/client'
import dayjs from 'dayjs'
import {morphism, StrictSchema} from 'morphism'

/// PRODUCT

export interface IProduct {
  id: string
  productKey: string
  name: string
  species: string
  unit: string
  expenses: IExpense[]
  loggedProducts: ILoggedProduct[]
}

const productDbToFormMap = {
  id: 'id',
  productKey: 'productKey',
  name: 'name',
  species: 'species',
  unit: 'unit',
  expenses: ({expenses}: ProductWithExpenses) => (expenses || []).map(morphExpenseDb),
  loggedProducts: ({loggedProducts}: ProductWithExpenses) => (loggedProducts || []).map(morphLoggedProductDb),
}

export const morphProductDb = (source: ProductWithExpenses) =>
  morphism<StrictSchema<IProduct, ProductWithExpenses>>(productDbToFormMap, source)

const productToDbMap = {
  id: 'id',
  productKey: 'productKey',
  name: ({name}) => name.trim(),
  species: 'species',
  unit: 'unit',
}

export const morphProduct = (source: IProduct) => morphism<StrictSchema<Product, IProduct>>(productToDbMap, source)

/// EXPENSE

export interface IExpense {
  id: string
  productId: string
  item: string
  amount: number
  quantity: number
  purchaseDate: string
}

const expenseDbToFormMap = {
  id: 'id',
  productId: 'productId',
  item: 'item',
  amount: ({amount}) => parseFloat(amount),
  quantity: 'quantity',
  purchaseDate: ({purchaseDate}: Expense) => (purchaseDate ? dayjs(purchaseDate).format() : null),
}

export const morphExpenseDb = (source: Expense) => morphism<StrictSchema<IExpense, Expense>>(expenseDbToFormMap, source)

const expenseToDbMap = {
  id: 'id',
  productId: 'productId',
  item: ({item}) => item.trim(),
  amount: 'amount',
  quantity: 'quantity',
  purchaseDate: ({purchaseDate}: IExpense) => (purchaseDate ? new Date(purchaseDate) : null),
}

export const morphExpense = (source: IExpense) => morphism<StrictSchema<Expense, IExpense>>(expenseToDbMap, source)

/// LOGGED PRODUCT

export interface ILoggedProduct {
  id: string
  productId: string
  species?: string
  breed?: string
  quantity: number
  logDate?: string
}

const loggedProductDbToFormMap = {
  id: 'id',
  productId: 'productId',
  species: 'species',
  breed: 'breed',
  quantity: ({quantity}: LoggedProduct) => Number(quantity),
  logDate: ({logDate}: LoggedProduct) => (logDate ? dayjs(logDate).format() : null),
}

export const morphLoggedProductDb = (source: LoggedProduct) =>
  morphism<StrictSchema<ILoggedProduct, LoggedProduct>>(loggedProductDbToFormMap, source)

const loggedProductToDbMap = {
  id: 'id',
  productId: 'productId',
  species: 'species',
  breed: 'breed',
  quantity: 'quantity',
  logDate: ({logDate}: ILoggedProduct) => (logDate ? new Date(logDate) : null),
}

export const morphLoggedProduct = (source: ILoggedProduct) =>
  morphism<StrictSchema<LoggedProduct, ILoggedProduct>>(loggedProductToDbMap, source)
