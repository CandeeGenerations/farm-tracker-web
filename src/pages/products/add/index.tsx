import Card from '@/components/Card'
import TableLoader from '@/components/TableLoader'
import {getErrorMessage, setPageState} from '@/helpers'
import Layout from '@/pages/_layout'
import {IAnimal} from '@/pages/api/_morphs/animal.morph'
import axios from 'axios'
import _uniq from 'lodash/uniq'
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'
import ProductForm from '../_components/ProductForm'

interface IPageState {
  errorMessage?: string
}

const AddAnimalPage = (): React.ReactElement => {
  const {push} = useRouter()
  const [animals, setAnimals] = useState<{loading: boolean; animals: IAnimal[]}>({
    loading: true,
    animals: [],
  })
  const [pageState, stateFunc] = useState<IPageState>({})

  const getAnimals = async () => {
    const animals = await axios.get<IAnimal[]>('/api/animals')
    setAnimals({loading: false, animals: animals.data})
  }

  useEffect(() => {
    getAnimals()
  }, [])

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

  const handleSubmit = async data => {
    try {
      await axios.post(`/api/product`, data)
      await push('/products')
    } catch (e) {
      setState({errorMessage: getErrorMessage(e)})
    }
  }

  return (
    <Layout
      title="Add product"
      description="Create a new product to start tracking"
      breadcrumbs={[
        {name: 'Products', href: '/products'},
        {name: 'Add product', current: true},
      ]}
    >
      {animals.loading ? (
        <Card>
          <TableLoader />
        </Card>
      ) : (
        <ProductForm
          onSubmit={handleSubmit}
          metadata={{
            dbSpecies: _uniq(animals.animals.map(x => x.species)),
          }}
          errorMessage={pageState.errorMessage}
        />
      )}
    </Layout>
  )
}

export default AddAnimalPage
