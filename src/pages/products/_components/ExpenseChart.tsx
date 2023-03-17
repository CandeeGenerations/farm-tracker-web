import Button from '@/components/Button'
import Card from '@/components/Card'
import Divider from '@/components/Divider'
import FormInput from '@/components/FormInput'
import FormSelect, {IFormSelectItem} from '@/components/FormSelect'
import {setPageState} from '@/helpers'
import {EXPENSES_CHART_LOCAL_STORAGE} from '@/helpers/constants'
import {IExpense} from '@/morphs/product.morph'
import {CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip} from 'chart.js'
import dayjs from 'dayjs'
import _sum from 'lodash/sum'
import React, {useEffect, useState} from 'react'
import {Line} from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface IPageState {
  chartType?: IFormSelectItem
  year?: number
  month?: number
  numberOfMonths?: number
  dataset?: number[]
  labels?: string[]
}

interface IExpenseChart {
  expenses: IExpense[]
}

const chartTypes = [
  {id: 'previousMonths', name: 'Previous months'},
  {id: 'yearly', name: 'Yearly'},
  {id: 'monthly', name: 'Monthly'},
]

const years = Array.from(new Array(100), (v, i) => i).map(x => dayjs().subtract(x, 'year').format('YYYY'))

const months = Array.from(new Array(12), (v, i) => i).map(x => dayjs().startOf('year').add(x, 'month').format('M'))

