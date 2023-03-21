import {getUserEmail} from '@/pages/api/_common/helpers'
import {IAnimal, morphAnimalDb} from '@/pages/api/_morphs/animal.morph'
import {PrismaClient} from '@prisma/client'
import {NextApiRequest, NextApiResponse} from 'next'

const prisma = new PrismaClient()

// GET /api/animals
const handle = async (req: NextApiRequest, res: NextApiResponse): Promise<IAnimal[]> => {
  if (req.method !== 'GET') {
    res.status(500).send({error: 'Method not supported'})
    return
  }

  const userEmail = await getUserEmail(req, res)

  if (!userEmail) {
    res.status(500).send({error: 'Not authenticated'})
    return
  }

  const animals = await prisma.animal.findMany({where: {owner: userEmail}})

  res.json(animals.map(morphAnimalDb))
}

export default handle
