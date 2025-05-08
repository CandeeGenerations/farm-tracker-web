import Button from '@/components/Button'
import SortableTable from '@/components/SortableTable'
import {addCommas, formatDate} from '@/helpers'
import {SALES_COLUMNS, TABLE_FILTERS_STORAGE_KEY} from '@/helpers/constants'
import * as storage from '@/helpers/localStorage'
import {IProduct} from '@/types/product'
import {ISale} from '@/types/sale'
import dayjs from 'dayjs'
import _sum from 'lodash/sum'
import React, {useState} from 'react'

import ColumnsModal from '../_ColumnsModal'

interface ISalesTable {
  sales: ISale[]
  products?: IProduct[]
  // eslint-disable-next-line no-unused-vars
  onShowSaleModal: (sale?: ISale) => void
  onOpenImporter: () => void
  isProductSales: boolean
  loading?: boolean
}

const SalesTable = ({
  sales,
  products = [],
  onShowSaleModal,
  onOpenImporter,
  isProductSales,
  loading = false,
}: ISalesTable): React.ReactElement => {
  const [columnsOpen, setColumnsOpen] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState<string[]>([])

  const handleOpenColumns = () => setColumnsOpen(true)

  const handleCloseColumns = () => {
    const storedColumnsString = storage.get(SALES_COLUMNS)

    setColumnsOpen(false)
    setVisibleColumns(storedColumnsString ? storedColumnsString.split(',') : [])
  }

  const columns = [
    ...(isProductSales ? [] : [{name: 'Product', id: 'productName'}]),
    {name: 'Customer Name', id: 'customerName'},
    {name: 'Quantity', id: 'quantity'},
    {name: 'Sale Amount', id: 'amountDisplay', sortOverride: 'amount'},
  ]

  return (
    <div>
      <div className="flex items-center flex-col sm:flex-row mb-5 mt-10">
        <h1 className="flex-1 text-3xl hidden sm:block">Sales</h1>

        <div className="sm:pt-5 sm:flex-1 w-full sm:w-auto text-right">
          <Button className="sm:mr-4" onClick={handleOpenColumns}>
            Columns
          </Button>

          {isProductSales && (
            <Button type="secondary" className="mr-4" onClick={onOpenImporter}>
              Import sales
            </Button>
          )}

          <Button type="primary" onClick={() => onShowSaleModal()}>
            Add sale
          </Button>
        </div>
      </div>

      <SortableTable
        id="sales"
        loading={loading}
        filters={[
          {
            label: 'Sale date',
            type: 'daterange',
            column: 'saleDate',
          },
          {
            label: 'Product',
            type: 'select',
            column: 'productId',
            values: products.map((x) => ({id: x.id, name: x.name})),
          },
        ]}
        searchableColumns={['customerName', 'productName', 'quantity', 'amount']}
        columns={[
          {name: 'Sale Date', id: 'saleDate', sortOverride: 'saleDateSort'},
          ...(visibleColumns.length > 0 ? columns.filter((x) => visibleColumns.includes(x.id)) : columns),
        ]}
        data={sales?.map((x) => ({
          ...x,
          amountDisplay: `$${addCommas(x.amount)}`,
          saleDate: formatDate(x.saleDate),
          saleDateSort: dayjs(x.saleDate).valueOf(),
          productName: x.product?.name,
          customerName: x.customerName,
        }))}
        totalRow={[
          {id: 'quantity', value: (data: ISale[]) => addCommas(_sum(data.map((x) => x.quantity)))},
          {id: 'amountDisplay', value: (data: ISale[]) => `$${addCommas(_sum(data.map((x) => x.amount)))}`},
        ]}
        keyName="id"
        defaultSortColumn="saleDate"
        defaultSortOrder="desc"
        defaultFilters={
          storage.get(`${TABLE_FILTERS_STORAGE_KEY}sales`) &&
          JSON.parse(storage.get(`${TABLE_FILTERS_STORAGE_KEY}sales`))
        }
        onClick={(id) => onShowSaleModal(sales.find((x) => x.id === id))}
      />

      <ColumnsModal
        storageKey={SALES_COLUMNS}
        columns={columns.map((x) => ({...x, enabled: true}))}
        onClose={handleCloseColumns}
        open={columnsOpen}
      />
    </div>
  )
}

export default SalesTable