const ExpenseChart = ({expenses}: IExpenseChart): React.ReactElement => {
  const [pageState, stateFunc] = useState<IPageState>({
    year: dayjs().year(),
    month: dayjs().month(),
    dataset: [],
    labels: [],
  })

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

  const getAmountArray = (amount: number): number[] => Array.from(new Array(amount), (v, i) => i).sort((a, b) => b - a)

  const getMonths = (monthArray?: number[], year?: number): string[] => {
    const now = dayjs()
    const dayObject = year ? now.year(year).endOf('year') : now

    return (monthArray || getAmountArray(12)).map(x => dayObject.subtract(x, 'month').format("MMM 'YY"))
  }

  const getDays = (dayArray?: number[], year?: number, month?: number): string[] => {
    const now = dayjs()
    const dayObject =
      month && year
        ? now
            .year(year)
            .month(month - 1)
            .endOf('month')
        : now
    return (dayArray || getAmountArray(dayObject.day())).map(x => dayObject.subtract(x, 'day').format('ddd, D'))
  }

  const getChartEntry = (expenses: IExpense[]): string =>
    expenses.length == 0 ? (0).toString() : _sum(expenses.map(x => x.amount * x.quantity)).toFixed(2)

  const previousMonthsChart = (stateValues?: IPageState) => {
    const months = getAmountArray(stateValues?.numberOfMonths || pageState.numberOfMonths)
    const labels = getMonths(months)
    const dataset = []

    for (const month of months) {
      const dayObject = dayjs().subtract(month, 'month')
      const monthlyExpenses = expenses.filter(x => dayjs(x.purchaseDate).isSame(dayObject, 'month'))

      dataset.push(getChartEntry(monthlyExpenses))
    }

    setState({...stateValues, labels, dataset})
  }

  const yearlyChart = (stateValues?: IPageState) => {
    const months = getAmountArray(12)
    const labels = getMonths(months, stateValues.year)
    const dataset = []

    for (const month of months) {
      const dayObject = dayjs().set('year', stateValues.year).endOf('year').subtract(month, 'month')
      const monthlyExpenses = expenses.filter(x => dayjs(x.purchaseDate).isSame(dayObject, 'month'))

      dataset.push(getChartEntry(monthlyExpenses))
    }

    setState({...stateValues, labels, dataset})
  }

  const monthlyChart = (stateValues?: IPageState) => {
    const date = dayjs()
      .year(stateValues.year)
      .month(stateValues.month - 1)
      .endOf('month')
    const days = getAmountArray(date.date())
    const labels = getDays(days, stateValues.year, stateValues.month)
    const dataset = []

    for (const day of days) {
      const dayObject = date.subtract(day, 'day')
      const monthlyExpenses = expenses.filter(x => dayjs(x.purchaseDate).isSame(dayObject, 'day'))

      dataset.push(getChartEntry(monthlyExpenses))
    }

    setState({...stateValues, labels, dataset})
  }

  const handleGenerateChart = (stateValues?: IPageState) => {
    const chartType = stateValues?.chartType || pageState.chartType || chartTypes[0]
    const numberOfMonths = stateValues?.numberOfMonths || pageState.numberOfMonths || 12
    const year = stateValues?.year || pageState.year || dayjs().year()
    const month = stateValues?.month || pageState.month || dayjs().month()
    const newValues = {chartType, numberOfMonths, year, month}

    localStorage.setItem(EXPENSES_CHART_LOCAL_STORAGE, JSON.stringify({...newValues, chartType: chartType.id}))

    switch (chartType.id) {
      case 'previousMonths': {
        previousMonthsChart(newValues)
        break
      }

      case 'yearly': {
        yearlyChart(newValues)
        break
      }

      case 'monthly': {
        monthlyChart(newValues)
        break
      }
    }
  }

  useEffect(() => {
    const storage = localStorage.getItem(EXPENSES_CHART_LOCAL_STORAGE)
    let stateValues = {
      chartType: chartTypes[0],
      numberOfMonths: 12,
      year: dayjs().year(),
      month: dayjs().month() + 1,
    }

    if (storage) {
      const savedValues = JSON.parse(storage)

      stateValues = {
        chartType: chartTypes.find(x => x.id === savedValues.chartType) || stateValues.chartType,
        numberOfMonths: savedValues.numberOfMonths || stateValues.numberOfMonths,
        year: savedValues.year || stateValues.year,
        month: savedValues.month || stateValues.month,
      }
    }

    handleGenerateChart(stateValues)
  }, [])

  return (
    <div className="mt-20">
      <h1 className="mb-5 text-3xl">Expenses</h1>

      <Card>
        <div className="flex space-x-6 items-end">
          <div>
            <FormSelect
              items={chartTypes}
              name="chartType"
              vertical
              label="Chart type"
              staticSelected={pageState.chartType}
              onSelected={chartType => setState({chartType})}
            />
          </div>

          {pageState.chartType?.id === 'previousMonths' && (
            <div>
              <FormInput
                name="months"
                vertical
                label="Number of months"
                staticValue={pageState.numberOfMonths}
                onChange={(_, value) => setState({numberOfMonths: Number(value)})}
              />
            </div>
          )}

          {(pageState.chartType?.id === 'yearly' || pageState.chartType?.id === 'monthly') && (
            <>
              {pageState.chartType?.id === 'monthly' && (
                <div>
                  <FormSelect
                    items={months.map(x => ({
                      id: Number(x),
                      name: dayjs()
                        .month(Number(x) - 1)
                        .format('MMMM'),
                    }))}
                    name="month"
                    vertical
                    noSort
                    label="Month"
                    staticSelected={{id: pageState.month, name: pageState.month.toString()}}
                    onSelected={({id}) => setState({month: Number(id)})}
                  />
                </div>
              )}

              <div>
                <FormSelect
                  items={years.map(x => ({id: Number(x), name: x}))}
                  name="year"
                  vertical
                  noSort
                  label="Year"
                  staticSelected={{id: pageState.year, name: pageState.year.toString()}}
                  onSelected={({id}) => setState({year: Number(id)})}
                />
              </div>
            </>
          )}

          <div className="flex-1 text-right">
            <Button type="primary" onClick={handleGenerateChart}>
              Generate chart
            </Button>
          </div>
        </div>

        <Divider />

        <Line
          options={{
            responsive: true,
            elements: {
              line: {
                tension: 0.25,
              },
            },
            scales: {
              y: {
                ticks: {
                  callback: value => `$${value}`,
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: ({dataset: {label}, parsed: {y}}) => `$${label || y}`,
                },
              },
            },
          }}
          data={{
            labels: pageState.labels,
            datasets: [
              {
                data: pageState.dataset,
                borderColor: '#15803d',
                backgroundColor: '#15803d',
              },
            ],
          }}
        />
      </Card>
    </div>
  )
}

export default ExpenseChart
