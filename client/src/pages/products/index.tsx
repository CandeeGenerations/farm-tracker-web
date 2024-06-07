import Button from '@/components/Button'
import Card from '@/components/Card'
import EmptyState from '@/components/EmptyState'
import ImportModal from '@/components/ImportModal'
import Search from '@/components/Search'
import Table, {IColumnHeader} from '@/components/Table'
import TableLoader from '@/components/TableLoader'
import {addCommas, classNames, setPageState} from '@/helpers'
import {DEBOUNCE, PRODUCTS_COLUMNS} from '@/helpers/constants'
import * as storage from '@/helpers/localStorage'
import {IProduct} from '@/types/product'
import axios, {AxiosResponse} from 'axios'
import _debounce from 'lodash/debounce'
import _sum from 'lodash/sum'
import Link from 'next/link'
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'
import Layout from '../_layout'
import ColumnsModal from './_components/_ColumnsModal'
import ProfitLossChart from './_components/_ProfitLossChart'
import ProgressiveChart from './_components/_ProgressiveChart'

interface IPageState {
  loading?: boolean
  products?: IProduct[]
  originalProducts?: IProduct[]
  resetSearch?: number
  importerOpen?: boolean
  columnsOpen?: boolean
  visibleColumns?: string[]
}

const columns: IColumnHeader[] = [
  {name: 'Species', id: 'species'},
  {name: 'Logged Amount', id: 'totalLogged'},
  {name: 'Expenses', id: 'expensesAmount'},
  {name: 'Cost Per', id: 'costPer'},
  {name: 'Sales', id: 'salesAmount'},
  {name: 'Profit', id: 'profitAmount', sortOverride: 'profitSort'},
]

