import {IProduct} from '@/pages/api/_morphs/product.morph'
import {Animal, Expense, LoggedProduct, Product} from '@prisma/client'

export type ProductMetadata = {
  dbSpecies: string[]
  dbBreeds?: Breed[]
  dbProducts?: IProduct[]
}

export type ProductWithExpenses = {
  expenses: Expense[]
  loggedProducts: LoggedProduct[]
} & Product

export type AnimalMetadata = {
  dbAnimals: DbAnimal[]
  dbSpecies: string[]
  dbBreeds: Breed[]
}

export type Breed = {
  name: string
  species: string
}

export type DbAnimal = {
  id: string
  name: string
  species: string
  breed: string
}

export type AnimalWithChildren = {
  children?: AnimalWithChildren[]
} & Animal
