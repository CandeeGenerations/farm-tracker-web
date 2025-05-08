/* eslint-disable @typescript-eslint/no-explicit-any */
import {Product} from '@generated/client'
import {generateString} from '@src/common/helpers'
import {kebabCase} from 'change-case-all'
import morphism from 'morphism'

import {morphExpenseDb} from '../expense/morphs'
import {morphLoggedProductDb} from '../logged-product/morphs'
import {morphSaleDb} from '../product-sale/morphs'
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
      sales: ({sales}: ProductWithExpenses) => (sales || []).map(morphSaleDb),
    },
    source as any,
  ) as IProduct

export const morphProduct = (source: IProduct): Product =>
  morphism(
    {
      id: ({id}: IProduct) => id,
      productKey: ({productKey, name}: IProduct) => {
        let end = generateString()

        if (productKey) {
          const productKeyParts = productKey.split('-')

          end = productKeyParts[productKeyParts.length - 1]
        }

        return `${kebabCase(name.trim())}-${end}`
      },
      name: ({name}: IProduct) => name.trim(),
      species: ({species}: IProduct) => species,
      unit: ({unit}: IProduct) => unit.trim().toLowerCase(),
      owner: ({owner}: IProduct) => owner,
    },
    source as any,
  ) as Product
