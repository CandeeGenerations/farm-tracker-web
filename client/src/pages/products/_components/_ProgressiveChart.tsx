import Card from '@/components/Card'
import {AreaChart, Tab, TabGroup, TabList, TabPanel, TabPanels, Title} from '@tremor/react'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import React, {useEffect, useState} from 'react'

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

const dataFormatter = (number: number) => `$ ${Intl.NumberFormat('us').format(number).toString()}`

interface IProgressiveChart {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
  title: string
  labels?: string[]
  colors?: string[]
  notMoney?: boolean
  showLegend?: boolean
}

const ProgressiveChart = ({
  data,
  title,
  labels = ['Amount'],
  colors = ['emerald'],
  showLegend = false,
}: IProgressiveChart): React.ReactElement => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [dataset, setDataset] = useState([])

  useEffect(() => {
    const cumulativeData = {}

    data.forEach(item => {
      const date = dayjs(item.date).format('MMM D, YYYY')

      labels.forEach(label => {
        if (!cumulativeData[date]) {
          cumulativeData[date] = {}
          labels.forEach(lbl => (cumulativeData[date][lbl] = 0))
        }

        cumulativeData[date][label] += item[label] || 0
      })
    })

    // Convert cumulative data into an array and calculate cumulative sums
    const dates = Object.keys(cumulativeData).sort((a, b) => dayjs(a).diff(dayjs(b)))
    const cumulativeResults = []
    const runningTotals = labels.reduce((acc, label) => ({...acc, [label]: 0}), {})

    dates.forEach(date => {
      labels.forEach(label => {
        runningTotals[label] += cumulativeData[date][label]
        cumulativeData[date][label] = runningTotals[label]
      })

      cumulativeResults.push({Date: date, ...cumulativeData[date]})
    })

    setDataset(cumulativeResults)
  }, [data, labels])

  const filterData = (startDate: dayjs.Dayjs) => {
    const endDate = dayjs()

    return dataset.filter(item => {
      const currentDate = dayjs(item.Date)

      return currentDate.isSameOrAfter(startDate, 'day') && currentDate.isSameOrBefore(endDate, 'day')
    })
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
        return dataset
    }
  }

  return (
    <Card className="mt-10">
      <Title>{title}</Title>

      <TabGroup index={selectedIndex} onIndexChange={setSelectedIndex} className="mt-10">
        <TabList variant="line">
          <Tab>1 Month</Tab>
          <Tab>2 Months</Tab>
          <Tab>6 Months</Tab>
          <Tab>Year to Date</Tab>
          <Tab>Max</Tab>
        </TabList>

        <TabPanels>
          {dataset.length &&
            [1, 2, 6, 365, 999].map(period => (
              <TabPanel key={period}>
                <AreaChart
                  data={getFilteredData(period)}
                  index="Date"
                  categories={labels}
                  colors={colors}
                  valueFormatter={dataFormatter}
                  showLegend={showLegend}
                  yAxisWidth={48}
                  curveType="monotone"
                />
              </TabPanel>
            ))}
        </TabPanels>
      </TabGroup>
    </Card>
  )
}

export default ProgressiveChart
