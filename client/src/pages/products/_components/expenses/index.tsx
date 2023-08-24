import Button from '@/components/Button'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'
import EmptyState from '@/components/EmptyState'
import ImportModal from '@/components/ImportModal'
import TableLoader from '@/components/TableLoader'
import {getErrorMessage, setPageState} from '@/helpers'
import ExpenseModal from '@/pages/products/_components/expenses/ExpenseModal'
import ExpensesTable from '@/pages/products/_components/expenses/ExpensesTable'
import {IExpense} from '@/types/expense'
import {IProduct} from '@/types/product'
import axios, {AxiosResponse} from 'axios'
import React, {useState} from 'react'
import Chart from '../_Chart'

interface IPageState {
  showModal?: boolean
  expense?: IExpense
  errorMessage?: string
  expenses?: IExpense[]
  loading?: boolean
  showDeleteModal?: boolean
  deleteId?: string
  deleteLoading?: boolean
}

interface IExpensesPage {
  product: IProduct
}

const ExpensesPage = ({product}: IExpensesPage): React.ReactElement => {
  const [expenseImportModalOpen, setExpenseImportModalOpen] = useState<boolean>(false)
  const [pageState, stateFunc] = useState<IPageState>({
    showModal: false,
    expenses: product.expenses || [],
    loading: false,
    showDeleteModal: false,
    deleteLoading: false,
  })

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

  const handleLoadExpenses = async () => {
    setState({loading: true})

    try {
      const {data}: AxiosResponse<{data: IExpense[]}> = await axios.get(`/product/${product.id}/expense`)
      setState({
        expenses: data.data,
        ...{
          showModal: false,
          loading: false,
          deleteId: undefined,
          deleteLoading: false,
          showDeleteModal: false,
        },
      })
    } catch (e) {
      setState({errorMessage: getErrorMessage(e)})
    }
  }

  const handleShowExpenseModal = (expense?: IExpense) => setState({showModal: true, errorMessage: undefined, expense})

  const handleCloseExpenseModal = () => setState({showModal: false})

  const handleCompleteExpense = async (expense: IExpense) => {
    try {
      await axios.post(`/product/${product.id}/expense${expense.id ? `/${expense.id}` : ''}`, expense)
      await handleLoadExpenses()
    } catch (e) {
      setState({errorMessage: getErrorMessage(e)})
    }
  }

  const handleShowDeleteExpenseModal = (deleteId: string) => setState({showDeleteModal: true, deleteId})

  const handleCloseDeleteExpenseModal = () => setState({showDeleteModal: false, deleteId: undefined})

  const handleDeleteExpense = async () => {
    setState({deleteLoading: true})

    try {
      await axios.delete(`/product/${product.id}/expense/${pageState.deleteId}`)
      await handleLoadExpenses()
    } catch (e) {
      setState({errorMessage: getErrorMessage(e)})
    }
  }

  const handleOpenExpenseImporter = () => setExpenseImportModalOpen(true)

  const handleCloseExpenseImporter = () => setExpenseImportModalOpen(false)

  const handleImportExpenses = async (
    data: {
      item: string
      amount: number
      quantity: number
      purchaseDate: string
    }[],
  ) => {
    const expenses: IExpense[] = []

    for (const expense of data) {
      expenses.push({
        id: undefined,
        productId: undefined,
        owner: undefined,
        item: expense.item,
        amount: expense.amount,
        quantity: expense.quantity,
        purchaseDate: expense.purchaseDate,
      })
    }

    await axios.post(`/product/${product.id}/expense/import`, expenses)
    await handleLoadExpenses()
  }

  return (
    <>
      <div className="mt-10">
        {pageState.loading ? (
          <TableLoader />
        ) : pageState.expenses.length === 0 ? (
          <div className="pt-10">
            <EmptyState
              entity="expenses"
              actions={
                <>
                  <p className="mt-1 text-sm text-muted">Add a new expense here</p>

                  <div className="mt-6">
                    <Button type="secondary" className="mr-4" onClick={handleOpenExpenseImporter}>
                      Import expenses
                    </Button>

                    <Button type="primary" onClick={() => handleShowExpenseModal()}>
                      Add expense
                    </Button>
                  </div>
                </>
              }
            />
          </div>
        ) : (
          <>
            <ExpensesTable
              expenses={pageState.expenses}
              onShowExpenseModal={handleShowExpenseModal}
              onOpenImporter={handleOpenExpenseImporter}
            />

            <Chart data={pageState.expenses.map(x => ({date: x.purchaseDate, amount: x.amount}))} title="Expenses" />
          </>
        )}
      </div>

      <ExpenseModal
        expense={pageState.expense}
        errorMessage={pageState.errorMessage}
        open={pageState.showModal}
        onClose={handleCloseExpenseModal}
        onSubmit={handleCompleteExpense}
        onDelete={handleShowDeleteExpenseModal}
      />

      <ConfirmDeleteModal
        type="expense"
        open={pageState.showDeleteModal}
        loading={pageState.deleteLoading}
        onClose={handleCloseDeleteExpenseModal}
        onDelete={handleDeleteExpense}
      />

      <ImportModal
        type="expenses"
        headers={['item', 'amount', 'quantity', 'purchaseDate']}
        open={expenseImportModalOpen}
        onClose={handleCloseExpenseImporter}
        onSave={handleImportExpenses}
        notReloading
      />
    </>
  )
}

export default ExpensesPage
