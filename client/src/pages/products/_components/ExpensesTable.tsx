import {addCommas, formatDate} from '@/helpers'
import {IExpense} from '@/types/expense'
import dayjs from 'dayjs'
import _sum from 'lodash/sum'
import React from 'react'
import Button from '../../../components/Button'
import Table from '../../../components/Table'

interface IExpensesTable {
  expenses: IExpense[]
  // eslint-disable-next-line no-unused-vars
  onShowExpenseModal: (expense?: IExpense) => void
  onOpenImporter: () => void
}

const ExpensesTable = ({expenses, onShowExpenseModal, onOpenImporter}: IExpensesTable): React.ReactElement => {
  return (
    <div>
      <div className="flex items-center mb-5 mt-10">
        <h1 className="flex-1 text-3xl">
          Expenses ({expenses?.length} item{expenses?.length === 1 ? '' : 's'} - $
          {addCommas(_sum(expenses?.map(x => x.amount * x.quantity)))})
        </h1>

        <Button type="secondary" className="mr-4" onClick={onOpenImporter}>
          Import expenses
        </Button>

        <Button type="primary" onClick={() => onShowExpenseModal()}>
          Add expense
        </Button>
      </div>

      <Table
        actions={{idColumn: 'id'}}
        columns={[
          {name: 'Item', id: 'item'},
          {name: 'Quantity', id: 'quantity'},
          {name: 'Cost per item', id: 'amount'},
          {name: 'Total cost', id: 'totalCost'},
          {name: 'Purchase Date', id: 'purchaseDate', sortOverride: 'purchaseDateSort'},
        ]}
        keyName="id"
        linkKey="item"
        defaultSortColumn="purchaseDate"
        defaultSortOrder="desc"
        onEdit={id => onShowExpenseModal(expenses.find(x => x.id === id))}
        data={expenses?.map(x => ({
          ...x,
          amount: `$${addCommas(x.amount)}`,
          purchaseDate: formatDate(x.purchaseDate),
          purchaseDateSort: dayjs(x.purchaseDate).format(),
          totalCost: `$${addCommas(x.amount * x.quantity)}`,
        }))}
      />
    </div>
  )
}

export default ExpensesTable
