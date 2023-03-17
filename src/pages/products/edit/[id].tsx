import Button from '@/components/Button'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'
import EmptyState from '@/components/EmptyState'
import ImportModal from '@/components/ImportModal'
import TableLoader from '@/components/TableLoader'
import TabNav from '@/components/TabNav'
import {getErrorMessage, setPageState} from '@/helpers'
import {
  IExpense,
  ILoggedProduct,
  IProduct,
  morphExpenseDb,
  morphLoggedProductDb,
  morphProductDb,
} from '@/morphs/product.morph'
import Layout from '@/pages/_layout'
import {ProductMetadata} from '@/types'
import {Expense, LoggedProduct, PrismaClient} from '@prisma/client'
import axios from 'axios'
import dayjs from 'dayjs'
import _uniq from 'lodash/uniq'
import _uniqBy from 'lodash/uniqBy'
import {useRouter} from 'next/router'
import React, {useState} from 'react'
import ExpenseChart from '../_components/ExpenseChart'
import ExpenseModal from '../_components/ExpenseModal'
import ExpensesTable from '../_components/ExpensesTable'
import LogProductModal from '../_components/LogProductModal'
import LogsChart from '../_components/LogsChart'
import LogsTable from '../_components/LogsTable'
import ProductForm from '../_components/ProductForm'

interface IPageState {
  errorMessage?: string
  showExpenseModal?: boolean
  expense?: IExpense
  expenseErrorMessage?: string
  expenses?: IExpense[]
  expensesLoading?: boolean
  showDeleteExpenseModal?: boolean
  deleteExpenseId?: string
  deleteExpenseLoading?: boolean
  currentTab?: number
  expenseImporterOpen?: boolean
  loggedProducts?: ILoggedProduct[]
  loggedProduct?: ILoggedProduct
  loggedProductErrorMessage?: string
  showLoggedProductModal?: boolean
  showDeleteLoggedProductModal?: boolean
  deleteLoggedProductLoading?: boolean
  deleteLoggedProductId?: string
  loggedProductsLoading?: boolean
  loggedProductImporterOpen?: boolean
}

interface IEditProductPage {
  product: IProduct
  metadata: ProductMetadata
}

