import {getErrorMessage, setPageState} from '@/helpers'
import {IAnimal} from '@/types/animal'
import {IExpense} from '@/types/expense'
import {ILoggedProduct} from '@/types/loggedProduct'
import {IProduct} from '@/types/product'
import axios, {AxiosResponse} from 'axios'
import dayjs from 'dayjs'
import _uniq from 'lodash/uniq'
import _uniqBy from 'lodash/uniqBy'
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal'
import EmptyState from '../../../components/EmptyState'
import ImportModal from '../../../components/ImportModal'
import TableLoader from '../../../components/TableLoader'
import TabNav from '../../../components/TabNav'
import Layout from '../../_layout'
import ExpenseChart from '../_components/ExpenseChart'
import ExpenseModal from '../_components/ExpenseModal'
import ExpensesTable from '../_components/ExpensesTable'
import LogProductModal from '../_components/LogProductModal'
import LogsChart from '../_components/LogsChart'
import LogsTable from '../_components/LogsTable'
import ProductForm from '../_components/ProductForm'

interface IExpensesState {
  showExpenseModal?: boolean
  expense?: IExpense
  expenseErrorMessage?: string
  expenses?: IExpense[]
  expensesLoading?: boolean
  showDeleteExpenseModal?: boolean
  deleteExpenseId?: string
  deleteExpenseLoading?: boolean
}

interface ILoggedProductsState {
  loggedProducts?: ILoggedProduct[]
  loggedProduct?: ILoggedProduct
  loggedProductErrorMessage?: string
  showLoggedProductModal?: boolean
  showDeleteLoggedProductModal?: boolean
  deleteLoggedProductLoading?: boolean
  deleteLoggedProductId?: string
  loggedProductsLoading?: boolean
}

interface IPageState {
  errorMessage?: string
  currentTab?: number
}

