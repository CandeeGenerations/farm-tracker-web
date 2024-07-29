import ContentLoader from 'react-content-loader'
import Card, {ICard} from './Card'
import {IColumnHeader} from './SortableTable'

export interface ICardLoader {
  columns: IColumnHeader[]
  hasActions?: boolean
  hasFilters?: boolean
}

export const CardLoader = (props: ICard) => {
  return (
    <Card {...props}>
      <ContentLoader viewBox="0 0 100 18">
        <rect x="0" y="0" rx="0" ry="0" width={100} height={4} />
        <rect x="0" y="6" rx="0" ry="0" width={60} height={4} />
        <rect x="0" y="12" rx="0" ry="0" width={75} height={4} />
      </ContentLoader>
    </Card>
  )
}

export default CardLoader
