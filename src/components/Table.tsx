import {applySort, classNames} from '@/helpers'
import {DEFAULT_PAGE_SIZE} from '@/helpers/constants'
import {ArrowSmallDownIcon, ArrowSmallUpIcon, CheckIcon, XMarkIcon} from '@heroicons/react/24/outline'
import {sentenceCase} from 'change-case'
import Link from 'next/link'
import React, {useEffect, useState} from 'react'
import Card from './Card'
import TableLoader from './TableLoader'

export interface IActions {
  idColumn: string
  parent?: string
}

export interface IColumnHeader {
  id: string
  name: string
  sortOverride?: string
  maintainCase?: boolean
  noSort?: boolean
}

interface ITable {
  columns: IColumnHeader[]
  actions?: IActions
  data: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  keyName: string
  linkKey?: string
  defaultSortColumn?: string
  defaultSortOrder?: 'asc' | 'desc'
  editLink?: string
  // eslint-disable-next-line no-unused-vars
  onEdit?: (id: string | number) => void
}

const Table = ({
  columns,
  data,
  keyName,
  defaultSortColumn,
  defaultSortOrder,
  linkKey,
  actions,
  onEdit,
  editLink,
}: ITable): React.ReactElement => {
  const [dataset, setDataset] = useState([])
  const [visibleData, setVisibleData] = useState([])
  const [pageNumber, setPageNumber] = useState(1)
  const [sort, setSort] = useState<{column: string; asc: boolean} | undefined>()
  const [initialLoad, setInitialLoad] = useState(true)

  const doSort = dataToSort => {
    if (sort) {
      const sorted = applySort(sort, dataToSort)

      setDataset(sorted.slice())
      setVisibleData(sorted.slice().splice(0, DEFAULT_PAGE_SIZE))
      setPageNumber(1)
      setInitialLoad(false)
    }
  }

  useEffect(() => {
    if (columns.length > 0 && (sort === undefined || columns.findIndex(x => x.id === sort.column) < 0)) {
      const columnExists = defaultSortColumn && columns.find(({id}) => id === defaultSortColumn)

      setSort({
        column: columnExists ? defaultSortColumn : columns[0].id,
        asc: defaultSortOrder ? defaultSortColumn === 'asc' : true,
      })
    }
  }, [columns])

  useEffect(() => {
    doSort(data)
  }, [data, sort])

  useEffect(() => {
    if (dataset.length > 0) {
      setVisibleData(dataset.slice().splice((pageNumber - 1) * DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZE))
    }
  }, [pageNumber])

  const renderSort = column => {
    if (sort && column === sort.column) {
      const classes = 'w-4 h-4 ml-2'

      if (sort.asc) {
        return <ArrowSmallUpIcon className={classes} />
      }

      return <ArrowSmallDownIcon className={classes} />
    }
  }

  return initialLoad ? (
    <TableLoader />
  ) : (
    <Card noPadding>
      <div className="space-y-0">
        <div className="overflow-y-auto">
          <table className="min-w-full divide-y divide-muted-light">
            <thead className="bg-muted-lightest">
              <tr className="rounded-t">
                {columns.length > 0 ? (
                  <>
                    {columns.map(({name, id, noSort, sortOverride, maintainCase}, index) => (
                      <th
                        key={index}
                        scope="col"
                        className={classNames(
                          'px-6 py-3 text-left font-medium text-muted tracking-wider',
                          noSort ? '' : 'cursor-pointer hover:bg-muted-light-medium',
                          index === columns.length - 1 ? '' : 'border-r border-muted-light',
                        )}
                        onClick={() =>
                          !noSort &&
                          setSort({
                            column: sortOverride || id,
                            asc: (sortOverride || id) === sort.column ? !sort.asc : true,
                          })
                        }
                      >
                        <div className="flex items-center">
                          <div className="flex-grow">{maintainCase ? name : sentenceCase(name)}</div>

                          {!noSort && renderSort(sortOverride || id)}
                        </div>
                      </th>
                    ))}
                  </>
                ) : (
                  <th scope="col" className="px-6 py-3 text-left font-medium text-muted tracking-wider">
                    ...
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-muted-light bg-white">
              {visibleData.length > 0 ? (
                visibleData.map((row, index) => (
                  <tr key={row[keyName]} className={index % 2 == 0 ? '' : 'bg-muted-lightest'}>
                    {columns.map(({id}, index) => {
                      const item = row[id]
                      const isBool = typeof item === 'boolean'
                      const displayValue = item || '-'

                      return (
                        <td key={index} className="px-6 py-4 whitespace-nowrap text-muted" style={{height: 67}}>
                          {isBool ? (
                            item ? (
                              <CheckIcon className="text-success-medium h-6 w-6 mx-auto" />
                            ) : (
                              <XMarkIcon className="text-danger h-6 w-6 mx-auto" />
                            )
                          ) : id === linkKey ? (
                            onEdit ? (
                              <span
                                className="text-primary-medium hover:text-primary underline cursor-pointer"
                                onClick={() => onEdit(row[actions.idColumn])}
                              >
                                {displayValue}
                              </span>
                            ) : !onEdit && actions ? (
                              <Link
                                href={
                                  editLink
                                    ? `${editLink}/${row[actions.idColumn]}`
                                    : `${actions.parent}/edit/${row[actions.idColumn]}`
                                }
                                className="text-primary-medium hover:text-primary underline"
                              >
                                {displayValue}
                              </Link>
                            ) : (
                              displayValue
                            )
                          ) : (
                            displayValue
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-4 whitespace-nowrap text-muted">
                    Nothing to display
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  )
}

export default Table
