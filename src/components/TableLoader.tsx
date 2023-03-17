import React from 'react'
import ContentLoader from 'react-content-loader'

const TableLoader = props => (
  <ContentLoader viewBox="0 0 500 100" width={500} height={100} {...props}>
    <rect x="0" y="0" rx="0" ry="0" width="500" height="30" />
    <rect x="0" y="40" rx="0" ry="0" width="300" height="20" />
    <rect x="0" y="70" rx="0" ry="0" width="300" height="20" />
  </ContentLoader>
)

export default TableLoader
