import {Animal} from '@generated/client'

export interface IAnimal {
  id: string
  name: string
  species: string
  breed: string
  temperament?: string
  deceased: boolean
  sold: boolean
  birthDate?: string
  deceasedDate?: string
  saleDate?: string
  parentId?: string
  owner: string
  tags?: string[]
}

export interface IAnimalWithChildren extends IAnimal {
  children: IAnimal[]
}

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
