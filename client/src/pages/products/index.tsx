import Button from '@/components/Button'
import Card from '@/components/Card'
import EmptyState from '@/components/EmptyState'
import ImportModal from '@/components/ImportModal'
import Search from '@/components/Search'
import Table from '@/components/Table'
import TableLoader from '@/components/TableLoader'
import {addCommas, setPageState} from '@/helpers'
import {DEBOUNCE} from '@/helpers/constants'
import {IProduct} from '@/types/product'
import axios, {AxiosResponse} from 'axios'
import _debounce from 'lodash/debounce'
import _sum from 'lodash/sum'
import Link from 'next/link'
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'
import Layout from '../_layout'

interface IPageState {
  loading?: boolean
  products?: IProduct[]
  originalProducts?: IProduct[]
  resetSearch?: number
  importerOpen?: boolean
}

const ProductsPage = (): React.ReactElement => {
  const router = useRouter()
  const [pageState, stateFunc] = useState<IPageState>({
    loading: true,
    products: [],
    importerOpen: false,
    originalProducts: [],
    resetSearch: 0,
  })

  const getProducts = async () => {
    const products: AxiosResponse<{data: IProduct[]}> = await axios.get('/product')

    setState({loading: false, products: products.data.data, originalProducts: [...products.data.data]})
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
        <div className="space-y-6 mt-8">
          <div className="flex items-center">
            <Search onSearch={(value, reset) => debounceSearch(value, reset)} resetSearch={pageState.resetSearch} />

            <div className="pt-5 flex-1 text-right">
              <Button type="secondary" className="mr-4" onClick={handleOpenImporter}>
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
              {name: 'Species', id: 'species'},
              {name: 'Logged Amount', id: 'totalLogged'},
              {name: 'Expenses', id: 'expensesAmount'},
              {name: 'Cost Per', id: 'costPer'},
              {name: 'Sales', id: 'salesAmount'},
            ]}
            keyName="id"
            linkKey="name"
            data={pageState.products.map(x => ({
              ...x,
              expensesAmount:
                x.expenses.length > 0
                  ? `$${addCommas(_sum(x.expenses.map(y => y.amount * y.quantity)))} (${x.expenses.length} item${
                      x.expenses.length === 1 ? '' : 's'
                    })`
                  : undefined,
              totalLogged:
                x.loggedProducts.length > 0 ? `${addCommas(_sum(x.loggedProducts.map(y => y.quantity)))} ${x.unit}` : 0,
              costPer: `$${addCommas(
                _sum(x.expenses.map(y => y.amount * y.quantity)) / _sum(x.loggedProducts.map(y => y.quantity)),
              )}`,
              salesAmount: `$${addCommas(_sum(x.sales.map(y => y.amount)))} (${addCommas(
                _sum(x.sales.map(y => y.quantity)),
              )} sold / $${addCommas(
                _sum(x.sales.map(y => y.amount)) / _sum(x.sales.map(y => y.quantity)),
              )} per product)`,
            }))}
          />
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
    </Layout>
  )
}

export default ProductsPage
