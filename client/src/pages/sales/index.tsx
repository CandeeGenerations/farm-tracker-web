import React from 'react'

import Layout from '../_layout'
import SalesPage from '../products/_components/sales'

const RouteSalesPage = (): React.ReactElement => {
  return (
    <Layout
      title="Sales"
      description="Manage the sales of the products from your farm"
      breadcrumbs={[{name: 'Sales', current: true}]}
    >
      <SalesPage />
    </Layout>
  )
}

export default RouteSalesPage
