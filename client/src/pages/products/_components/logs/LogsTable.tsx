import Button from '@/components/Button'
import Table from '@/components/Table'
import {addCommas, formatDate} from '@/helpers'
import {ILoggedProduct} from '@/types/loggedProduct'
import {IProduct} from '@/types/product'
import dayjs from 'dayjs'
import _sum from 'lodash/sum'
import React from 'react'

interface ILogsTable {
  logs: ILoggedProduct[]
  // eslint-disable-next-line no-unused-vars
  onShowLoggedProductModal: (loggedProduct?: ILoggedProduct) => void
  onOpenImporter: () => void
  product: IProduct
}

const LogsTable = ({logs, onShowLoggedProductModal, onOpenImporter, product}: ILogsTable): React.ReactElement => {
  return (
    <div>
      <div className="flex items-center flex-col sm:flex-row mb-5 mt-10">
        <h1 className="flex-1 text-3xl hidden sm:block">ExpLogsenses</h1>

        <div className="sm:pt-5 sm:flex-1 w-full sm:w-auto text-right">
          <Button type="secondary" className="mr-4" onClick={onOpenImporter}>
            Import logs
          </Button>

          <Button
            type="primary"
            onClick={() =>
              onShowLoggedProductModal({
                id: undefined,
                owner: undefined,
                logDate: dayjs().format(),
                quantity: 1,
                productId: product.id,
              })
            }
          >
            Add log
          </Button>
        </div>
      </div>

      <Table
        actions={{idColumn: 'id'}}
        columns={[
          {name: 'Log Date', id: 'logDate', sortOverride: 'logDateSort'},
          {name: 'Quantity', id: 'quantity'},
          {name: 'Breed (Species)', id: 'breed', maintainCase: true},
        ]}
        totalRow={[{id: 'quantity', value: `${addCommas(_sum(logs?.map(x => x.quantity)))}`}]}
        keyName="id"
        linkKey="logDate"
        defaultSortColumn="logDate"
        defaultSortOrder="desc"
        data={logs?.map(x => ({
          ...x,
          quantity: `${addCommas(x.quantity)} ${product?.unit}`,
          logDateSort: dayjs(x.logDate).format(),
          logDate: formatDate(x.logDate),
          breed: `${x.breed || '-'} (${x.species || product?.species})`,
        }))}
        onEdit={id => onShowLoggedProductModal(logs.find(x => x.id === id))}
      />
    </div>
  )
}

export default LogsTable
