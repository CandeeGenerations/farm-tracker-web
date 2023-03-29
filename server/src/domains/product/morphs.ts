/* eslint-disable @typescript-eslint/no-explicit-any */
import {Product} from '@prisma/client'
import {paramCase} from 'change-case'
import {morphism} from 'morphism'
import {generateString} from '../../common/helpers'
import {morphExpenseDb} from '../expense/morphs'
import {morphLoggedProductDb} from '../logged-product/morphs'
import {IProduct, ProductWithExpenses} from './types'

export const morphProductDb = (source: ProductWithExpenses): IProduct =>
  morphism(
    {
      id: ({id}: ProductWithExpenses) => id,
      productKey: ({productKey}: ProductWithExpenses) => productKey,
      name: ({name}: ProductWithExpenses) => name,
      species: ({species}: ProductWithExpenses) => species,
      unit: ({unit}: ProductWithExpenses) => unit,
      owner: ({owner}: ProductWithExpenses) => owner,
      expenses: ({expenses}: ProductWithExpenses) => (expenses || []).map(morphExpenseDb),
      loggedProducts: ({loggedProducts}: ProductWithExpenses) => (loggedProducts || []).map(morphLoggedProductDb),
    },
    source as any,
  ) as IProduct

export const morphProduct = (source: IProduct): Product =>
  morphism(
    {
      id: ({id}: IProduct) => id,
      productKey: ({productKey, name}: IProduct) => productKey || `${paramCase(name.trim())}-${generateString()}`,
      name: ({name}: IProduct) => name.trim(),
      species: ({species}: IProduct) => species,
      unit: ({unit}: IProduct) => unit.trim().toLowerCase(),
      owner: ({owner}: IProduct) => owner,
    },
    source as any,
  ) as Product
