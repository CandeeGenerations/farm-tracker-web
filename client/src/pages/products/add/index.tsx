import CardLoader from '@/components/CardLoader'
import {getErrorMessage, setPageState} from '@/helpers'
import Layout from '@/pages/_layout'
import {IAnimal} from '@/types/animal'
import axios, {AxiosResponse} from 'axios'
import _uniq from 'lodash/uniq'
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'

import ProductForm from '../_components/ProductForm'

interface IPageState {
  errorMessage?: string
}

const AddProductPage = (): React.ReactElement => {
  const {push} = useRouter()
  const [animals, setAnimals] = useState<{loading: boolean; animals: IAnimal[]}>({
    loading: true,
    animals: [],
  })
  const [pageState, stateFunc] = useState<IPageState>({})

  const getAnimals = async () => {
    const animals: AxiosResponse<{data: IAnimal[]}> = await axios.get('/animal')
    setAnimals({loading: false, animals: animals.data.data})
  }

  useEffect(() => {
    getAnimals()
  }, [])

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

  const handleSubmit = async (data) => {
    try {
      await axios.post('/product', data)
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
        <CardLoader />
      ) : (
        <ProductForm
          onSubmit={handleSubmit}
          metadata={{
            dbSpecies: _uniq(animals.animals.map((x) => x.species)),
          }}
          errorMessage={pageState.errorMessage}
        />
      )}
    </Layout>
  )
}

export default AddProductPage
