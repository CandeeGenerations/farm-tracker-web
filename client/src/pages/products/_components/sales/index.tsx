import Button from '@/components/Button'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'
import EmptyState from '@/components/EmptyState'
import ImportModal from '@/components/ImportModal'
import {getErrorMessage, setPageState} from '@/helpers'
import SaleModal from '@/pages/products/_components/sales/SaleModal'
import {IProduct} from '@/types/product'
import {ISale} from '@/types/sale'
import axios, {AxiosResponse} from 'axios'
import dayjs from 'dayjs'
import React, {useEffect, useState} from 'react'

import Chart from '../_Chart'
import SalesTable from './SalesTable'

interface IPageState {
  showModal?: boolean
  sale?: ISale
  products?: IProduct[]
  errorMessage?: string
  sales?: ISale[]
  loading?: boolean
  showDeleteModal?: boolean
  deleteId?: string
  deleteLoading?: boolean
}

interface ISalesPage {
  product?: IProduct
}

const SalesPage = ({product}: ISalesPage): React.ReactElement => {
  const productRoute = product ? `/product/${product.id}` : ''
  const [saleImportModalOpen, setSaleImportModalOpen] = useState<boolean>(false)
  const [pageState, stateFunc] = useState<IPageState>({
    showModal: false,
    sales: product?.sales || [],
    loading: true,
    showDeleteModal: false,
    deleteLoading: false,
  })

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

  const handleLoadSales = async () => {
    try {
      const {data}: AxiosResponse<{data: ISale[]}> = await axios.get(`${productRoute}/sale`)
      const products: AxiosResponse<{data: IProduct[]}> = await axios.get('/product')

      setState({
        sales: data.data,
        products: products.data.data,
        loading: false,
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

  useEffect(() => {
    handleLoadSales()
  }, [])

  const handleShowSaleModal = (sale?: ISale) =>
    setState({
      showModal: true,
      errorMessage: undefined,
      sale: sale || {
        productId: product?.id,
        amount: 0,
        quantity: 0,
        saleDate: dayjs().format(),
        id: undefined,
        owner: undefined,
      },
    })

  const handleCloseSaleModal = () => setState({showModal: false})

  const handleCompleteSale = async (sale: ISale) => {
    if (!product && !sale.productId) {
      setState({errorMessage: 'Product is required'})
      return
    }

    try {
      await axios.post(`/product/${sale.productId}/sale${sale.id?.length > 0 ? `/${sale.id}` : ''}`, sale)
      await handleLoadSales()
    } catch (e) {
      setState({errorMessage: getErrorMessage(e)})
    }
  }

  const handleShowDeleteSaleModal = (deleteId: string) => setState({showDeleteModal: true, deleteId})

  const handleCloseDeleteSaleModal = () => setState({showDeleteModal: false, deleteId: undefined})

  const handleDeleteSale = async () => {
    setState({deleteLoading: true})

    const productId = product ? product.id : pageState.sales.find((x) => x.id === pageState.deleteId)?.productId

    try {
      await axios.delete(`/product/${productId}/sale/${pageState.deleteId}`)
      await handleLoadSales()
    } catch (e) {
      setState({errorMessage: getErrorMessage(e)})
    }
  }

  const handleOpenSaleImporter = () => setSaleImportModalOpen(true)

  const handleCloseSaleImporter = () => setSaleImportModalOpen(false)

  const handleImportSales = async (
    data: {
      item: string
      amount: number
      quantity: number
      saleDate: string
    }[],
  ) => {
    const sales: ISale[] = []

    for (const sale of data) {
      sales.push({
        id: undefined,
        productId: undefined,
        owner: undefined,
        amount: sale.amount,
        quantity: sale.quantity,
        saleDate: sale.saleDate,
      })
    }

    await axios.post(`${productRoute}/sale/import`, sales)
    await handleLoadSales()
  }

  return (
    <>
      <div className="mt-10">
        {!pageState.loading && pageState.sales.length === 0 ? (
          <div className="pt-10">
            <EmptyState
              entity="sales"
              actions={
                <>
                  <p className="mt-1 text-sm text-muted">Add a new sale here</p>

                  <div className="mt-6">
                    {product && (
                      <Button type="secondary" className="mr-4" onClick={handleOpenSaleImporter}>
                        Import sales
                      </Button>
                    )}

                    <Button type="primary" onClick={() => handleShowSaleModal()}>
                      Add sale
                    </Button>
                  </div>
                </>
              }
            />
          </div>
        ) : (
          <>
            <SalesTable
              loading={pageState.loading}
              sales={pageState.sales}
              onShowSaleModal={handleShowSaleModal}
              onOpenImporter={handleOpenSaleImporter}
              isProductSales={!!product}
              products={pageState.products}
            />

            <Chart data={pageState.sales.map((x) => ({date: x.saleDate, Amount: x.amount}))} title="Sales" />
          </>
        )}
      </div>

      <SaleModal
        sale={pageState.sale}
        errorMessage={pageState.errorMessage}
        open={pageState.showModal}
        onClose={handleCloseSaleModal}
        onSubmit={handleCompleteSale}
        onDelete={handleShowDeleteSaleModal}
        isProductSales={!!product}
        products={pageState.products}
      />

      <ConfirmDeleteModal
        type="sale"
        open={pageState.showDeleteModal}
        loading={pageState.deleteLoading}
        onClose={handleCloseDeleteSaleModal}
        onDelete={handleDeleteSale}
      />

      <ImportModal
        type="sales"
        headers={['saleDate', 'amount', 'quantity']}
        open={saleImportModalOpen}
        onClose={handleCloseSaleImporter}
        onSave={handleImportSales}
        notReloading
      />
    </>
  )
}

export default SalesPage
