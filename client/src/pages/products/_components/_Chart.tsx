import Card from '@/components/Card'
import {AreaChart, Tab, TabGroup, TabList, TabPanel, TabPanels, Title} from '@tremor/react'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import React, {useEffect, useState} from 'react'

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

const dataFormatter = (number: number) => `$ ${Intl.NumberFormat('us').format(number).toString()}`

interface IChart {
  data: {date: string; amount: number}[]
  title: string
  label?: string
  notMoney?: boolean
}

const Chart = ({data, title, label = 'Amount', notMoney = false}: IChart): React.ReactElement => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [dataset, setDataset] = useState([])

  useEffect(() => {
    const aggregatedData = {}
    const aggregatedArray = []

    for (const item of data) {
      const date = dayjs(item.date).format('MMM DD, YYYY')

      if (aggregatedData[date]) {
        aggregatedData[date] += item.amount
      } else {
        aggregatedData[date] = item.amount
      }
    }

    for (const date in aggregatedData) {
      aggregatedArray.push({Date: date, [label]: aggregatedData[date]})
    }

    setDataset(aggregatedArray.sort((a, b) => dayjs(a.Date, 'MMM DD, YYYY').diff(dayjs(b.Date, 'MMM DD, YYYY'))))
  }, [])

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
          {[1, 2, 6, 365, 999].map(x => (
            <TabPanel key={x}>
              <AreaChart
                className="mt-8"
                data={getFilteredData(x)}
                index="Date"
                categories={[label]}
                colors={['emerald']}
                valueFormatter={num => (notMoney ? num.toString() : dataFormatter(num))}
                showLegend={false}
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

export default Chart
