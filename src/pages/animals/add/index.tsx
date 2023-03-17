import {getErrorMessage, setPageState} from '@/helpers'
import Layout from '@/pages/_layout'
import {AnimalMetadata} from '@/types'
import {PrismaClient} from '@prisma/client'
import axios from 'axios'
import _uniq from 'lodash/uniq'
import _uniqBy from 'lodash/uniqBy'
import {useRouter} from 'next/router'
import React, {useState} from 'react'
import AnimalForm from '../_components/AnimalForm'

interface IPageState {
  errorMessage?: string
}

interface IAddAnimalPage {
  metadata: AnimalMetadata
}

const AddAnimalPage = ({metadata}: IAddAnimalPage): React.ReactElement => {
  const {push} = useRouter()
  const [pageState, stateFunc] = useState<IPageState>({})

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

  const handleSubmit = async data => {
    try {
      await axios.post(`/api/animal`, data)
      await push('/animals')
    } catch (e) {
      setState({errorMessage: getErrorMessage(e)})
    }
  }

  return (
    <Layout
      title="Add animal"
      description="Create a new animal to start tracking"
      breadcrumbs={[
        {name: 'Animals', href: '/animals'},
        {name: 'Add animal', current: true},
      ]}
    >
      <AnimalForm onSubmit={handleSubmit} metadata={metadata} errorMessage={pageState.errorMessage} />
    </Layout>
  )
}

// noinspection JSUnusedGlobalSymbols
export const getStaticProps = async (): Promise<{props: IAddAnimalPage}> => {
  const prisma = new PrismaClient()
  const animals = await prisma.animal.findMany()

  return {
    props: {
      metadata: {
        dbAnimals: animals.map(x => ({
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

export default AddAnimalPage
