import Button from '@/components/Button'
import EmptyState from '@/components/EmptyState'
import ImportModal from '@/components/ImportModal'
import SortableTable from '@/components/SortableTable'
import {IColumnHeader} from '@/components/Table'
import {addCommas, classNames, setPageState} from '@/helpers'
import {PRODUCTS_COLUMNS, TABLE_FILTERS_STORAGE_KEY} from '@/helpers/constants'
import * as storage from '@/helpers/localStorage'
import {IAnimal} from '@/types/animal'
import {IProduct} from '@/types/product'
import axios, {AxiosResponse} from 'axios'
import _sum from 'lodash/sum'
import _uniq from 'lodash/uniq'
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
  importerOpen?: boolean
  columnsOpen?: boolean
  visibleColumns?: string[]
  species?: string[]
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
    visibleColumns: [],
    species: [],
  })

  const getProducts = async () => {
    const products: AxiosResponse<{data: IProduct[]}> = await axios.get('/product')
    const animals: AxiosResponse<{data: IAnimal[]}> = await axios.get('/animal')
    const storedColumnsString = storage.get(PRODUCTS_COLUMNS)

    setState({
      loading: false,
      products: products.data.data,
      visibleColumns: storedColumnsString ? storedColumnsString.split(',') : [],
      species: _uniq(animals.data.data.map((x) => x.species)),
    })
  }

  useEffect(() => {
    getProducts()
  }, [])

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

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

  return (
    <Layout
      title="Products"
      description="Manage the products being produced on your farm"
      breadcrumbs={[{name: 'Products', current: true}]}
    >
      {!pageState.loading && pageState.products.length === 0 ? (
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

          <SortableTable
            id="products"
            loading={pageState.loading}
            filters={[
              {
                label: 'Species',
                type: 'select',
                column: 'species',
                values: pageState.species.map((x) => ({id: x, name: x})),
              },
              {
                label: 'Profitable',
                type: 'select',
                column: 'isProfitable',
                values: [
                  {id: 'true', name: 'Yes'},
                  {id: 'false', name: 'No'},
                ],
              },
            ]}
            searchableColumns={[
              'name',
              'species',
              'loggedAmount',
              'expensesAmount',
              'salesAmount',
              'costPer',
              'profitAmount',
            ]}
            columns={[
              {name: 'Name', id: 'name'},
              ...(pageState.visibleColumns.length > 0
                ? columns.filter((x) => pageState.visibleColumns.includes(x.id))
                : columns),
            ]}
            totalRow={[
              {
                id: 'totalLogged',
                value: (data: IProduct[]) =>
                  addCommas(_sum(data.map((x) => _sum(x.loggedProducts.map((y) => y.quantity))))),
              },
              {
                id: 'expensesAmount',
                value: (data: IProduct[]) =>
                  `$${addCommas(_sum(data.map((x) => _sum(x.expenses.map((y) => y.amount * y.quantity)))))}`,
              },
              {
                id: 'salesAmount',
                value: (data: IProduct[]) => `$${addCommas(_sum(data.map((x) => _sum(x.sales.map((y) => y.amount)))))}`,
              },
              {
                id: 'profitAmount',
                value: (data: IProduct[]) => {
                  const totalProfit =
                    _sum(data.map((x) => _sum(x.sales.map((y) => y.amount)))) -
                    _sum(data.map((x) => _sum(x.expenses.map((y) => y.amount * y.quantity))))

                  return (
                    <span
                      className={classNames(
                        totalProfit > 0 ? 'text-success-medium' : totalProfit < 0 ? 'text-warning-medium' : undefined,
                      )}
                    >
                      ${addCommas(totalProfit)}
                    </span>
                  )
                },
              },
            ]}
            defaultFilters={
              storage.get(`${TABLE_FILTERS_STORAGE_KEY}products`) &&
              JSON.parse(storage.get(`${TABLE_FILTERS_STORAGE_KEY}products`))
            }
            actions={{idColumn: 'id', parent: 'products'}}
            keyName="id"
            linkKey="name"
            data={pageState.products.map((x) => {
              const salesAmount = _sum(x.sales.map((y) => y.amount))
              const salesQuantity = _sum(x.sales.map((y) => y.quantity))
              const expensesAmount = _sum(x.expenses.map((y) => y.amount * y.quantity))
              const loggedProductsAmount = _sum(x.loggedProducts.map((y) => y.quantity))
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
                isProfitable: salesAmount === 0 || expensesAmount === 0 ? undefined : profitAmount > 0,
              }
            })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="col-span-1 sm:col-span-2">
              <ProgressiveChart
                data={[
                  ...pageState.products
                    .map((x) => [
                      ...x.expenses.map((y) => ({date: y.purchaseDate, Expenses: y.amount * y.quantity})),
                      ...x.sales.map((y) => ({date: y.saleDate, Sales: y.amount})),
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
                    .map((x) => [
                      ...x.expenses.map((y) => ({date: y.purchaseDate, Expenses: y.amount * y.quantity})),
                      ...x.sales.map((y) => ({date: y.saleDate, Sales: y.amount})),
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
        columns={columns.map((x) => ({...x, enabled: true}))}
        onClose={handleCloseColumns}
        open={pageState.columnsOpen}
      />
    </Layout>
  )
}

export default ProductsPage
