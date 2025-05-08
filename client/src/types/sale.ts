import {IProduct} from './product'

export interface ISale {
  id: string
  productId: string
  amount: number
  quantity: number
  saleDate: string
  owner: string
  customerName: string | null
  notes: string | null
  product?: IProduct
}
