import {IAnimal, morphAnimal} from '@/morphs/animal.morph'
import {Animal, PrismaClient} from '@prisma/client'
import {NextApiRequest, NextApiResponse} from 'next'

const prisma = new PrismaClient()

// CREATE /api/animal
const handle = async (req: NextApiRequest, res: NextApiResponse): Promise<Animal> => {
  if (req.method !== 'POST') {
    res.status(500).send({error: 'Method not supported'})
    return
  }

  const newAnimal: IAnimal = req.body
  const animal = await prisma.animal.create({data: morphAnimal(newAnimal)})

  res.json(animal)
}

export default handle
