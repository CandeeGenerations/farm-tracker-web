import Button from '@/components/Button'
import Card from '@/components/Card'
import ImportModal from '@/components/ImportModal'
import {getErrorMessage, setPageState} from '@/helpers'
import {IAnimal} from '@/types/animal'
import {ILoggedProduct} from '@/types/loggedProduct'
import {IProduct} from '@/types/product'
import {ExclamationTriangleIcon} from '@heroicons/react/24/outline'
import axios, {AxiosResponse} from 'axios'
import dayjs from 'dayjs'
import _uniqBy from 'lodash/uniqBy'
import React, {useEffect, useState} from 'react'
import Layout from '../_layout'
import LogProductModal from '../products/_components/logs/LogProductModal'

interface IPageState {
  showLoggedProductModal?: boolean
  loggedProductErrorMessage?: string
  importerOpen?: boolean
}

const HomePage = (): React.ReactElement => {
  const [products, setProducts] = useState<{loading: boolean; products: IProduct[]}>({
    loading: false,
    products: [],
  })
  const [animals, setAnimals] = useState<{loading: boolean; animals: IAnimal[]}>({
    loading: false,
    animals: [],
  })
  const [pageState, stateFunc] = useState<IPageState>({
    showLoggedProductModal: false,
    importerOpen: false,
  })

  const getProducts = async () => {
    const products: AxiosResponse<{data: IProduct[]}> = await axios.get('/product')
    setProducts({loading: false, products: products.data.data})
  }

  const getAnimals = async () => {
    const animals: AxiosResponse<{data: IAnimal[]}> = await axios.get('/animal')
    setAnimals({loading: false, animals: animals.data.data})
  }

  useEffect(() => {
    getProducts()
    getAnimals()
  }, [])

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

  const handleShowLoggedProductModal = () =>
    setState({showLoggedProductModal: true, loggedProductErrorMessage: undefined})

  const handleCloseLoggedProductModal = () =>
    setState({showLoggedProductModal: false, loggedProductErrorMessage: undefined})

  const handleCompleteLoggedProduct = async (loggedProduct: ILoggedProduct) => {
    try {
      setState({loggedProductErrorMessage: undefined})

      await axios.post(`/product/${loggedProduct.productId}/logged-product`, loggedProduct)
    } catch (e) {
      setState({loggedProductErrorMessage: getErrorMessage(e)})
    }
  }

  const handleOpenImporter = () => setState({importerOpen: true})

  const handleCloseImporter = () => setState({importerOpen: false})

  const handleImport = async (
    data: {
      productKey: string
      quantity: string
      logDate?: string
      breed?: string
    }[],
  ) => {
    const logs: (ILoggedProduct & {productKey: string})[] = []

    for (const log of data) {
      logs.push({
        id: undefined,
        productId: undefined,
        owner: undefined,
        productKey: log.productKey,
        quantity: Number(log.quantity),
        breed: log.breed,
        logDate: log.logDate ? dayjs(log.logDate).format() : dayjs().format(),
      })
    }

    await axios.post('/log/import', logs)
  }

  return (
    <Layout title="Home">
      <div className="grid grid-cols-3 gap-4 mt-12">
        <div className="col-span-2 h-96 rounded-xl border-4 border-dashed border-gray-200 p-5">
          <div className="flex flex-col items-center py-10">
            <ExclamationTriangleIcon className="w-24 h-24 text-warning mb-5" />

            <h1 className="text-3xl mb-6">Under construction</h1>

            <p className="text-muted text-center">
              We are still working on this page.
              <br />
              Check back later when this page is complete.
            </p>
          </div>
        </div>

        <div>
          <Card className="text-center">
            <h1 className="text-2xl pb-2.5">Log a product</h1>

            <p className="pb-2.5">Log a new product that is produced by something on your farm.</p>

            <Button loading={products.loading || animals.loading} type="primary" onClick={handleShowLoggedProductModal}>
              Log Product
            </Button>

            <div>
              <span
                className="text-primary-medium hover:text-primary underline cursor-pointer"
                onClick={handleOpenImporter}
              >
                Import logs
              </span>
            </div>
          </Card>
        </div>
      </div>

      <LogProductModal
        products={products.products}
        dbBreeds={_uniqBy(
          animals.animals.map(x => ({
            name: x.breed,
            species: x.species,
          })),
          'name',
        )}
        errorMessage={pageState.loggedProductErrorMessage}
        open={pageState.showLoggedProductModal}
        onClose={handleCloseLoggedProductModal}
        onSubmit={handleCompleteLoggedProduct}
      />

      <ImportModal
        type="product logs"
        headers={['productKey', 'quantity', 'logDate', 'breed']}
        open={pageState.importerOpen}
        onClose={handleCloseImporter}
        onSave={handleImport}
        notReloading
      />
    </Layout>
  )
}

export default HomePage
