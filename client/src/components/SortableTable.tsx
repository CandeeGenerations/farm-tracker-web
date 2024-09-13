import {addCommas, applySort, classNames} from '@/helpers'
import {DEFAULT_PAGE_SIZE, TABLE_FILTERS_STORAGE_KEY} from '@/helpers/constants'
import * as storage from '@/helpers/localStorage'
import {ArrowDownIcon, ArrowUpIcon, MagnifyingGlassIcon} from '@heroicons/react/20/solid'
import {CheckIcon, XMarkIcon} from '@heroicons/react/24/outline'
import {
  DateRangePicker,
  DateRangePickerItem,
  MultiSelect,
  MultiSelectItem,
  Select,
  SelectItem,
  TextInput,
} from '@tremor/react'
import {sentenceCase} from 'change-case-all'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import Link from 'next/link'
import React, {useEffect, useState} from 'react'

import Card from './Card'
import {IFormSelectItem} from './FormSelect'
import Pagination from './Pagination'
import {ITotalRow} from './Table'
import TableLoader from './TableLoader'

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

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
  values?: IFormSelectItem[]
  label: string
}

interface ISortableTable {
  id?: string
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
  totalRow?: ITotalRow[]
  loading?: boolean
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
  onClick,
  editLink,
  totalRow,
  loading = false,
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

        const filterType = filters.find((x) => x.column === filterKey).type

        if (filterType === 'daterange') {
          filteredData = filteredData.filter((x) => {
            const date = dayjs(x[filterKey])

            return (
              date.isSameOrAfter(dayjs(filter[0]).startOf('day')) && date.isSameOrBefore(dayjs(filter[1]).endOf('day'))
            )
          })
        } else {
          filteredData = filteredData.filter((x) => {
            for (const filterValue of filter) {
              if (
                Array.isArray(x[filterKey]) &&
                x[filterKey].some((y) => y.toString().trim().toLowerCase() === filterValue?.trim().toLowerCase())
              ) {
                return true
              } else if (x[filterKey]?.toString().trim().toLowerCase() === filterValue?.trim().toLowerCase()) {
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
          <div
            className={classNames(
              'bg-muted-lightest border-b border-muted-light mb-0 px-6 py-4 rounded-t-lg gap-3 sm:gap-6 flex flex-col',
              filters.length < 4 ? 'sm:flex-row sm:items-center' : 'sm:grid sm:grid-cols-4',
            )}
          >
            {searchableColumns?.length > 0 && (
              <div
                className={classNames('flex-1', `col-span-${filters.length % 4 === 0 ? 4 : 4 - (filters.length % 4)}`)}
              >
                <TextInput
                  icon={MagnifyingGlassIcon}
                  placeholder="Search..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            )}

            {filters.map((filter) => (
              <div key={Math.random()}>
                {filter.type === 'daterange' ? (
                  <DateRangePicker
                    className="max-w-md mx-auto"
                    onValueChange={(value) =>
                      handleFilter(
                        filter.column,
                        value.from || value.to ? [value.from?.toISOString(), value.to?.toISOString()] : undefined,
                      )
                    }
                    value={
                      filterValues[filter.column]
                        ? {
                            from: filterValues[filter.column][0] && new Date(filterValues[filter.column][0]),
                            to: new Date(filterValues[filter.column][1] || dayjs().format()),
                          }
                        : undefined
                    }
                    placeholder={filter.label}
                    selectPlaceholder="Select range"
                  >
                    <DateRangePickerItem
                      key="today"
                      value="today"
                      from={new Date(dayjs().toISOString())}
                      to={new Date(dayjs().toISOString())}
                    >
                      Today
                    </DateRangePickerItem>

                    <DateRangePickerItem
                      key="seven"
                      value="seven"
                      from={new Date(dayjs().subtract(7, 'days').toISOString())}
                      to={new Date(dayjs().toISOString())}
                    >
                      Last 7 days
                    </DateRangePickerItem>

                    <DateRangePickerItem
                      key="thirty"
                      value="thirty"
                      from={new Date(dayjs().subtract(30, 'days').toISOString())}
                      to={new Date(dayjs().toISOString())}
                    >
                      Last 30 days
                    </DateRangePickerItem>
                  </DateRangePicker>
                ) : filter.type === 'select' ? (
                  <Select
                    placeholder={`Filter on ${filter.label}`}
                    className="sm:w-52 !w-full"
                    onValueChange={(value) => handleFilter(filter.column, [value])}
                    value={filterValues[filter.column] ? filterValues[filter.column][0] : undefined}
                    defaultValue="__all__"
                  >
                    {[{id: '__all__', name: 'All'} as unknown as IFormSelectItem].concat(filter.values).map((x) => (
                      <SelectItem key={x.id} value={x.id as string}>
                        <strong>{filter.label}:</strong> {x.name}
                      </SelectItem>
                    ))}
                  </Select>
                ) : filter.type === 'multiselect' ? (
                  <MultiSelect
                    placeholder={`Filter on ${filter.label}`}
                    className="sm:w-52 !w-full"
                    onValueChange={(value) => handleFilter(filter.column, value)}
                    value={filterValues[filter.column]}
                  >
                    {filter.values.map((x) => (
                      <MultiSelectItem key={x.id} value={x.id as string}>
                        <strong>{filter.label}:</strong> {x.name}
                      </MultiSelectItem>
                    ))}
                  </MultiSelect>
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
                  <tr
                    key={row[keyName]}
                    className={classNames(
                      index % 2 == 0 ? '' : 'bg-muted-lightest',
                      onClick && 'hover:bg-muted-light-medium',
                    )}
                  >
                    {columns.map(({id, noClick}, index) => {
                      const item = row[id]
                      const isBool = typeof item === 'boolean'
                      const displayValue = item || '-'

                      return (
                        <td
                          key={index}
                          className={classNames(
                            'px-6 py-4 whitespace-nowrap text-muted',
                            onClick && !noClick ? 'cursor-pointer' : '',
                          )}
                          style={{height: 67}}
                          onClick={() => !noClick && onClick && onClick(row[keyName])}
                        >
                          {isBool ? (
                            item ? (
                              <CheckIcon className="text-success-medium h-6 w-6 mx-auto" />
                            ) : (
                              <XMarkIcon className="text-danger h-6 w-6 mx-auto" />
                            )
                          ) : id === linkKey ? (
                            actions ? (
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

              {totalRow && (
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-muted border-t-2 total-border">
                    <strong>Total: {addCommas(dataset.length, 0)}</strong>
                  </td>

                  {columns.map(({id}, index) => {
                    return index === 0 ? undefined : (
                      <td key={index} className="px-6 py-4 whitespace-nowrap text-muted border-t-2 total-border">
                        {totalRow.find((x) => x.id === id)?.value(dataset)}
                      </td>
                    )
                  })}
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
