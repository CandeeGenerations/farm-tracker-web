import {Breed} from '@/types/animal'
import {IExpense} from '@/types/expense'
import {ILoggedProduct} from '@/types/loggedProduct'

export interface IProduct {
  id: string
  productKey: string
  name: string
  species: string
  unit: string
  expenses: IExpense[]
  loggedProducts: ILoggedProduct[]
  owner: string
}

export type ProductMetadata = {
  dbSpecies: string[]
  dbBreeds?: Breed[]
  dbProducts?: IProduct[]
}
