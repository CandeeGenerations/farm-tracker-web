/* eslint-disable @typescript-eslint/no-explicit-any */
import {Sale} from '@prisma/client'
import dayjs from 'dayjs'
import morphism from 'morphism'
import {ISale} from './types.js'

export const morphSaleDb = (source: Sale): ISale =>
  morphism.morphism(
    {
      id: ({id}: Sale) => id,
      productId: ({productId}: Sale) => productId,
      quantity: ({quantity}: Sale) => Number(quantity),
      owner: ({owner}: Sale) => owner,
      amount: ({amount}: Sale) => parseFloat(amount.toString()),
      saleDate: ({saleDate}: Sale) => (saleDate ? dayjs(saleDate).format() : null),
    },
    source as any,
  ) as ISale

export const morphSale = (source: ISale): Sale =>
  morphism.morphism(
    {
      id: ({id}: ISale) => id,
      productId: ({productId}: ISale) => productId,
      quantity: ({quantity}: ISale) => Number(quantity),
      owner: ({owner}: ISale) => owner,
      amount: ({amount}: ISale) => parseFloat(amount.toString()),
      saleDate: ({saleDate}: ISale) => (saleDate ? new Date(saleDate) : null),
    },
    source as any,
  ) as Sale
