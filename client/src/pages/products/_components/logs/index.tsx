import Button from '@/components/Button'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'
import EmptyState from '@/components/EmptyState'
import ImportModal from '@/components/ImportModal'
import TableLoader from '@/components/TableLoader'
import {getErrorMessage, setPageState} from '@/helpers'
import LogProductModal from '@/pages/products/_components/logs/LogProductModal'
import LogsTable from '@/pages/products/_components/logs/LogsTable'
import {Breed} from '@/types/animal'
import {ILoggedProduct} from '@/types/loggedProduct'
import {IProduct} from '@/types/product'
import axios, {AxiosResponse} from 'axios'
import dayjs from 'dayjs'
import React, {useState} from 'react'
import Chart from '../_Chart'

interface IPageState {
  loggedProducts?: ILoggedProduct[]
  loggedProduct?: ILoggedProduct
  errorMessage?: string
  showModal?: boolean
  showDeleteModal?: boolean
  deleteLoading?: boolean
  deleteId?: string
  loading?: boolean
}

interface ILoggedProductsPage {
  product: IProduct
  products: IProduct[]
  breeds: Breed[]
}

const LoggedProductsPage = ({product, products, breeds}: ILoggedProductsPage): React.ReactElement => {
  const [loggedProductImportModalOpen, setLoggedProductImportModalOpen] = useState<boolean>(false)
  const [pageState, stateFunc] = useState<IPageState>({
    loggedProducts: product.loggedProducts || [],
    showModal: false,
    showDeleteModal: false,
    deleteLoading: false,
    loading: false,
  })

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

  const handleLoadLoggedProducts = async () => {
    setState({loading: true})

    try {
      const {data}: AxiosResponse<{data: ILoggedProduct[]}> = await axios.get(`/product/${product.id}/logged-product`)
      setState({
        loggedProducts: data.data,
        ...{
          showModal: false,
          loading: false,
          deleteId: undefined,
          deleteLoading: false,
          showDeleteModal: false,
        },
      })
    } catch (e) {
      setState({errorMessage: getErrorMessage(e)})
    }
  }

  const handleShowLoggedProductModal = (loggedProduct?: ILoggedProduct) =>
    setState({showModal: true, errorMessage: undefined, loggedProduct})

  const handleCloseLoggedProductModal = () => setState({showModal: false})

  const handleCompleteLoggedProduct = async (loggedProduct: ILoggedProduct) => {
    try {
      await axios.post(
        `/product/${loggedProduct.productId}/logged-product${loggedProduct.id ? `/${loggedProduct.id}` : ''}`,
        loggedProduct,
      )
      await handleLoadLoggedProducts()
    } catch (e) {
      setState({errorMessage: getErrorMessage(e)})
    }
  }

  const handleShowDeleteLoggedProductModal = (deleteId: string) => setState({showDeleteModal: true, deleteId})

  const handleCloseDeleteLoggedProductModal = () => setState({showDeleteModal: false, deleteId: undefined})

  const handleDeleteLoggedProduct = async () => {
    setState({deleteLoading: true})

    const stateUpdate = {
      showDeleteModal: false,
      deleteId: undefined,
    }

    try {
      await axios.delete(`/product/${product.id}/logged-product/${pageState.deleteId}`)
      await handleLoadLoggedProducts()
    } catch (e) {
      setState({errorMessage: getErrorMessage(e), ...stateUpdate})
    }
  }

  const handleOpenLoggedProductImporter = () => setLoggedProductImportModalOpen(true)

  const handleCloseLoggedProductImporter = () => setLoggedProductImportModalOpen(false)

  const handleImportLoggedProducts = async (
    data: {
      quantity: string
      logDate?: string
      breed?: string
    }[],
  ) => {
    const logs: (ILoggedProduct & {productKey: string})[] = []

    for (const log of data) {
      logs.push({
        id: undefined,
        owner: product.owner,
        productId: product.id,
        productKey: product.productKey,
        quantity: Number(log.quantity),
        breed: log.breed,
        logDate: log.logDate ? dayjs(log.logDate).format() : dayjs().format(),
      })
    }

    await axios.post('/logged-product/import', logs)
    await handleLoadLoggedProducts()
  }

  return (
    <>
      <div className="mt-10">
        {pageState.loading ? (
          <TableLoader />
        ) : pageState.loggedProducts.length === 0 ? (
          <div className="pt-10">
            <EmptyState
              entity="logs"
              actions={
                <>
                  <p className="mt-1 text-sm text-muted">Add a new logged product here</p>

                  <div className="mt-6">
                    <Button type="secondary" className="mr-4" onClick={handleOpenLoggedProductImporter}>
                      Import logs
                    </Button>

                    <Button
                      type="primary"
                      onClick={() =>
                        handleShowLoggedProductModal({
                          id: undefined,
                          quantity: 1,
                          owner: product.owner,
                          productId: product.id,
                          logDate: dayjs().format(),
                        })
                      }
                    >
                      Add log
                    </Button>
                  </div>
                </>
              }
            />
          </div>
        ) : (
          <>
            <LogsTable
              logs={pageState.loggedProducts}
              product={product}
              onShowLoggedProductModal={handleShowLoggedProductModal}
              onOpenImporter={handleOpenLoggedProductImporter}
            />

            <Chart
              data={(pageState.loggedProducts || []).map(x => ({date: x.logDate, Quantity: x.quantity}))}
              title="Logged Products"
              labels={['Quantity']}
              notMoney
            />
          </>
        )}
      </div>

      <LogProductModal
        products={products}
        dbBreeds={breeds}
        loggedProduct={pageState.loggedProduct}
        errorMessage={pageState.errorMessage}
        open={pageState.showModal}
        onClose={handleCloseLoggedProductModal}
        onSubmit={handleCompleteLoggedProduct}
        onDelete={handleShowDeleteLoggedProductModal}
      />

      <ConfirmDeleteModal
        type="logged product"
        open={pageState.showDeleteModal}
        loading={pageState.deleteLoading}
        onClose={handleCloseDeleteLoggedProductModal}
        onDelete={handleDeleteLoggedProduct}
      />

      <ImportModal
        type="logged products"
        headers={['quantity', 'logDate', 'breed']}
        open={loggedProductImportModalOpen}
        onClose={handleCloseLoggedProductImporter}
        onSave={handleImportLoggedProducts}
        notReloading
      />
    </>
  )
}

export default LoggedProductsPage
