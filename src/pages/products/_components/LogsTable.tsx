import Button from '@/components/Button'
import Table from '@/components/Table'
import {addCommas, formatDate} from '@/helpers'
import {ILoggedProduct, IProduct} from '@/morphs/product.morph'
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
      <div className="flex items-center mb-5 mt-10">
        <h1 className="flex-1 text-3xl">
          Logs ({logs?.length} log{logs?.length === 1 ? '' : 's'} - {addCommas(_sum(logs?.map(x => x.quantity)))}{' '}
          {product?.unit})
        </h1>

        <Button type="secondary" className="mr-4" onClick={onOpenImporter}>
          Import logs
        </Button>

        <Button
          type="primary"
          onClick={() =>
            onShowLoggedProductModal({id: undefined, logDate: dayjs().format(), quantity: 1, productId: product.id})
          }
        >
          Add log
        </Button>
      </div>

      <Table
        actions={{idColumn: 'id'}}
        columns={[
          {name: 'Log Date', id: 'logDate'},
          {name: 'Quantity', id: 'quantity'},
          {name: 'Breed (Species)', id: 'breed', maintainCase: true},
        ]}
        keyName="id"
        linkKey="logDate"
        defaultSortColumn="logDate"
        defaultSortOrder="desc"
        data={logs?.map(x => ({
          ...x,
          quantity: `${addCommas(x.quantity)} ${product?.unit}`,
          logDate: formatDate(x.logDate),
          breed: `${x.breed || '-'} (${x.species || product?.species})`,
        }))}
        onEdit={id => onShowLoggedProductModal(logs.find(x => x.id === id))}
      />
    </div>
  )
}

export default LogsTable
