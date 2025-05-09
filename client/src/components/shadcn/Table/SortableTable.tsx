import {applySort} from '@/helpers'
import {DEFAULT_PAGE_SIZE, TABLE_FILTERS_STORAGE_KEY} from '@/helpers/constants'
import * as storage from '@/helpers/localStorage'
import {cn} from '@/lib/utils'
import {ArrowDownIcon, ArrowUpIcon, CheckIcon, Cross1Icon, MagnifyingGlassIcon} from '@radix-ui/react-icons'
import {sentenceCase} from 'change-case-all'
import {endOfDay, isAfter, isBefore, startOfDay, subDays} from 'date-fns'
import Link from 'next/link'
import React, {useEffect, useState} from 'react'

import {Card} from '../Card'
import {DateRangePicker, Input, MultiComboBox, SelectBox} from '../Form'
import {ISelectBoxValues} from '../Form/SelectBox'
import {TableLoader} from '../Loader'
import Pagination from './Pagination'

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
  noClick?: boolean
  className?: string
}

export interface ITableFilter {
  column: string
  type: 'select' | 'multiselect' | 'daterange'
  values?: ISelectBoxValues[]
  label: string
}

interface ISortableTable {
  id?: string
  loading?: boolean
  columns: IColumnHeader[]
  actions?: IActions
  data: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  keyName: string
  linkKey?: string
  defaultSortColumn?: string
  defaultSortOrder?: 'asc' | 'desc'
  defaultFilters?: {[key: string]: string[]}
  editLink?: string
  filters?: ITableFilter[]
  searchableColumns?: string[]
  // eslint-disable-next-line no-unused-vars
  onClick?: (id: string | number) => void
}

