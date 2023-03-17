import TabNav from '@/components/TabNav'
import {getErrorMessage, setPageState} from '@/helpers'
import {IAnimalWithChildren, morphAnimalDb} from '@/pages/api/_morphs/animal.morph'
import Layout from '@/pages/_layout'
import {AnimalMetadata} from '@/types'
import {PrismaClient} from '@prisma/client'
import axios from 'axios'
import _uniq from 'lodash/uniq'
import _uniqBy from 'lodash/uniqBy'
import {useRouter} from 'next/router'
import React, {useState} from 'react'
import AnimalForm from '../_components/AnimalForm'
import OffspringTable from '../_components/OffspringTable'

interface IPageState {
  errorMessage?: string
  currentTab?: number
}

interface IEditAnimalPage {
  animal: IAnimalWithChildren
  metadata: AnimalMetadata
}

const EditAnimalPage = ({animal, metadata}: IEditAnimalPage): React.ReactElement => {
  const {push} = useRouter()
  const [pageState, stateFunc] = useState<IPageState>({
    currentTab: 1,
  })

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

  // eslint-disable-next-line no-unused-vars
  const handleSubmit = async ({children, ...data}: IAnimalWithChildren) => {
    try {
      await axios.post(`/api/animal/${data.id}`, data)
      await push('/animals')
    } catch (e) {
      setState({errorMessage: getErrorMessage(e)})
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/animal/${id}`)
      await push('/animals')
    } catch (e) {
      setState({errorMessage: getErrorMessage(e)})
    }
  }

  const handleChangeTab = (tab: number) => setState({currentTab: tab})

  return (
    <Layout
      title={`${animal.name} - Edit animal`}
      description="Update this animal"
      breadcrumbs={[
        {name: 'Animals', href: '/animals'},
        {name: animal.name, current: true},
      ]}
    >
      <div className="mt-6">
        {animal.children.length > 0 && (
          <TabNav
            tabs={[
              {id: 1, name: 'Animal'},
              {id: 2, name: 'Offspring'},
            ]}
            currentTab={pageState.currentTab}
            onChange={handleChangeTab}
          />
        )}

        {pageState.currentTab === 1 && (
          <AnimalForm
            animal={animal}
            onDelete={handleDelete}
            onSubmit={handleSubmit}
            metadata={metadata}
            errorMessage={pageState.errorMessage}
          />
        )}

        {pageState.currentTab === 2 && (
          <div className="mt-10">
            <OffspringTable children={animal.children} />
          </div>
        )}
      </div>
    </Layout>
  )
}

// noinspection JSUnusedGlobalSymbols
export async function getStaticPaths() {
  const prisma = new PrismaClient()
  const animals = await prisma.animal.findMany()
  const paths: {params: {id: string}}[] = []

  animals.forEach(({id}) => {
    paths.push({params: {id: id.toString()}})
  })

  return {
    paths,
    fallback: false,
  }
}

// noinspection JSUnusedGlobalSymbols
export const getStaticProps = async ({params}): Promise<{props: IEditAnimalPage}> => {
  const prisma = new PrismaClient()
  const animal = await prisma.animal.findFirst({where: {id: params.id}, include: {children: true}})
  const animals = await prisma.animal.findMany()

  return {
    props: {
      animal: morphAnimalDb(animal),
      metadata: {
        dbAnimals: animals
          .filter(x => x.id !== animal.id && !animal.children.map(y => y.id).includes(x.id))
          .map(x => ({
            id: x.id,
            name: x.name,
            species: x.species,
            breed: x.breed,
          })),
        dbSpecies: _uniq(animals.map(x => x.species)),
        dbBreeds: _uniqBy(
          animals.map(x => ({
            name: x.breed,
            species: x.species,
          })),
          'name',
        ),
      },
    },
  }
}

export default EditAnimalPage
