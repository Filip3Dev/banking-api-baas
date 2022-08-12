import { BasePropertyProps } from 'adminjs'
import React from 'react'

import BaseCustomBadge from './base-custom-badge'

const TransactionStatusesBadge = (props: BasePropertyProps): JSX.Element => {
  const variantsMap = {
    pending: 'text',
    completed: 'success',
    failed: 'danger',
  }

  const field = 'status'
  const label = 'Status'

  const newProps = { ...props, label, field, variantsMap }

  return <BaseCustomBadge {...newProps} />
}

export default TransactionStatusesBadge
