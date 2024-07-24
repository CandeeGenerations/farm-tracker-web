import Button from '@/components/Button'
import SortableTable from '@/components/SortableTable'
import {addCommas, formatDate} from '@/helpers'
import {IExpense} from '@/types/expense'
import dayjs from 'dayjs'
import _sum from 'lodash/sum'
import React from 'react'

interface IExpensesTable {
  expenses: IExpense[]
  // eslint-disable-next-line no-unused-vars
  onShowExpenseModal: (expense?: IExpense) => void
  onOpenImporter: () => void
}

const ExpensesTable = ({expenses, onShowExpenseModal, onOpenImporter}: IExpensesTable): React.ReactElement => {
  return (
    <div>
      <div className="flex items-center flex-col sm:flex-row mb-5 mt-10">
        <h1 className="flex-1 text-3xl hidden sm:block">Expenses</h1>

        <div className="sm:pt-5 sm:flex-1 w-full sm:w-auto text-right">
          <Button type="secondary" className="mr-4" onClick={onOpenImporter}>
            Import expenses
          </Button>

          <Button type="primary" onClick={() => onShowExpenseModal()}>
            Add expense
          </Button>
        </div>
      </div>

      <SortableTable
        id="expenses"
        filters={[
          {
            label: 'Purchase date',
            type: 'daterange',
            column: 'purchaseDate',
          },
        ]}
        searchableColumns={['item', 'amount', 'quantity', 'totalCost']}
        actions={{idColumn: 'id'}}
        columns={[
          {name: 'Item', id: 'item'},
          {name: 'Quantity', id: 'quantity'},
          {name: 'Cost per item', id: 'amount'},
          {name: 'Total cost', id: 'totalCostDisplay', sortOverride: 'totalCost'},
          {name: 'Purchase Date', id: 'purchaseDate', sortOverride: 'purchaseDateSort'},
        ]}
        totalRow={[
          {id: 'quantity', value: data => _sum(data?.map(x => x.quantity))},
          {id: 'totalCostDisplay', value: data => `$${addCommas(_sum(data?.map(x => x.totalCost)))}`},
        ]}
        keyName="id"
        defaultSortColumn="purchaseDate"
        defaultSortOrder="desc"
        onClick={id => onShowExpenseModal(expenses.find(x => x.id === id))}
        data={expenses?.map(x => ({
          ...x,
          amount: `$${addCommas(x.amount)}`,
          purchaseDate: formatDate(x.purchaseDate),
          purchaseDateSort: dayjs(x.purchaseDate).format(),
          totalCost: x.amount * x.quantity,
          totalCostDisplay: `$${addCommas(x.amount * x.quantity)}`,
        }))}
      />
    </div>
  )
}

export default ExpensesTable