const ProductsPage = (): React.ReactElement => {
  const router = useRouter()
  const [pageState, stateFunc] = useState<IPageState>({
    loading: true,
    products: [],
    importerOpen: false,
    columnsOpen: false,
    originalProducts: [],
    resetSearch: 0,
    visibleColumns: [],
  })

  const getProducts = async () => {
    const products: AxiosResponse<{data: IProduct[]}> = await axios.get('/product')
    const storedColumnsString = storage.get(PRODUCTS_COLUMNS)

    setState({
      loading: false,
      products: products.data.data,
      originalProducts: [...products.data.data],
      visibleColumns: storedColumnsString ? storedColumnsString.split(',') : [],
    })
  }

  useEffect(() => {
    getProducts()
  }, [])

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

  const handleSearch = (value, reset) => {
    if (!value && !reset) {
      return
    }

    let newData = [...pageState.originalProducts]

    if (value) {
      newData = newData.filter(x => x.name?.toLowerCase().includes(value.trim().toLowerCase()))
    }

    setState({products: newData})
  }

  const handleOpenColumns = () => setState({columnsOpen: true})

  const handleCloseColumns = () => {
    const storedColumnsString = storage.get(PRODUCTS_COLUMNS)

    setState({columnsOpen: false, visibleColumns: storedColumnsString ? storedColumnsString.split(',') : []})
  }

  const handleOpenImporter = () => setState({importerOpen: true})

  const handleCloseImporter = () => setState({importerOpen: false})

  const handleImport = async (
    data: {
      name: string
      species: string
      unit: string
    }[],
  ) => {
    const products: IProduct[] = []

    for (const product of data) {
      products.push({
        id: undefined,
        owner: undefined,
        productKey: '',
        name: product.name,
        species: product.species,
        unit: product.unit,
        expenses: [],
        loggedProducts: [],
        sales: [],
      })
    }

    await axios.post('/product/import', products)

    router.reload()
  }

  const debounceSearch = _debounce(handleSearch, DEBOUNCE)
  const totalProfit =
    _sum(pageState.originalProducts.map(x => _sum(x.sales.map(y => y.amount)))) -
    _sum(pageState.originalProducts.map(x => _sum(x.expenses.map(y => y.amount * y.quantity))))

  return (
    <Layout
      title="Products"
      description="Manage the products being produced on your farm"
      breadcrumbs={[{name: 'Products', current: true}]}
    >
      {pageState.loading ? (
        <Card>
          <TableLoader />
        </Card>
      ) : pageState.products.length === 0 ? (
        <EmptyState
          entity="products"
          actions={
            <>
              <p className="mt-1 text-sm text-muted">Add a new product here</p>

              <div className="mt-6">
                <Button type="secondary" className="mr-4" onClick={handleOpenImporter}>
                  Import products
                </Button>

                <Link href="/products/add">
                  <Button type="primary">Add new product</Button>
                </Link>
              </div>
            </>
          }
        />
      ) : (
        <div className="space-y-6 mt-8 order-1 lg:order-2">
          <div className="flex items-center flex-col sm:flex-row">
            <Search onSearch={(value, reset) => debounceSearch(value, reset)} resetSearch={pageState.resetSearch} />

            <div className="pt-5 sm:flex-1 w-full sm:w-auto text-right">
              <Button className="sm:mr-4" onClick={handleOpenColumns}>
                Columns
              </Button>

              <Button type="secondary" className="sm:mr-4" onClick={handleOpenImporter}>
                Import products
              </Button>

              <Link href="/products/add">
                <Button type="primary">Add new product</Button>
              </Link>
            </div>
          </div>

          <Table
            actions={{idColumn: 'id', parent: 'products'}}
            columns={[
              {name: 'Name', id: 'name'},
              ...(pageState.visibleColumns.length > 0
                ? columns.filter(x => pageState.visibleColumns.includes(x.id))
                : columns),
            ]}
            totalRow={[
              {
                id: 'totalLogged',
                value: addCommas(
                  _sum(pageState.originalProducts.map(x => _sum(x.loggedProducts.map(y => y.quantity)))),
                ),
              },
              {
                id: 'expensesAmount',
                value: `$${addCommas(_sum(pageState.originalProducts.map(x => _sum(x.expenses.map(y => y.amount * y.quantity)))))}`,
              },
              {
                id: 'salesAmount',
                value: `$${addCommas(_sum(pageState.originalProducts.map(x => _sum(x.sales.map(y => y.amount)))))}`,
              },
              {
                id: 'profitAmount',
                value: (
                  <span
                    className={classNames(
                      totalProfit > 0 ? 'text-success-medium' : totalProfit < 0 ? 'text-warning-medium' : undefined,
                    )}
                  >
                    ${addCommas(totalProfit)}
                  </span>
                ),
              },
            ]}
            keyName="id"
            linkKey="name"
            data={pageState.products.map(x => {
              const salesAmount = _sum(x.sales.map(y => y.amount))
              const salesQuantity = _sum(x.sales.map(y => y.quantity))
              const expensesAmount = _sum(x.expenses.map(y => y.amount * y.quantity))
              const loggedProductsAmount = _sum(x.loggedProducts.map(y => y.quantity))
              const profitAmount = salesAmount - expensesAmount
              const anyExpenses = x.expenses.length > 0
              const anyLoggedProducts = x.loggedProducts.length > 0

              return {
                ...x,
                expensesAmount: anyExpenses
                  ? `$${addCommas(expensesAmount)} (${x.expenses.length} item${x.expenses.length === 1 ? '' : 's'})`
                  : undefined,
                totalLogged: anyLoggedProducts ? `${addCommas(loggedProductsAmount)} ${x.unit}` : 0,
                costPer: `$${addCommas(anyExpenses && anyLoggedProducts ? expensesAmount / loggedProductsAmount : 0)}`,
                salesAmount: `$${addCommas(salesAmount)} (${addCommas(
                  salesQuantity,
                )} sold / $${addCommas(salesAmount / salesQuantity)} per)`,
                profitAmount: (
                  <span
                    className={classNames(
                      profitAmount > 0 ? 'text-success-medium' : profitAmount < 0 ? 'text-warning-medium' : undefined,
                    )}
                  >
                    ${addCommas(profitAmount)}
                  </span>
                ),
                profitSort: profitAmount,
              }
            })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="col-span-1 sm:col-span-2">
              <ProgressiveChart
                data={[
                  ...pageState.products
                    .map(x => [
                      ...x.expenses.map(y => ({date: y.purchaseDate, Expenses: y.amount * y.quantity})),
                      ...x.sales.map(y => ({date: y.saleDate, Sales: y.amount})),
                    ])
                    .flat(),
                ]}
                labels={['Expenses', 'Sales']}
                colors={['rose', 'emerald']}
                title="Expenses and Sales"
                showLegend
              />
            </div>

            <div className="col-span-1">
              <ProfitLossChart
                data={[
                  ...pageState.products
                    .map(x => [
                      ...x.expenses.map(y => ({date: y.purchaseDate, Expenses: y.amount * y.quantity})),
                      ...x.sales.map(y => ({date: y.saleDate, Sales: y.amount})),
                    ])
                    .flat(),
                ]}
                labels={['Expenses', 'Sales']}
                colors={['rose', 'emerald']}
                title="Profit & Loss"
              />
            </div>
          </div>
        </div>
      )}

      <ImportModal
        type="products"
        headers={['name', 'species', 'unit']}
        metadata={{unit: '... (count, lb, oz)'}}
        open={pageState.importerOpen}
        onClose={handleCloseImporter}
        onSave={handleImport}
      />

      <ColumnsModal
        storageKey={PRODUCTS_COLUMNS}
        columns={columns.map(x => ({...x, enabled: true}))}
        onClose={handleCloseColumns}
        open={pageState.columnsOpen}
      />
    </Layout>
  )
}

export default ProductsPage
