import CardLoader from '@/components/CardLoader'
import TabNav from '@/components/TabNav'
import {getErrorMessage, setPageState} from '@/helpers'
import ExpensesPage from '@/pages/products/_components/expenses'
import LoggedProductsPage from '@/pages/products/_components/logs'
import SalesPage from '@/pages/products/_components/sales'
import {IAnimal} from '@/types/animal'
import {IProduct} from '@/types/product'
import Layout from '@src/_layout'
import axios, {AxiosResponse} from 'axios'
import _uniq from 'lodash/uniq'
import _uniqBy from 'lodash/uniqBy'
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'

import ProductForm from '../_components/ProductForm'

interface IPageState {
  errorMessage?: string
  currentTab?: number
}

const EditProductPage = (): React.ReactElement => {
  const router = useRouter()
  const [product, setProduct] = useState<{loading: boolean; product: IProduct}>({loading: true, product: undefined})
  const [products, setProducts] = useState<{loading: boolean; products: IProduct[]}>({loading: true, products: []})
  const [animals, setAnimals] = useState<{loading: boolean; animals: IAnimal[]}>({loading: true, animals: []})
  const [pageState, stateFunc] = useState<IPageState>({
    currentTab: 1,
  })

  const getProduct = async (id) => {
    setProduct({loading: true, product: product.product})
    const result: AxiosResponse<{data: IProduct}> = await axios.get(`/product/${id}`)
    setProduct({loading: false, product: result.data.data})
  }

  const getProducts = async () => {
    const result: AxiosResponse<{data: IProduct[]}> = await axios.get('/product')
    setProducts({loading: false, products: result.data.data})
  }

  const getAnimals = async () => {
    const result: AxiosResponse<{data: IAnimal[]}> = await axios.get('/animal')
    setAnimals({loading: false, animals: result.data.data})
  }

  useEffect(() => {
    if (router.query.id) {
      getProduct(router.query.id)
    }

    getProducts()
    getAnimals()
  }, [router.query.id])

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

  const handleSubmit = async (data: IProduct) => {
    try {
      await axios.post(`/product/${data.id}`, data)
      await router.push('/products')
    } catch (e) {
      setState({errorMessage: getErrorMessage(e)})
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/product/${id}`)
      await router.push('/products')
    } catch (e) {
      setState({errorMessage: getErrorMessage(e)})
    }
  }

  const handleChangeTab = async (tab: number) => {
    if (tab === 1 && router.query.id) {
      await getProduct(router.query.id)
    }

    setState({currentTab: tab})
  }

  return (
    <Layout
      title={`${product.product?.name || 'Loading...'} - Edit product`}
      description="Update this product"
      breadcrumbs={[
        {name: 'Products', href: '/products'},
        {name: product.product?.name, current: true},
      ]}
    >
      {products.loading || product.loading || animals.loading ? (
        <CardLoader />
      ) : (
        <div className="mt-6">
          <TabNav
            tabs={[
              {id: 1, name: 'Product'},
              {id: 2, name: 'Logs'},
              {id: 3, name: 'Expenses'},
              {id: 4, name: 'Sales'},
            ]}
            currentTab={pageState.currentTab}
            onChange={handleChangeTab}
          />

          {pageState.currentTab === 1 && (
            <ProductForm
              product={product.product}
              onDelete={handleDelete}
              onSubmit={handleSubmit}
              metadata={{
                dbProducts: products.products,
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
            <LoggedProductsPage
              product={product.product}
              products={products.products}
              breeds={_uniqBy(
                animals.animals
                  .filter((x) => !x.deceased && !x.sold)
                  .map((x) => ({
                    name: x.breed,
                    species: x.species,
                  })),
                'name',
              )}
            />
          )}

          {pageState.currentTab === 3 && <ExpensesPage product={product.product} />}

          {pageState.currentTab === 4 && <SalesPage product={product.product} />}
        </div>
      )}
    </Layout>
  )
}

export default EditProductPage
