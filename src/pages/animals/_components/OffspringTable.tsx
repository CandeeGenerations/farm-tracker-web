import Table from '@/components/Table'
import {formatDate} from '@/helpers'
import {IAnimal} from '@/pages/api/_morphs/animal.morph'
import dayjs from 'dayjs'
import React from 'react'

interface IOffspringTable {
  children: IAnimal[]
}

const OffspringTable = ({children}: IOffspringTable): React.ReactElement => {
  return (
    <div>
      <h1 className="text-3xl mb-5 mt-6">Offspring ({children?.length})</h1>

      <Table
        actions={{idColumn: 'id', parent: '/animals'}}
        columns={[
          {name: 'Name', id: 'name'},
          {name: 'Birthdate', id: 'birthDate', sortOverride: 'birthDateSort'},
          {name: 'Deceased', id: 'deceased'},
          {name: 'Sold', id: 'sold'},
        ]}
        keyName="id"
        linkKey="name"
        data={children?.map(x => ({
          ...x,
          birthDate: formatDate(x.birthDate),
          birthDateSort: dayjs(x.birthDate).format(),
        }))}
      />
    </div>
  )
}

export default OffspringTable
