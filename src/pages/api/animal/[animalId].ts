import {IAnimal, morphAnimal} from '@/pages/api/_morphs/animal.morph'
import {Animal, PrismaClient} from '@prisma/client'
import {NextApiRequest, NextApiResponse} from 'next'

const prisma = new PrismaClient()

// UPDATE /api/animal/:animalId
const handle = async (req: NextApiRequest, res: NextApiResponse): Promise<Animal> => {
  const id = req.query.animalId.toString()
  const updatedAnimal: IAnimal = req.body
  let animal = await prisma.animal.findUnique({where: {id}})

  if (!animal) {
    res.status(500).send({error: 'Animal not found'})
    return
  }

  if (req.method === 'DELETE') {
    await handleDelete(id, res)
    return
  }

  if (req.method !== 'POST') {
    res.status(500).send({error: 'Method not supported'})
    return
  }

  animal = {...animal, ...morphAnimal(updatedAnimal)}
  delete animal.id

  await prisma.animal.update({data: animal, where: {id}})

  res.json(animal)
}

// DELETE /api/animal/:animalId
async function handleDelete(id: string, res: NextApiResponse): Promise<void> {
  const animal = await prisma.animal.delete({where: {id}})

  res.json(animal)
}

// noinspection JSUnusedGlobalSymbols
export default handle
