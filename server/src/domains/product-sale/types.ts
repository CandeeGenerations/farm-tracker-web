export interface IBaseSale {
  productId: string
  amount: number
  quantity: number
  saleDate: string
  owner: string
  customerName: string | null
  notes: string | null
}

export interface ISale extends IBaseSale {
  id: string
}

export interface IExternalSale extends IBaseSale {
  productName: string
}
