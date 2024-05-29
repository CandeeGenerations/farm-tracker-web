import Button from '@/components/Button'
import Table from '@/components/Table'
import {addCommas, formatDate} from '@/helpers'
import {ISale} from '@/types/sale'
import dayjs from 'dayjs'
import _sum from 'lodash/sum'
import React from 'react'

interface ISalesTable {
  sales: ISale[]
  // eslint-disable-next-line no-unused-vars
  onShowSaleModal: (sale?: ISale) => void
  onOpenImporter: () => void
}

const SalesTable = ({sales, onShowSaleModal, onOpenImporter}: ISalesTable): React.ReactElement => {
  const totalSold = _sum((sales || []).map(x => x.quantity))

  return (
    <div>
      <div className="flex items-center flex-col sm:flex-row mb-5 mt-10">
        <h1 className="flex-1 text-3xl hidden sm:block">Sales</h1>

        <div className="sm:pt-5 sm:flex-1 w-full sm:w-auto text-right">
          <Button type="secondary" className="mr-4" onClick={onOpenImporter}>
            Import sales
          </Button>

          <Button type="primary" onClick={() => onShowSaleModal()}>
            Add sale
          </Button>
        </div>
      </div>

      <Table
        actions={{idColumn: 'id'}}
        columns={[
          {name: 'Sale Date', id: 'saleDate', sortOverride: 'saleDateSort'},
          {name: 'Quantity', id: 'quantity'},
          {name: 'Sale Amount', id: 'amount'},
        ]}
        totalRow={[
          {id: 'quantity', value: `${totalSold}`},
          {id: 'amount', value: `$${addCommas(_sum(sales.map(x => x.amount)))}`},
        ]}
        keyName="id"
        linkKey="saleDate"
        defaultSortColumn="saleDate"
        defaultSortOrder="desc"
        onEdit={id => onShowSaleModal(sales.find(x => x.id === id))}
        data={sales?.map(x => ({
          ...x,
          amount: `$${addCommas(x.amount)}`,
          saleDate: formatDate(x.saleDate),
          saleDateSort: dayjs(x.saleDate).format(),
        }))}
      />
    </div>
  )
}

export default SalesTable
