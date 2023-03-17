import Button from '@/components/Button'
import Card from '@/components/Card'
import ImportModal from '@/components/ImportModal'
import {getErrorMessage, setPageState} from '@/helpers'
import {ILoggedProduct, IProduct, morphProductDb} from '@/morphs/product.morph'
import Layout from '@/pages/_layout'
import LogProductModal from '@/pages/products/_components/LogProductModal'
import {Breed} from '@/types'
import {ExclamationTriangleIcon} from '@heroicons/react/24/outline'
import {PrismaClient} from '@prisma/client'
import axios from 'axios'
import dayjs from 'dayjs'
import _uniqBy from 'lodash/uniqBy'
import React, {useState} from 'react'

interface IHomePage {
  products: IProduct[]
  dbBreeds: Breed[]
}

interface IPageState {
  showLoggedProductModal?: boolean
  loggedProductErrorMessage?: string
  importerOpen?: boolean
}

const HomePage = (props: IHomePage): React.ReactElement => {
  const [pageState, stateFunc] = useState<IPageState>({
    showLoggedProductModal: false,
    importerOpen: false,
  })

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

  const handleShowLoggedProductModal = () =>
    setState({showLoggedProductModal: true, loggedProductErrorMessage: undefined})

  const handleCloseLoggedProductModal = () =>
    setState({showLoggedProductModal: false, loggedProductErrorMessage: undefined})

  const handleCompleteLoggedProduct = async (loggedProduct: ILoggedProduct) => {
    try {
      setState({loggedProductErrorMessage: undefined})

      await axios.post(`/api/product/${loggedProduct.productId}/log`, loggedProduct)
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
        productKey: log.productKey,
        quantity: Number(log.quantity),
        breed: log.breed,
        logDate: log.logDate ? dayjs(log.logDate).format() : dayjs().format(),
      })
    }

    await axios.post(`/api/log/import`, logs)
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

            <Button type="primary" onClick={handleShowLoggedProductModal}>
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
        {...props}
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

export const getStaticProps = async (): Promise<{props: IHomePage}> => {
  const prisma = new PrismaClient()
  const products = await prisma.product.findMany()
  const animals = await prisma.animal.findMany()

  return {
    props: {
      products: products.map(morphProductDb),
      dbBreeds: _uniqBy(
        animals.map(x => ({
          name: x.breed,
          species: x.species,
        })),
        'name',
      ),
    },
  }
}

export default HomePage
