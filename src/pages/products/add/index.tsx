import {getErrorMessage, setPageState} from '@/helpers'
import Layout from '@/pages/_layout'
import {ProductMetadata} from '@/types'
import {PrismaClient} from '@prisma/client'
import axios from 'axios'
import _uniq from 'lodash/uniq'
import {useRouter} from 'next/router'
import React, {useState} from 'react'
import ProductForm from '../_components/ProductForm'

interface IPageState {
  errorMessage?: string
}

interface IAddProductPage {
  metadata: ProductMetadata
}

const AddAnimalPage = ({metadata}: IAddProductPage): React.ReactElement => {
  const {push} = useRouter()
  const [pageState, stateFunc] = useState<IPageState>({})

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
      <ProductForm onSubmit={handleSubmit} metadata={metadata} errorMessage={pageState.errorMessage} />
    </Layout>
  )
}

// noinspection JSUnusedGlobalSymbols
export const getStaticProps = async (): Promise<{props: IAddProductPage}> => {
  const prisma = new PrismaClient()
  const animals = await prisma.animal.findMany()

  return {
    props: {
      metadata: {
        dbSpecies: _uniq(animals.map(x => x.species)),
      },
    },
  }
}

export default AddAnimalPage
