import CardLoader from '@/components/CardLoader'
import TabNav from '@/components/TabNav'
import {getErrorMessage, setPageState} from '@/helpers'
import Layout from '@/pages/_layout'
import {IAnimalWithChildren} from '@/types/animal'
import axios, {AxiosResponse} from 'axios'
import _uniq from 'lodash/uniq'
import _uniqBy from 'lodash/uniqBy'
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'

import AnimalForm from '../_components/AnimalForm'
import OffspringTable from '../_components/OffspringTable'

interface IPageState {
  errorMessage?: string
  currentTab?: number
}

const EditAnimalPage = (): React.ReactElement => {
  const {push, query} = useRouter()
  const [animals, setAnimals] = useState<{loading: boolean; animals: IAnimalWithChildren[]}>({
    loading: true,
    animals: [],
  })
  const [animal, setAnimal] = useState<{loading: boolean; animal: IAnimalWithChildren}>({
    loading: true,
    animal: undefined,
  })
  const [pageState, stateFunc] = useState<IPageState>({
    currentTab: 1,
  })

  const getAnimal = async (id) => {
    const animal: AxiosResponse<{data: IAnimalWithChildren}> = await axios.get(`/animal/${id}`)
    setAnimal({loading: false, animal: animal.data.data})
  }

  const getAnimals = async () => {
    const animals: AxiosResponse<{data: IAnimalWithChildren[]}> = await axios.get('/animal')
    setAnimals({loading: false, animals: animals.data.data})
  }

  useEffect(() => {
    if (query.id) {
      getAnimal(query.id)
    }

    getAnimals()
    setState({currentTab: 1})
  }, [query.id])

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const handleSubmit = async ({children, ...data}: IAnimalWithChildren) => {
    try {
      await axios.post(`/animal/${data.id}`, data)
      await push('/animals')
    } catch (e) {
      setState({errorMessage: getErrorMessage(e)})
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/animal/${id}`)
      await push('/animals')
    } catch (e) {
      setState({errorMessage: getErrorMessage(e)})
    }
  }

  const handleChangeTab = (tab: number) => setState({currentTab: tab})

  return (
    <Layout
      title={`${animal.animal?.name || 'Loading...'} - Edit animal`}
      description="Update this animal"
      breadcrumbs={[
        {name: 'Animals', href: '/animals'},
        {name: animal.animal?.name, current: true},
      ]}
    >
      {animal.loading || animals.loading ? (
        <CardLoader />
      ) : (
        <div className="mt-6">
          {animal.animal.children.length > 0 && (
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
              animal={animal.animal}
              onDelete={handleDelete}
              onSubmit={handleSubmit}
              metadata={{
                dbAnimals: animals.animals
                  .filter((x) => x.id !== animal.animal.id && !animal.animal.children.map((y) => y.id).includes(x.id))
                  .map((x) => ({
                    id: x.id,
                    name: x.name,
                    species: x.species,
                    breed: x.breed,
                  })),
                dbSpecies: _uniq(animals.animals.map((x) => x.species)),
                dbBreeds: _uniqBy(
                  animals.animals.map((x) => ({
                    name: x.breed,
                    species: x.species,
                  })),
                  'name',
                ),
              }}
              errorMessage={pageState.errorMessage}
            />
          )}

          {pageState.currentTab === 2 && (
            <div className="mt-10">
              <OffspringTable offspring={animal.animal.children || []} />
            </div>
          )}
        </div>
      )}
    </Layout>
  )
}

export default EditAnimalPage
