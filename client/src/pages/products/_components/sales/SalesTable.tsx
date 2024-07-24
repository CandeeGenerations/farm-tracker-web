import Button from '@/components/Button'
import SortableTable from '@/components/SortableTable'
import {addCommas, formatDate} from '@/helpers'
import {TABLE_FILTERS_STORAGE_KEY} from '@/helpers/constants'
import * as storage from '@/helpers/localStorage'
import {IProduct} from '@/types/product'
import {ISale} from '@/types/sale'
import dayjs from 'dayjs'
import _sum from 'lodash/sum'
import React from 'react'

interface ISalesTable {
  sales: ISale[]
  products?: IProduct[]
  // eslint-disable-next-line no-unused-vars
  onShowSaleModal: (sale?: ISale) => void
  onOpenImporter: () => void
  isProductSales: boolean
}

const SalesTable = ({
  sales,
  products = [],
  onShowSaleModal,
  onOpenImporter,
  isProductSales,
}: ISalesTable): React.ReactElement => {
  return (
    <div>
      <div className="flex items-center flex-col sm:flex-row mb-5 mt-10">
        <h1 className="flex-1 text-3xl hidden sm:block">Sales</h1>

        <div className="sm:pt-5 sm:flex-1 w-full sm:w-auto text-right">
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
            values: products.map(x => ({id: x.id, name: x.name})),
          },
        ]}
        searchableColumns={['productName', 'quantity', 'amount']}
        columns={[
          ...(isProductSales ? [] : [{name: 'Product', id: 'productName'}]),
          {name: 'Sale Date', id: 'saleDate', sortOverride: 'saleDateSort'},
          {name: 'Quantity', id: 'quantity'},
          {name: 'Sale Amount', id: 'amountDisplay', sortOverride: 'amount'},
        ]}
        data={sales?.map(x => ({
          ...x,
          amountDisplay: `$${addCommas(x.amount)}`,
          saleDate: formatDate(x.saleDate),
          saleDateSort: dayjs(x.saleDate).format(),
          productName: x.product?.name,
        }))}
        totalRow={[
          {id: 'quantity', value: (data: ISale[]) => addCommas(_sum(data.map(x => x.quantity)))},
          {id: 'amountDisplay', value: (data: ISale[]) => `$${addCommas(_sum(data.map(x => x.amount)))}`},
        ]}
        keyName="id"
        defaultSortColumn="saleDate"
        defaultSortOrder="desc"
        defaultFilters={
          storage.get(`${TABLE_FILTERS_STORAGE_KEY}sales`) &&
          JSON.parse(storage.get(`${TABLE_FILTERS_STORAGE_KEY}sales`))
        }
        onClick={id => onShowSaleModal(sales.find(x => x.id === id))}
      />
    </div>
  )
}

export default SalesTable
