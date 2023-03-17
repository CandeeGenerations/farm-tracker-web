import {AnimalWithChildren} from '@/types'
import {Animal} from '@prisma/client'
import dayjs from 'dayjs'
import {morphism, StrictSchema} from 'morphism'

export interface IAnimal {
  id: string
  name: string
  species: string
  breed: string
  deceased: boolean
  sold: boolean
  birthDate?: string
  deceasedDate?: string
  saleDate?: string
  parentId?: string
}

export interface IAnimalWithChildren extends IAnimal {
  children: IAnimal[]
}

const animalDbToFormMap = {
  id: 'id',
  name: 'name',
  species: 'species',
  breed: 'breed',
  deceased: 'deceased',
  sold: 'sold',
  parentId: 'parentId',
  birthDate: ({birthDate}: AnimalWithChildren) => (birthDate ? dayjs(birthDate).format() : null),
  deceasedDate: ({deceasedDate}: AnimalWithChildren) => (deceasedDate ? dayjs(deceasedDate).format() : null),
  saleDate: ({saleDate}: AnimalWithChildren) => (saleDate ? dayjs(saleDate).format() : null),
  children: ({children}: AnimalWithChildren) => (children ? children.map(morphAnimalDb) : []),
}

export const morphAnimalDb = (source: AnimalWithChildren) =>
  morphism<StrictSchema<IAnimalWithChildren, AnimalWithChildren>>(animalDbToFormMap, source)

const animalToDbMap = {
  id: 'id',
  name: ({name}: IAnimal) => name.trim(),
  species: 'species',
  breed: 'breed',
  deceased: 'deceased',
  sold: 'sold',
  parentId: 'parentId',
  birthDate: ({birthDate}: IAnimal) => (birthDate ? new Date(birthDate) : null),
  deceasedDate: ({deceasedDate}: IAnimal) => (deceasedDate ? new Date(deceasedDate) : null),
  saleDate: ({saleDate}: IAnimal) => (saleDate ? new Date(saleDate) : null),
}

export const morphAnimal = (source: IAnimal) => morphism<StrictSchema<Animal, IAnimal>>(animalToDbMap, source)