const SortableTable = ({
  id,
  columns,
  data = [],
  keyName,
  defaultSortColumn,
  defaultSortOrder,
  defaultFilters,
  linkKey,
  actions,
  loading = false,
  onClick,
  editLink,
  filters = [],
  searchableColumns = [],
}: ISortableTable): React.ReactElement => {
  const [dataset, setDataset] = useState([])
  const [visibleData, setVisibleData] = useState([])
  const [pageNumber, setPageNumber] = useState(1)
  const [sort, setSort] = useState<{column: string; asc: boolean} | undefined>()
  const [initialLoad, setInitialLoad] = useState(true)
  const [filterValues, setFilterValues] = useState<{[key: string]: string[]}>(defaultFilters || {})
  const [searchValue, setSearchValue] = useState('')
  const [pageSize, setPageSize] = useState<number>(
    defaultFilters && defaultFilters.pageSize ? Number(defaultFilters.pageSize[0]) : DEFAULT_PAGE_SIZE,
  )

  const doSort = (dataToSort) => {
    if (sort) {
      const sorted = applySort(sort, dataToSort)

      setDataset(sorted.slice())
      setVisibleData(sorted.slice().splice(0, pageSize))
      setPageNumber(1)
      setInitialLoad(false)
    }
  }

  useEffect(() => {
    if (columns.length > 0 && (sort === undefined || columns.findIndex((x) => x.id === sort.column) < 0)) {
      const columnExists = defaultSortColumn && columns.find(({id}) => id === defaultSortColumn)
      const sortColumn = columnExists ? columns.find(({id}) => id === defaultSortColumn) : columns[0]

      setSort({
        column: sortColumn ? sortColumn.sortOverride || sortColumn.id : columns[0].id,
        asc: defaultSortOrder ? defaultSortOrder === 'asc' : true,
      })
    }
  }, [columns])

  useEffect(() => {
    if (dataset.length > 0) {
      setVisibleData(dataset.slice().splice((pageNumber - 1) * pageSize, pageSize))
    }
  }, [pageNumber])

  useEffect(() => {
    let filteredData = [...data]

    if (searchValue) {
      filteredData = filteredData.filter((x) => {
        for (const column of searchableColumns) {
          if (x[column]?.toString().trim().toLowerCase().includes(searchValue.trim().toLowerCase())) {
            return true
          }
        }

        return false
      })
    }

    const filterKeys = Object.keys(filterValues)

    if (filterKeys.length > 0) {
      for (const filterKey of filterKeys) {
        const filter = filterValues[filterKey]

        if (!filter || filterKey === 'pageSize' || filter.includes('__all__') || filter.length === 0) {
          continue
        }

        const filterType = filters.find((f) => f.column === filterKey)?.type

        if (filterType === 'daterange') {
          filteredData = filteredData.filter((x) => {
            const date = new Date(x[filterKey])
            const startDate = startOfDay(new Date(filter[0]))
            const endDate = endOfDay(new Date(filter[1]))

            return isAfter(date, startDate) && isBefore(date, endDate)
          })
        } else {
          if (filterType === 'multiselect' && (!filter || filter.length === 0)) {
            continue
          }

          filteredData = filteredData.filter((x) => {
            for (const filterValue of filter) {
              if (x[filterKey].toString().trim().toLowerCase() === filterValue.trim().toLowerCase()) {
                return true
              }
            }

            return false
          })
        }
      }
    }

    doSort(filteredData)
  }, [searchValue, filterValues, data, sort, pageSize])

  const handleFilter = (column, value) => {
    const updatedFilters = {...filterValues, [column]: value, pageSize: [`${pageSize}`]}

    if (id) {
      storage.set(`${TABLE_FILTERS_STORAGE_KEY}${id}`, JSON.stringify(updatedFilters))
    }

    setFilterValues(updatedFilters)
  }

  const renderSort = (column) => {
    if (sort && column === sort.column) {
      const classes = 'w-4 h-4 ml-2'

      if (sort.asc) {
        return <ArrowUpIcon className={classes} />
      }

      return <ArrowDownIcon className={classes} />
    }
  }

  const handleChangePageSize = (size: number) => {
    if (id) {
      const updatedFilters = {...filterValues, pageSize: [`${size}`]}
      storage.set(`${TABLE_FILTERS_STORAGE_KEY}${id}`, JSON.stringify(updatedFilters))
    }

    setPageSize(size)
  }

  return initialLoad || loading ? (
    <TableLoader columns={columns} hasFilters={filters?.length > 0} hasActions={!!actions} />
  ) : (
    <Card noPadding>
      <div className="space-y-0">
        {filters?.length > 0 && (
          <div className="bg-muted-lightest border-b border-muted-light mb-0 px-6 py-4 flex flex-col sm:flex-row gap-3 sm:gap-6 sm:items-center rounded-t-lg">
            {searchableColumns?.length > 0 && (
              <div className="flex-1">
                <Input
                  pre={<MagnifyingGlassIcon className="w-4 h-4" />}
                  name="search"
                  placeholder="Search..."
                  value={searchValue}
                  onFieldChange={(_, value) => setSearchValue(value as string)}
                />
              </div>
            )}

            {filters.map((filter) => (
              <div key={Math.random()}>
                {filter.type === 'daterange' ? (
                  <DateRangePicker
                    name={filter.column}
                    align="end"
                    placeholder={`Filter on ${filter.label}`}
                    className="sm:w-72"
                    onChange={(value) => {
                      if (value?.from && value?.to) {
                        handleFilter(filter.column, [value.from, value.to])
                      } else {
                        handleFilter(filter.column, [])
                      }
                    }}
                    value={
                      filterValues[filter.column]?.length === 2
                        ? {from: new Date(filterValues[filter.column][0]), to: new Date(filterValues[filter.column][1])}
                        : undefined
                    }
                    predefinedRanges={[
                      {
                        label: 'Today',
                        value: 'today',
                        getRangeFor: (now) => ({from: now, to: now}),
                      },
                      {
                        label: 'Last 7 Days',
                        value: 'last7days',
                        getRangeFor: (now) => ({
                          from: subDays(now, 7),
                          to: now,
                        }),
                      },
                      {
                        label: 'Last 30 Days',
                        value: 'last30days',
                        getRangeFor: (now) => ({
                          from: subDays(now, 30),
                          to: now,
                        }),
                      },
                    ]}
                  />
                ) : filter.type === 'select' ? (
                  <SelectBox
                    placeholder={`Filter on ${filter.label}`}
                    className="sm:w-52"
                    onChange={(value) => handleFilter(filter.column, [value])}
                    value={filterValues[filter.column] ? filterValues[filter.column][0] : undefined}
                    defaultValue="__all__"
                    values={[{value: '__all__', label: 'All'}].concat(filter.values)}
                    renderValue={(value) => (
                      <>
                        <strong>{filter.label}:</strong> {value.label}
                      </>
                    )}
                  />
                ) : filter.type === 'multiselect' ? (
                  <MultiComboBox
                    label={`Filter on ${filter.label}`}
                    className="sm:w-52"
                    onChange={(value) => handleFilter(filter.column, value)}
                    selectedValues={filterValues[filter.column] ?? []}
                    values={filter.values}
                  />
                ) : (
                  <div />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="overflow-y-auto rounded-t-lg">
          <table className="min-w-full divide-y divide-muted-light">
            <thead className="bg-muted-lightest">
              <tr className="border-b border-muted-light">
                {columns.length > 0 ? (
                  <>
                    {columns.map(({name, id, noSort, sortOverride, maintainCase}, index) => (
                      <th
                        key={index}
                        scope="col"
                        className={cn(
                          'px-6 py-3 text-left font-medium text-muted-mid tracking-wider',
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
                  <th scope="col" className="px-6 py-3 text-left font-medium text-muted-mid tracking-wider">
                    ...
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-muted-light bg-white">
              {visibleData.length > 0 ? (
                visibleData.map((row, index) => (
                  <tr
                    key={row[keyName]}
                    className={cn(index % 2 == 0 ? '' : 'bg-muted-lightest', onClick && 'hover:bg-muted-light-medium')}
                  >
                    {columns.map(({id, noClick}, index) => {
                      const item = row[id]
                      const isBool = typeof item === 'boolean'
                      const displayValue = item || '-'

                      return (
                        <td
                          key={index}
                          className={cn(
                            'px-6 py-4 whitespace-nowrap text-muted-mid',
                            onClick && !noClick ? 'cursor-pointer' : '',
                          )}
                          style={{height: 67}}
                          onClick={() => !noClick && onClick(row[keyName])}
                        >
                          {isBool ? (
                            item ? (
                              <CheckIcon className="text-success-medium h-6 w-6 mx-auto" />
                            ) : (
                              <Cross1Icon className="text-danger h-6 w-6 mx-auto" />
                            )
                          ) : id === linkKey ? (
                            actions ? (
                              <Link
                                href={
                                  editLink
                                    ? `${editLink}/${row[actions.idColumn]}`
                                    : `${actions.parent}/edit/${row[actions.idColumn]}`
                                }
                                className="text-primary-600 hover:text-primary underline"
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
                  <td colSpan={columns.length + 1} className="px-6 py-4 whitespace-nowrap text-muted-mid">
                    Nothing to display
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          totalCount={dataset.length}
          pageNumber={pageNumber}
          onPageChange={setPageNumber}
          pageSize={pageSize}
          onPageSizeChange={handleChangePageSize}
        />
      </div>
    </Card>
  )
}

export default SortableTable
