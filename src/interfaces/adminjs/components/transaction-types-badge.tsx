import { BasePropertyProps } from 'adminjs'
import React from 'react'

import BaseCustomBadge from './base-custom-badge'

const TransactionTypesBadge = (props: BasePropertyProps): JSX.Element => {
  const variantsMap = {
    BUY: 'info',
    SELL: 'secondary',
  }

  const field = 'type'
  const label = 'Type'

  const newProps = { ...props, label, field, variantsMap }

  return <BaseCustomBadge {...newProps} />
}

export default TransactionTypesBadge
