import React from 'react'

import {Separator} from '../ui/separator'

interface IDivider {
  margin?: string
}

const Divider = ({margin = 'my-5'}: IDivider): React.ReactElement => {
  return <Separator className={margin} />
}

export default Divider
