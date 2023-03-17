import dayjs from 'dayjs'

export const DEFAULT_PAGE_SIZE = 10
export const DEFAULT_DATE_FORMAT = 'M/D/YYYY'
export const DEFAULT_DATE_TIME_FORMAT = 'M/D/YYYY h:mm:ss A'
export const LOADER_TIMEOUT = 300
export const DEBOUNCE = 500
export const EXPENSES_CHART_LOCAL_STORAGE = 'expenses-chart'
export const LOGS_CHART_LOCAL_STORAGE = 'logs-chart'
export const LAST_LOGGED_PRODUCT_ID = 'last-logged-product-id'

export const CHART_TYPES = [
  {id: 'previousMonths', name: 'Previous months'},
  {id: 'yearly', name: 'Yearly'},
  {id: 'monthly', name: 'Monthly'},
]

export const YEARS = Array.from(new Array(100), (v, i) => i).map(x => dayjs().subtract(x, 'year').format('YYYY'))

export const MONTHS = Array.from(new Array(12), (v, i) => i).map(x =>
  dayjs().startOf('year').add(x, 'month').format('M'),
)
