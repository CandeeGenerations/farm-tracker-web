import {IAnimal, morphAnimalDb} from '@/pages/api/_morphs/animal.morph'
import {Animal, PrismaClient} from '@prisma/client'
import {NextApiRequest, NextApiResponse} from 'next'

const prisma = new PrismaClient()

// GET /api/animals
const handle = async (req: NextApiRequest, res: NextApiResponse): Promise<IAnimal[]> => {
  if (req.method !== 'GET') {
    res.status(500).send({error: 'Method not supported'})
    return
  }

  const animals = await prisma.animal.findMany()

  res.json(animals.map(morphAnimalDb))
}

export default handle
