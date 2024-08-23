/* eslint-disable @typescript-eslint/no-explicit-any */
import {Animal} from '@prisma/client'
import dayjs from 'dayjs'
import morphism from 'morphism'
import {AnimalWithChildren, IAnimal, IAnimalWithChildren} from './types.js'

export const morphAnimalDb = (source: AnimalWithChildren): IAnimalWithChildren =>
  morphism.morphism(
    {
      id: ({id}: AnimalWithChildren) => id,
      name: ({name}: AnimalWithChildren) => name,
      species: ({species}: AnimalWithChildren) => species,
      breed: ({breed}: AnimalWithChildren) => breed,
      deceased: ({deceased}: AnimalWithChildren) => deceased,
      sold: ({sold}: AnimalWithChildren) => sold,
      temperament: ({temperament}: AnimalWithChildren) => temperament,
      parentId: ({parentId}: AnimalWithChildren) => parentId,
      owner: ({owner}: AnimalWithChildren) => owner,
      birthDate: ({birthDate}: AnimalWithChildren) => (birthDate ? dayjs(birthDate).format() : null),
      deceasedDate: ({deceasedDate}: AnimalWithChildren) => (deceasedDate ? dayjs(deceasedDate).format() : null),
      saleDate: ({saleDate}: AnimalWithChildren) => (saleDate ? dayjs(saleDate).format() : null),
      children: ({children}: AnimalWithChildren): any[] => (children ? children.map(morphAnimalDb) : []),
    },
    source as any,
  ) as IAnimalWithChildren

export const morphAnimal = (source: IAnimal): Animal =>
  morphism.morphism(
    {
      id: ({id}: IAnimal) => id,
      name: ({name}: IAnimal) => name.trim(),
      species: ({species}: IAnimal) => species,
      breed: ({breed}: IAnimal) => breed,
      deceased: ({deceased}: IAnimal) => deceased,
      sold: ({sold}: IAnimal) => sold,
      temperament: ({temperament}: IAnimal) => temperament,
      parentId: ({parentId}: IAnimal) => parentId,
      owner: ({owner}: IAnimal) => owner,
      birthDate: ({birthDate}: IAnimal) => (birthDate ? new Date(birthDate) : null),
      deceasedDate: ({deceasedDate}: IAnimal) => (deceasedDate ? new Date(deceasedDate) : null),
      saleDate: ({saleDate}: IAnimal) => (saleDate ? new Date(saleDate) : null),
    },
    source as any,
  ) as Animal
