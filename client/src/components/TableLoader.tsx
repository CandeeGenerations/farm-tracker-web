import ContentLoader from 'react-content-loader'
import {classNames} from '@/helpers'
import {IColumnHeader} from './SortableTable'
import Card from './Card'
import {sentenceCase} from 'change-case-all'

export interface ITableLoader {
  columns: IColumnHeader[]
  hasActions?: boolean
  hasFilters?: boolean
}

const TableLoaderRow = ({colSpan}: {colSpan: number}) => (
  <>
    {[0, 1, 2].map(x => (
      <tr key={x}>
        <td colSpan={colSpan} className={classNames(x === 0 ? 'pt-4' : x === 2 ? 'pb-4' : '', 'px-6 py-2 w-full')}>
          <ContentLoader viewBox="0 0 100 2">
            <rect x="0" y="0" rx="0" ry="0" width={100} height={2} />
          </ContentLoader>
        </td>
      </tr>
    ))}
  </>
)

export const TableLoader = ({columns, hasActions = false, hasFilters = false}: ITableLoader) => {
  return (
    <Card noPadding>
      <div className="space-y-0">
        {hasFilters && (
          <div className="bg-muted-lightest border-b border-muted-light mb-0 px-6 py-4 flex flex-col sm:flex-row gap-3 sm:gap-6 sm:items-center rounded-t-lg h-[71px]" />
        )}

        <div className="overflow-y-auto rounded-t-lg">
          <table className="min-w-full divide-y divide-muted-light">
            <thead className="bg-muted-lightest">
              <tr>
                {columns.length > 0 ? (
                  <>
                    {columns.map(({name, maintainCase}, index) => (
                      <th
                        key={index}
                        scope="col"
                        className={classNames(
                          'px-6 py-3 text-left font-medium text-muted tracking-wider',
                          index === columns.length - 1 ? '' : 'border-r border-muted-light',
                        )}
                      >
                        <div className="flex">
                          <div className="flex-grow">{maintainCase ? name : sentenceCase(name)}</div>
                        </div>
                      </th>
                    ))}

                    {hasActions && <th scope="col" className="border-l border-muted-light px-6 py-3 tracking-wider" />}
                  </>
                ) : (
                  <th scope="col" className="px-6 py-3 text-left font-medium text-muted tracking-wider">
                    ...
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="bg-white">
              <TableLoaderRow colSpan={columns.length + 2} />
            </tbody>
          </table>
        </div>

        <div className="bg-muted-lightest px-4 flex items-center justify-between border-t border-muted-light sm:px-6 rounded-b-lg h-[62px]" />
      </div>
    </Card>
  )
}

export default TableLoader
