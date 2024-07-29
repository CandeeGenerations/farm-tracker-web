import Button from '@/components/Button'
import SortableTable from '@/components/SortableTable'
import {addCommas, formatDate} from '@/helpers'
import {IAnimal} from '@/types/animal'
import {ILoggedProduct} from '@/types/loggedProduct'
import {IProduct} from '@/types/product'
import axios, {AxiosResponse} from 'axios'
import dayjs from 'dayjs'
import _sum from 'lodash/sum'
import _uniqBy from 'lodash/uniqBy'
import React, {useEffect, useState} from 'react'

interface ILogsTable {
  logs: ILoggedProduct[]
  // eslint-disable-next-line no-unused-vars
  onShowLoggedProductModal: (loggedProduct?: ILoggedProduct) => void
  onOpenImporter: () => void
  product: IProduct
}

const LogsTable = ({logs, onShowLoggedProductModal, onOpenImporter, product}: ILogsTable): React.ReactElement => {
  const [loading, setLoading] = useState<boolean>(true)
  const [animals, setAnimals] = useState<IAnimal[]>([])

  const getAnimals = async () => {
    const animals: AxiosResponse<{data: IAnimal[]}> = await axios.get('/animal')

    setLoading(false)
    setAnimals(animals.data.data)
  }

  useEffect(() => {
    getAnimals()
  }, [])

  return (
    <div>
      <div className="flex items-center flex-col sm:flex-row mb-5 mt-10">
        <h1 className="flex-1 text-3xl hidden sm:block">Logs</h1>

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

      <SortableTable
        id="logs"
        loading={loading}
        filters={[
          {
            label: 'Log date',
            type: 'daterange',
            column: 'logDate',
          },
          {
            label: 'Breeds',
            type: 'select',
            column: 'breed',
            values: _uniqBy(
              animals
                .filter(x => x.species === product?.species)
                .map(x => ({
                  name: x.breed,
                  species: x.species,
                })),
              'name',
            ).map(({name}) => ({id: name, name})),
          },
        ]}
        searchableColumns={['quantity']}
        actions={{idColumn: 'id'}}
        columns={[
          {name: 'Log Date', id: 'logDate', sortOverride: 'logDateSort'},
          {name: 'Quantity', id: 'quantityDisplay', sortOverride: 'quantity'},
          {name: 'Breed (Species)', id: 'breed', maintainCase: true},
        ]}
        totalRow={[{id: 'quantityDisplay', value: data => `${addCommas(_sum(data.map(x => x.quantity)))}`}]}
        keyName="id"
        defaultSortColumn="logDate"
        defaultSortOrder="desc"
        data={logs?.map(x => ({
          ...x,
          quantityDisplay: `${addCommas(x.quantity)} ${product?.unit}`,
          logDateSort: dayjs(x.logDate).valueOf(),
          logDate: formatDate(x.logDate),
          breed: `${x.breed || '-'} (${x.species || product?.species})`,
        }))}
        onClick={id => onShowLoggedProductModal(logs.find(x => x.id === id))}
      />
    </div>
  )
}

export default LogsTable
