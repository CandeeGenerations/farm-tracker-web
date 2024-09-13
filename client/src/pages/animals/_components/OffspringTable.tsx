import SortableTable from '@/components/SortableTable'
import {formatDate} from '@/helpers'
import {IAnimal} from '@/types/animal'
import dayjs from 'dayjs'
import React from 'react'

interface IOffspringTable {
  offspring: IAnimal[]
}

const OffspringTable = ({offspring}: IOffspringTable): React.ReactElement => {
  return (
    <div>
      <h1 className="text-3xl mb-5 mt-6">Offspring</h1>

      <SortableTable
        id="animals-offspring"
        filters={[
          {
            label: 'Birth date',
            type: 'daterange',
            column: 'birthDate',
          },
          {
            label: 'Deceased',
            type: 'select',
            column: 'deceased',
            values: [
              {id: 'true', name: 'Yes'},
              {id: 'false', name: 'No'},
            ],
          },
          {
            label: 'Sold',
            type: 'select',
            column: 'sold',
            values: [
              {id: 'true', name: 'Yes'},
              {id: 'false', name: 'No'},
            ],
          },
        ]}
        searchableColumns={['name', 'birthDate']}
        columns={[
          {name: 'Name', id: 'name'},
          {name: 'Birth date', id: 'birthDate', sortOverride: 'birthDateSort'},
          {name: 'Deceased', id: 'deceased'},
          {name: 'Sold', id: 'sold'},
        ]}
        actions={{idColumn: 'id', parent: '/animals'}}
        keyName="id"
        linkKey="name"
        data={offspring?.map((x) => ({
          ...x,
          birthDate: formatDate(x.birthDate),
          birthDateSort: dayjs(x.birthDate).format(),
        }))}
      />
    </div>
  )
}

export default OffspringTable
