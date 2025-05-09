import {cn} from '@/lib/utils'
import React from 'react'

import {IColumnHeader} from './SortableTable'

interface IBasicTable {
  columns: IColumnHeader[]
  data: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  keyName: string
}

const BasicTable = ({columns, data, keyName}: IBasicTable): React.ReactElement => {
  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-muted-light">
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={column.id}
                    scope="col"
                    className={cn(
                      'text-left font-semibold text-muted-medium',
                      index === 0
                        ? 'py-3.5 pl-4 pr-3 sm:pl-0'
                        : index === columns.length - 1
                          ? 'py-3.5 pl-3 pr-4 sm:pr-0 '
                          : 'px-3 py-3.5',
                    )}
                  >
                    {column.name}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-muted-light">
              {data.map((item) => (
                <tr key={item[keyName]}>
                  {columns.map((column, index) => (
                    <td
                      key={column.id}
                      className={cn(
                        'whitespace-nowrap py-4',
                        index === 0 ? 'pl-4 pr-3 sm:pl-0' : index === columns.length - 1 ? 'pl-3 pr-4 sm:pr-0' : 'px-3',
                        column.className,
                      )}
                    >
                      {item[column.id]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default BasicTable
