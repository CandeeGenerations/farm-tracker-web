/* eslint-disable @typescript-eslint/no-explicit-any */
import {LoggedProduct} from '@prisma/client'
import dayjs from 'dayjs'
import {morphism} from 'morphism'
import {ILoggedProduct} from './types'

export const morphLoggedProductDb = (source: LoggedProduct): ILoggedProduct =>
  morphism(
    {
      id: ({id}: LoggedProduct) => id,
      productId: ({productId}: LoggedProduct) => productId,
      species: ({species}: LoggedProduct) => species,
      breed: ({breed}: LoggedProduct) => breed,
      owner: ({owner}: LoggedProduct) => owner,
      quantity: ({quantity}: LoggedProduct) => Number(quantity),
      logDate: ({logDate}: LoggedProduct) => (logDate ? dayjs(logDate).format() : null),
    },
    source as any,
  ) as ILoggedProduct

export const morphLoggedProduct = (source: ILoggedProduct): LoggedProduct =>
  morphism(
    {
      id: ({id}: ILoggedProduct) => id,
      productId: ({productId}: ILoggedProduct) => productId,
      species: ({species}: ILoggedProduct) => species,
      breed: ({breed}: ILoggedProduct) => breed,
      owner: ({owner}: ILoggedProduct) => owner,
      quantity: ({quantity}: ILoggedProduct) => Number(quantity),
      logDate: ({logDate}: ILoggedProduct) => (logDate ? new Date(logDate) : null),
    },
    source as any,
  ) as LoggedProduct
