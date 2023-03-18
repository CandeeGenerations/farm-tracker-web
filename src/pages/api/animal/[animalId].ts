import {IAnimal, IAnimalWithChildren, morphAnimal, morphAnimalDb} from '@/pages/api/_morphs/animal.morph'
import {Animal, PrismaClient} from '@prisma/client'
import {NextApiRequest, NextApiResponse} from 'next'

const prisma = new PrismaClient()

// UPDATE /api/animal/:animalId
const handle = async (req: NextApiRequest, res: NextApiResponse): Promise<IAnimalWithChildren> => {
  const id = req.query.animalId.toString()
  const updatedAnimal: IAnimal = req.body
  let animal = await prisma.animal.findUnique({where: {id}, include: {children: true}})

  if (!animal) {
    res.status(500).send({error: 'Animal not found'})
    return
  }

  if (req.method === 'DELETE') {
    await handleDelete(id, res)
    return
  }

  if (req.method === 'GET') {
    await handleGet(id, res)
    return
  }

  if (req.method !== 'POST') {
    res.status(500).send({error: 'Method not supported'})
    return
  }

  animal = {...animal, ...morphAnimal(updatedAnimal)}
  delete animal.id
  delete animal.children

  await prisma.animal.update({data: animal as Animal, where: {id}})

  res.json(morphAnimalDb(animal))
}

// GET /api/animal/:animalId
const handleGet = async (id: string, res: NextApiResponse): Promise<IAnimalWithChildren> => {
  const animal = await prisma.animal.findUnique({where: {id}, include: {children: true}})

  if (!animal) {
    res.status(500).send({error: 'Animal not found'})
    return
  }

  res.json(morphAnimalDb(animal))
}

// DELETE /api/animal/:animalId
async function handleDelete(id: string, res: NextApiResponse): Promise<void> {
  await prisma.animal.delete({where: {id}})

  res.json({success: true})
}

export default handle
