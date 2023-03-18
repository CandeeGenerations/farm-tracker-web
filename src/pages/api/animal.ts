import {IAnimal, morphAnimal, morphAnimalDb} from '@/pages/api/_morphs/animal.morph'
import {PrismaClient} from '@prisma/client'
import {NextApiRequest, NextApiResponse} from 'next'
import {getServerSession} from 'next-auth/next'
import {authOptions} from './auth/[...nextauth]'

const prisma = new PrismaClient()

// CREATE /api/animal
const handle = async (req: NextApiRequest, res: NextApiResponse): Promise<IAnimal> => {
  if (req.method !== 'POST') {
    res.status(500).send({error: 'Method not supported'})
    return
  }

  const session = await getServerSession(req, res, authOptions)
  const newAnimal: IAnimal = req.body

  newAnimal.owner = session.user.email

  const animal = await prisma.animal.create({data: morphAnimal(newAnimal)})

  res.json(morphAnimalDb(animal))
}

export default handle
