import Card from '@/components/Card'
import {addCommas} from '@/helpers'
import {BarChart, Tab, TabGroup, TabList, TabPanel, TabPanels, Title} from '@tremor/react'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import React, {useState} from 'react'

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

const dataFormatter = (number: number) => `$ ${Intl.NumberFormat('us').format(number).toString()}`

interface IProfitLossChart {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
  title: string
  labels?: string[]
  colors?: string[]
  notMoney?: boolean
  showLegend?: boolean
}

const ProfitLossChart = ({
  data,
  title,
  labels = ['Amount'],
  colors = ['emerald'],
  notMoney = false,
  showLegend = false,
}: IProfitLossChart): React.ReactElement => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const aggregateData = dataToAggregate => {
    const aggregatedData = {
      Expenses: 0,
      Sales: 0,
    }

    for (const item of dataToAggregate) {
      aggregatedData['Expenses'] += item['Expenses'] || 0
      aggregatedData['Sales'] += item['Sales'] || 0
    }

    return [
      {Category: 'Expenses', Expenses: aggregatedData['Expenses']},
      {Category: 'Sales', Sales: aggregatedData['Sales']},
    ]
  }

  const filterData = (startDate: dayjs.Dayjs) => {
    const endDate = dayjs()
    const filteredData = data.filter(item => {
      const currentDate = dayjs(item.date)
      return currentDate.isSameOrAfter(startDate, 'day') && currentDate.isSameOrBefore(endDate, 'day')
    })

    return aggregateData(filteredData)
  }

  const getFilteredData = (period: number) => {
    switch (period) {
      case 1: {
        const periodStartDate = dayjs().subtract(30, 'days')
        return filterData(periodStartDate)
      }

      case 2: {
        const periodStartDate = dayjs().subtract(60, 'days')
        return filterData(periodStartDate)
      }

      case 6: {
        const periodStartDate = dayjs().subtract(180, 'days')
        return filterData(periodStartDate)
      }

      case 365: {
        const periodStartDate = dayjs().startOf('year')
        return filterData(periodStartDate)
      }

      default:
        return aggregateData(data)
    }
  }

  return (
    <Card className="mt-10">
      <Title>{title}</Title>

      <TabGroup index={selectedIndex} onIndexChange={setSelectedIndex} className="mt-10">
        <TabList variant="line">
          <Tab>1 Mo</Tab>
          <Tab>2 Mo</Tab>
          <Tab>6 Mo</Tab>
          <Tab>Yr to Date</Tab>
          <Tab>Max</Tab>
        </TabList>

        <TabPanels>
          {[1, 2, 6, 365, 999].map(x => {
            const filteredDataset = getFilteredData(x)

            return (
              <TabPanel key={x}>
                <h3 className="mt-4 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                  Net profit
                </h3>

                <p className="mb-4 text-tremor-metric text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
                  ${addCommas(filteredDataset[1].Sales - filteredDataset[0].Expenses)}
                </p>

                <BarChart
                  style={{maxHeight: 150}}
                  data={filteredDataset}
                  index="Category"
                  categories={labels}
                  colors={colors}
                  valueFormatter={num => (notMoney ? num.toString() : dataFormatter(num))}
                  showLegend={showLegend}
                  yAxisWidth={64}
                  layout="vertical"
                  stack
                />
              </TabPanel>
            )
          })}
        </TabPanels>
      </TabGroup>
    </Card>
  )
}

export default ProfitLossChart
