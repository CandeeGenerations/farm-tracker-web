/* eslint-disable @typescript-eslint/no-explicit-any */
import {Product} from '@prisma/client'
import {generateString} from '@src/common/helpers.js'
import {kebabCase} from 'change-case-all'
import morphism from 'morphism'

import {morphExpenseDb} from '../expense/morphs.js'
import {morphLoggedProductDb} from '../logged-product/morphs.js'
import {morphSaleDb} from '../product-sale/morphs.js'
import {IProduct, ProductWithExpenses} from './types.js'

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
