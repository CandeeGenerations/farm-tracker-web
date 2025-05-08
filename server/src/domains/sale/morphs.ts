/* eslint-disable @typescript-eslint/no-explicit-any */
import {Sale} from '@generated/client'
import morphism from 'morphism'

import {IExternalSale} from '../product-sale/types'

export const morphExternalSale = (source: IExternalSale): Sale =>
  morphism(
    {
      productId: ({productId}: IExternalSale) => productId,
      quantity: ({quantity}: IExternalSale) => Number(quantity),
      owner: ({owner}: IExternalSale) => owner,
      customerName: ({customerName}: IExternalSale) => customerName,
      notes: ({notes}: IExternalSale) => (notes ? notes.replace(/\\n/g, '\n') : null),
      amount: ({amount}: IExternalSale) => parseFloat(amount.toString()),
      saleDate: ({saleDate}: IExternalSale) => (saleDate ? new Date(saleDate) : null),
    },
    source as any,
  ) as Sale