const EditAnimalPage = ({product, metadata}: IEditProductPage): React.ReactElement => {
  const router = useRouter()
  const [pageState, stateFunc] = useState<IPageState>({
    showExpenseModal: false,
    expenses: product.expenses || [],
    expensesLoading: false,
    showDeleteExpenseModal: false,
    deleteExpenseLoading: false,
    currentTab: 1,
    expenseImporterOpen: false,
    loggedProducts: product.loggedProducts || [],
    showLoggedProductModal: false,
    showDeleteLoggedProductModal: false,
    deleteLoggedProductLoading: false,
    loggedProductsLoading: false,
    loggedProductImporterOpen: false,
  })

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

  const handleSubmit = async (data: IProduct) => {
    try {
      await axios.post(`/api/product/${data.id}`, data)
      await router.push('/products')
    } catch (e) {
      setState({errorMessage: getErrorMessage(e)})
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/product/${id}`)
      await router.push('/products')
    } catch (e) {
      setState({errorMessage: getErrorMessage(e)})
    }
  }

  const handleLoadExpenses = async () => {
    setState({expensesLoading: true})

    const stateUpdate = {
      showExpenseModal: false,
      expense: undefined,
      expensesLoading: false,
      deleteExpenseId: undefined,
      deleteExpenseLoading: false,
      showDeleteExpenseModal: false,
    }

    try {
      const {data} = await axios.get<Expense[]>(`/api/product/${product.id}/expenses`)
      setState({expenses: data.map(morphExpenseDb), ...stateUpdate})
    } catch (e) {
      setState({errorMessage: getErrorMessage(e), ...stateUpdate})
    }
  }

  const handleShowExpenseModal = (expense?: IExpense) =>
    setState({showExpenseModal: true, expenseErrorMessage: undefined, expense})

  const handleCloseExpenseModal = () => setState({showExpenseModal: false})

  const handleCompleteExpense = async (expense: IExpense) => {
    try {
      await axios.post(`/api/product/${product.id}/expense${expense.id ? `/${expense.id}` : ''}`, expense)
      await handleLoadExpenses()
    } catch (e) {
      setState({expenseErrorMessage: getErrorMessage(e)})
    }
  }

  const handleShowDeleteExpenseModal = (deleteExpenseId: string) =>
    setState({showDeleteExpenseModal: true, deleteExpenseId})

  const handleCloseDeleteExpenseModal = () => setState({showDeleteExpenseModal: false, deleteExpenseId: undefined})

  const handleDeleteExpense = async () => {
    setState({deleteExpenseLoading: true})

    const stateUpdate = {
      showDeleteExpenseModal: false,
      deleteExpenseId: undefined,
    }

    try {
      await axios.delete(`/api/product/${product.id}/expense/${pageState.deleteExpenseId}`)
      await handleLoadExpenses()
    } catch (e) {
      setState({expenseErrorMessage: getErrorMessage(e), ...stateUpdate})
    }
  }

  const handleChangeTab = (tab: number) => setState({currentTab: tab})

  const handleOpenExpenseImporter = () => setState({expenseImporterOpen: true})

  const handleCloseExpenseImporter = () => setState({expenseImporterOpen: false})

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
        item: expense.item,
        amount: expense.amount,
        quantity: expense.quantity,
        purchaseDate: expense.purchaseDate,
      })
    }

    await axios.post(`/api/product/${product.id}/expense/import`, expenses)

    router.reload()
  }

  const handleLoadLoggedProducts = async () => {
    setState({loggedProductsLoading: true})

    const stateUpdate = {
      showLoggedProductModal: false,
      loggedProduct: undefined,
      loggedProductsLoading: false,
      deleteLoggedProductId: undefined,
      deleteLoggedProductLoading: false,
      showDeleteLoggedProductModal: false,
    }

    try {
      const {data} = await axios.get<LoggedProduct[]>(`/api/product/${product.id}/logs`)
      setState({loggedProducts: data.map(morphLoggedProductDb), ...stateUpdate})
    } catch (e) {
      setState({errorMessage: getErrorMessage(e), ...stateUpdate})
    }
  }

  const handleShowLoggedProductModal = (loggedProduct?: ILoggedProduct) =>
    setState({showLoggedProductModal: true, loggedProductErrorMessage: undefined, loggedProduct})

  const handleCloseLoggedProductModal = () => setState({showLoggedProductModal: false})

  const handleCompleteLoggedProduct = async (loggedProduct: ILoggedProduct) => {
    try {
      await axios.post(
        `/api/product/${loggedProduct.productId}/log${loggedProduct.id ? `/${loggedProduct.id}` : ''}`,
        loggedProduct,
      )
      await handleLoadLoggedProducts()
    } catch (e) {
      setState({loggedProductErrorMessage: getErrorMessage(e)})
    }
  }

  const handleShowDeleteLoggedProductModal = (deleteLoggedProductId: string) =>
    setState({showDeleteLoggedProductModal: true, deleteLoggedProductId})

  const handleCloseDeleteLoggedProductModal = () =>
    setState({showDeleteLoggedProductModal: false, deleteLoggedProductId: undefined})

  const handleDeleteLoggedProduct = async () => {
    setState({deleteLoggedProductLoading: true})

    const stateUpdate = {
      showDeleteLoggedProductModal: false,
      deleteLoggedProductId: undefined,
    }

    try {
      await axios.delete(`/api/product/${product.id}/log/${pageState.deleteLoggedProductId}`)
      await handleLoadLoggedProducts()
    } catch (e) {
      setState({loggedProductErrorMessage: getErrorMessage(e), ...stateUpdate})
    }
  }

  const handleOpenLoggedProductImporter = () => setState({loggedProductImporterOpen: true})

  const handleCloseLoggedProductImporter = () => setState({loggedProductImporterOpen: false})

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
        productId: product.id,
        productKey: product.productKey,
        quantity: Number(log.quantity),
        breed: log.breed,
        logDate: log.logDate ? dayjs(log.logDate).format() : dayjs().format(),
      })
    }

    await axios.post(`/api/log/import`, logs)

    router.reload()
  }

  return (
    <Layout
      title={`${product.name} - Edit product`}
      description="Update this product"
      breadcrumbs={[
        {name: 'Products', href: '/products'},
        {name: product.name, current: true},
      ]}
    >
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
            product={product}
            onDelete={handleDelete}
            onSubmit={handleSubmit}
            metadata={metadata}
            errorMessage={pageState.errorMessage}
          />
        )}

        {pageState.currentTab === 2 && (
          <div className="mt-10">
            {pageState.loggedProductsLoading ? (
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

                <LogsChart logs={pageState.loggedProducts} />
              </>
            )}
          </div>
        )}

        {pageState.currentTab === 3 && (
          <div className="mt-10">
            {pageState.expensesLoading ? (
              <TableLoader />
            ) : pageState.expenses.length === 0 ? (
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
                  expenses={pageState.expenses}
                  onShowExpenseModal={handleShowExpenseModal}
                  onOpenImporter={handleOpenExpenseImporter}
                />

                <ExpenseChart expenses={pageState.expenses} />
              </>
            )}
          </div>
        )}
      </div>

      <ExpenseModal
        expense={pageState.expense}
        errorMessage={pageState.expenseErrorMessage}
        open={pageState.showExpenseModal}
        onClose={handleCloseExpenseModal}
        onSubmit={handleCompleteExpense}
        onDelete={handleShowDeleteExpenseModal}
      />

      <ConfirmDeleteModal
        type="expense"
        open={pageState.showDeleteExpenseModal}
        loading={pageState.deleteExpenseLoading}
        onClose={handleCloseDeleteExpenseModal}
        onDelete={handleDeleteExpense}
      />

      <ImportModal
        type="expenses"
        headers={['item', 'amount', 'quantity', 'purchaseDate']}
        open={pageState.expenseImporterOpen}
        onClose={handleCloseExpenseImporter}
        onSave={handleImportExpenses}
      />

      <LogProductModal
        products={metadata.dbProducts}
        dbBreeds={metadata.dbBreeds}
        loggedProduct={pageState.loggedProduct}
        errorMessage={pageState.loggedProductErrorMessage}
        open={pageState.showLoggedProductModal}
        onClose={handleCloseLoggedProductModal}
        onSubmit={handleCompleteLoggedProduct}
        onDelete={handleShowDeleteLoggedProductModal}
      />

      <ConfirmDeleteModal
        type="logged product"
        open={pageState.showDeleteLoggedProductModal}
        loading={pageState.deleteLoggedProductLoading}
        onClose={handleCloseDeleteLoggedProductModal}
        onDelete={handleDeleteLoggedProduct}
      />

      <ImportModal
        type="logged products"
        headers={['quantity', 'logDate', 'breed']}
        open={pageState.loggedProductImporterOpen}
        onClose={handleCloseLoggedProductImporter}
        onSave={handleImportLoggedProducts}
      />
    </Layout>
  )
}

// noinspection JSUnusedGlobalSymbols
export async function getStaticPaths() {
  const prisma = new PrismaClient()
  const products = await prisma.product.findMany()
  const paths: {params: {id: string}}[] = []

  products.forEach(({id}) => {
    paths.push({params: {id: id.toString()}})
  })

  return {
    paths,
    fallback: false,
  }
}

// noinspection JSUnusedGlobalSymbols
export const getStaticProps = async ({params}): Promise<{props: IEditProductPage}> => {
  const prisma = new PrismaClient()
  const product = await prisma.product.findFirst({
    where: {id: params.id},
    include: {expenses: true, loggedProducts: true},
  })
  const animals = await prisma.animal.findMany()
  const products = await prisma.product.findMany({include: {expenses: true, loggedProducts: true}})

  return {
    props: {
      product: morphProductDb(product),
      metadata: {
        dbSpecies: _uniq(animals.map(x => x.species)),
        dbBreeds: _uniqBy(
          animals.map(x => ({
            name: x.breed,
            species: x.species,
          })),
          'name',
        ),
        dbProducts: products.map(x => morphProductDb(x)),
      },
    },
  }
}

export default EditAnimalPage
