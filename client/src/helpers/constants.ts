import dayjs from 'dayjs'

export const DEFAULT_PAGE_SIZE = 10
export const DEFAULT_PAGINATION_LIMIT = 5
export const DEFAULT_DATE_FORMAT = 'M/D/YYYY'
export const DEFAULT_DATE_TIME_FORMAT = 'M/D/YYYY h:mm:ss A'
export const LOADER_TIMEOUT = 300
export const DEBOUNCE = 500
export const LAST_LOGGED_PRODUCT_ID = 'last-logged-product-id'
export const IMPERSONATOR_EMAIL = 'impersonator-email'
export const ANIMALS_FILTER = 'animals-filter'
export const PRODUCTS_COLUMNS = 'products-columns'
export const SALES_COLUMNS = 'sales-columns'
export const ANIMALS_COLUMNS = 'animals-columns'
export const TABLE_FILTERS_STORAGE_KEY = 'farm--table-filters--'

export const YEARS = Array.from(new Array(100), (v, i) => i).map((x) => dayjs().subtract(x, 'year').format('YYYY'))

export const MONTHS = Array.from(new Array(12), (v, i) => i).map((x) =>
  dayjs().startOf('year').add(x, 'month').format('M'),
)
