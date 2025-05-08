/* eslint-disable @typescript-eslint/no-explicit-any */
import {Product, Sale} from '@generated/client'
import dayjs from 'dayjs'
import morphism from 'morphism'

import {morphProductDb} from '../product/morphs'
import {IExternalSale, ISale} from './types'

export const morphSaleDb = (source: Sale & {product?: Product}): ISale =>
  morphism(
    {
      id: ({id}: Sale) => id,
      productId: ({productId}: Sale) => productId,
      quantity: ({quantity}: Sale) => Number(quantity),
      owner: ({owner}: Sale) => owner,
      customerName: ({customerName}: Sale) => customerName,
      notes: ({notes}: Sale) => notes,
      amount: ({amount}: Sale) => parseFloat(amount.toString()),
      saleDate: ({saleDate}: Sale) => (saleDate ? dayjs(saleDate).format() : null),
      product: ({product}: Sale & {product?: Product}) => (product ? morphProductDb(product) : undefined),
    },
    source as any,
  ) as ISale

export const morphSale = (source: ISale): Sale =>
  morphism(
    {
      id: ({id}: ISale) => id,
      productId: ({productId}: ISale) => productId,
      quantity: ({quantity}: ISale) => Number(quantity),
      owner: ({owner}: ISale) => owner,
      customerName: ({customerName}: ISale) => customerName,
      notes: ({notes}: ISale) => notes,
      amount: ({amount}: ISale) => parseFloat(amount.toString()),
      saleDate: ({saleDate}: ISale) => (saleDate ? new Date(saleDate) : null),
    },
    source as any,
  ) as Sale

export const morphExternalSale = (source: IExternalSale): Sale =>
  morphism(
    {
      productId: ({productId}: IExternalSale) => productId,
      quantity: ({quantity}: IExternalSale) => Number(quantity),
      owner: ({owner}: IExternalSale) => owner,
      customerName: ({customerName}: IExternalSale) => customerName,
      notes: ({notes}: IExternalSale) => notes,
      amount: ({amount}: IExternalSale) => parseFloat(amount.toString()),
      saleDate: ({saleDate}: IExternalSale) => (saleDate ? new Date(saleDate) : null),
    },
    source as any,
  ) as Sale
