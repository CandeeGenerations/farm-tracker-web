import {getUserEmail} from '@/pages/api/_common/helpers'
import {IAnimal, morphAnimal, morphAnimalDb} from '@/pages/api/_morphs/animal.morph'
import {PrismaClient} from '@prisma/client'
import {NextApiRequest, NextApiResponse} from 'next'

const prisma = new PrismaClient()

// CREATE /api/animal
const handle = async (req: NextApiRequest, res: NextApiResponse): Promise<IAnimal> => {
  if (req.method !== 'POST') {
    res.status(500).send({error: 'Method not supported'})
    return
  }

  const userEmail = await getUserEmail(req, res)
  const newAnimal: IAnimal = req.body

  newAnimal.owner = userEmail

  const animal = await prisma.animal.create({data: morphAnimal(newAnimal)})

  res.json(morphAnimalDb(animal))
}

export default handle