const EditAnimalPage = (): React.ReactElement => {
  const router = useRouter()
  const [product, setProduct] = useState<{loading: boolean; product: IProduct}>({loading: true, product: undefined})
  const [products, setProducts] = useState<{loading: boolean; products: IProduct[]}>({loading: true, products: []})
  const [animals, setAnimals] = useState<{loading: boolean; animals: IAnimal[]}>({loading: true, animals: []})
  const [expenseImportModalOpen, setExpenseImportModalOpen] = useState<boolean>(false)
  const [loggedProductImportModalOpen, setLoggedProductImportModalOpen] = useState<boolean>(false)
  const [expensesState, expensesFunc] = useState<IExpensesState>({
    showExpenseModal: false,
    expenses: [],
    expensesLoading: false,
    showDeleteExpenseModal: false,
    deleteExpenseLoading: false,
  })
  const [loggedProductsState, loggedProductsFunc] = useState<ILoggedProductsState>({
    loggedProducts: [],
    showLoggedProductModal: false,
    showDeleteLoggedProductModal: false,
    deleteLoggedProductLoading: false,
    loggedProductsLoading: false,
  })
  const [pageState, stateFunc] = useState<IPageState>({
    currentTab: 1,
  })

  const getProduct = async id => {
    const result: AxiosResponse<{data: IProduct}> = await axios.get(`/product/${id}`)
    setProduct({loading: false, product: result.data.data})
    setExpensesState({expenses: result.data.data.expenses})
    setLoggedProductsState({loggedProducts: result.data.data.loggedProducts})
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

  const setExpensesState = (state: IExpensesState) => setPageState<IExpensesState>(expensesFunc, expensesState, state)

  const setLoggedProductsState = (state: ILoggedProductsState) =>
    setPageState<ILoggedProductsState>(loggedProductsFunc, loggedProductsState, state)

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

  const handleLoadExpenses = async () => {
    setExpensesState({expensesLoading: true})

    try {
      const {data}: AxiosResponse<{data: IExpense[]}> = await axios.get(`/product/${product.product.id}/expense`)
      setExpensesState({
        expenses: data.data,
        ...{
          showExpenseModal: false,
          expensesLoading: false,
          deleteExpenseId: undefined,
          deleteExpenseLoading: false,
          showDeleteExpenseModal: false,
        },
      })
    } catch (e) {
      setState({errorMessage: getErrorMessage(e)})
    }
  }

  const handleShowExpenseModal = (expense?: IExpense) =>
    setExpensesState({showExpenseModal: true, expenseErrorMessage: undefined, expense})

  const handleCloseExpenseModal = () => setExpensesState({showExpenseModal: false})

  const handleCompleteExpense = async (expense: IExpense) => {
    try {
      await axios.post(`/product/${product.product.id}/expense${expense.id ? `/${expense.id}` : ''}`, expense)
      await handleLoadExpenses()
    } catch (e) {
      setExpensesState({expenseErrorMessage: getErrorMessage(e)})
    }
  }

  const handleShowDeleteExpenseModal = (deleteExpenseId: string) =>
    setExpensesState({showDeleteExpenseModal: true, deleteExpenseId})

  const handleCloseDeleteExpenseModal = () =>
    setExpensesState({showDeleteExpenseModal: false, deleteExpenseId: undefined})

  const handleDeleteExpense = async () => {
    setExpensesState({deleteExpenseLoading: true})

    try {
      await axios.delete(`/product/${product.product.id}/expense/${expensesState.deleteExpenseId}`)
      await handleLoadExpenses()
    } catch (e) {
      setExpensesState({expenseErrorMessage: getErrorMessage(e)})
    }
  }

  const handleChangeTab = (tab: number) => setState({currentTab: tab})

  const handleOpenExpenseImporter = () => setExpenseImportModalOpen(true)

  const handleCloseExpenseImporter = () => setExpenseImportModalOpen(false)

  const handleImportExpenses = async (
    data: {
      item: string
      amount: number
      quantity: number
      purchaseDate: string
    }[],
  ) => {
    const expenses: IExpense[] = []

    for (const expense of data) {
      expenses.push({
        id: undefined,
        productId: undefined,
        owner: undefined,
        item: expense.item,
        amount: expense.amount,
        quantity: expense.quantity,
        purchaseDate: expense.purchaseDate,
      })
    }

    await axios.post(`/product/${product.product.id}/expense/import`, expenses)
    await handleLoadExpenses()
  }

  const handleLoadLoggedProducts = async () => {
    setLoggedProductsState({loggedProductsLoading: true})

    try {
      const {data}: AxiosResponse<{data: ILoggedProduct[]}> = await axios.get(
        `/product/${product.product.id}/logged-product`,
      )
      setLoggedProductsState({
        loggedProducts: data.data,
        ...{
          showLoggedProductModal: false,
          loggedProductsLoading: false,
          deleteLoggedProductId: undefined,
          deleteLoggedProductLoading: false,
          showDeleteLoggedProductModal: false,
        },
      })
    } catch (e) {
      setState({errorMessage: getErrorMessage(e)})
    }
  }

  const handleShowLoggedProductModal = (loggedProduct?: ILoggedProduct) =>
    setLoggedProductsState({showLoggedProductModal: true, loggedProductErrorMessage: undefined, loggedProduct})

  const handleCloseLoggedProductModal = () => setLoggedProductsState({showLoggedProductModal: false})

  const handleCompleteLoggedProduct = async (loggedProduct: ILoggedProduct) => {
    try {
      await axios.post(
        `/product/${loggedProduct.productId}/logged-product${loggedProduct.id ? `/${loggedProduct.id}` : ''}`,
        loggedProduct,
      )
      await handleLoadLoggedProducts()
    } catch (e) {
      setLoggedProductsState({loggedProductErrorMessage: getErrorMessage(e)})
    }
  }

  const handleShowDeleteLoggedProductModal = (deleteLoggedProductId: string) =>
    setLoggedProductsState({showDeleteLoggedProductModal: true, deleteLoggedProductId})

  const handleCloseDeleteLoggedProductModal = () =>
    setLoggedProductsState({showDeleteLoggedProductModal: false, deleteLoggedProductId: undefined})

  const handleDeleteLoggedProduct = async () => {
    setLoggedProductsState({deleteLoggedProductLoading: true})

    const stateUpdate = {
      showDeleteLoggedProductModal: false,
      deleteLoggedProductId: undefined,
    }

    try {
      await axios.delete(`/product/${product.product.id}/logged-product/${loggedProductsState.deleteLoggedProductId}`)
      await handleLoadLoggedProducts()
    } catch (e) {
      setLoggedProductsState({loggedProductErrorMessage: getErrorMessage(e), ...stateUpdate})
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
        owner: product.product.owner,
        productId: product.product.id,
        productKey: product.product.productKey,
        quantity: Number(log.quantity),
        breed: log.breed,
        logDate: log.logDate ? dayjs(log.logDate).format() : dayjs().format(),
      })
    }

    await axios.post('/logged-product/import', logs)
    await handleLoadLoggedProducts()
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
        <Card>
          <TableLoader />
        </Card>
      ) : (
        <div className="mt-6">
          <TabNav
            tabs={[
              {id: 1, name: 'Product'},
              {id: 2, name: 'Logs'},
              {id: 3, name: 'Expenses'},
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

          {pageState.currentTab === 2 && (
            <div className="mt-10">
              {loggedProductsState.loggedProductsLoading ? (
                <TableLoader />
              ) : loggedProductsState.loggedProducts.length === 0 ? (
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
                                owner: product.product.owner,
                                productId: product.product.id,
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
                    logs={loggedProductsState.loggedProducts}
                    product={product.product}
                    onShowLoggedProductModal={handleShowLoggedProductModal}
                    onOpenImporter={handleOpenLoggedProductImporter}
                  />

                  <LogsChart logs={loggedProductsState.loggedProducts} />
                </>
              )}
            </div>
          )}

          {pageState.currentTab === 3 && (
            <div className="mt-10">
              {expensesState.expensesLoading ? (
                <TableLoader />
              ) : expensesState.expenses.length === 0 ? (
                <div className="pt-10">
                  <EmptyState
                    entity="expenses"
                    actions={
                      <>
                        <p className="mt-1 text-sm text-muted">Add a new expense here</p>

                        <div className="mt-6">
                          <Button type="secondary" className="mr-4" onClick={handleOpenExpenseImporter}>
                            Import expenses
                          </Button>

                          <Button type="primary" onClick={() => handleShowExpenseModal()}>
                            Add expense
                          </Button>
                        </div>
                      </>
                    }
                  />
                </div>
              ) : (
                <>
                  <ExpensesTable
                    expenses={expensesState.expenses}
                    onShowExpenseModal={handleShowExpenseModal}
                    onOpenImporter={handleOpenExpenseImporter}
                  />

                  <ExpenseChart expenses={expensesState.expenses} />
                </>
              )}
            </div>
          )}
        </div>
      )}

      <ExpenseModal
        expense={expensesState.expense}
        errorMessage={expensesState.expenseErrorMessage}
        open={expensesState.showExpenseModal}
        onClose={handleCloseExpenseModal}
        onSubmit={handleCompleteExpense}
        onDelete={handleShowDeleteExpenseModal}
      />

      <ConfirmDeleteModal
        type="expense"
        open={expensesState.showDeleteExpenseModal}
        loading={expensesState.deleteExpenseLoading}
        onClose={handleCloseDeleteExpenseModal}
        onDelete={handleDeleteExpense}
      />

      <ImportModal
        type="expenses"
        headers={['item', 'amount', 'quantity', 'purchaseDate']}
        open={expenseImportModalOpen}
        onClose={handleCloseExpenseImporter}
        onSave={handleImportExpenses}
        notReloading
      />

      <LogProductModal
        products={products.products}
        dbBreeds={_uniqBy(
          animals.animals.map(x => ({
            name: x.breed,
            species: x.species,
          })),
          'name',
        )}
        loggedProduct={loggedProductsState.loggedProduct}
        errorMessage={loggedProductsState.loggedProductErrorMessage}
        open={loggedProductsState.showLoggedProductModal}
        onClose={handleCloseLoggedProductModal}
        onSubmit={handleCompleteLoggedProduct}
        onDelete={handleShowDeleteLoggedProductModal}
      />

      <ConfirmDeleteModal
        type="logged product"
        open={loggedProductsState.showDeleteLoggedProductModal}
        loading={loggedProductsState.deleteLoggedProductLoading}
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
    </Layout>
  )
}

export default EditAnimalPage
