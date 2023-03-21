import Card from '@/components/Card'
import TableLoader from '@/components/TableLoader'
import {getErrorMessage, setPageState} from '@/helpers'
import Layout from '@/pages/_layout'
import {IAnimalWithChildren} from '@/pages/api/_morphs/animal.morph'
import {useUser} from '@/providers/user.provider'
import axios from 'axios'
import _uniq from 'lodash/uniq'
import _uniqBy from 'lodash/uniqBy'
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'
import AnimalForm from '../_components/AnimalForm'

interface IPageState {
  errorMessage?: string
}

const AddAnimalPage = (): React.ReactElement => {
  const {push} = useRouter()
  const {attachUserEmail} = useUser()
  const [animals, setAnimals] = useState<{loading: boolean; animals: IAnimalWithChildren[]}>({
    loading: true,
    animals: [],
  })
  const [pageState, stateFunc] = useState<IPageState>({})

  const getAnimals = async () => {
    const animals = await axios.get(attachUserEmail('/api/animals'))
    setAnimals({loading: false, animals: animals.data})
  }

  useEffect(() => {
    getAnimals()
  }, [])

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

  const handleSubmit = async data => {
    try {
      await axios.post(attachUserEmail('/api/animal'), data)
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
      {animals.loading ? (
        <Card>
          <TableLoader />
        </Card>
      ) : (
        <AnimalForm
          onSubmit={handleSubmit}
          metadata={{
            dbAnimals: animals.animals.map(x => ({
              id: x.id,
              name: x.name,
              species: x.species,
              breed: x.breed,
            })),
            dbSpecies: _uniq(animals.animals.map(x => x.species)),
            dbBreeds: _uniqBy(
              animals.animals.map(x => ({
                name: x.breed,
                species: x.species,
              })),
              'name',
            ),
          }}
          errorMessage={pageState.errorMessage}
        />
      )}
    </Layout>
  )
}

export default AddAnimalPage
