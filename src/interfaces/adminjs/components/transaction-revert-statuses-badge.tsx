import { BasePropertyProps } from 'adminjs'
import React from 'react'

import BaseCustomBadge from './base-custom-badge'

const TransactionRevertStatusesBadge = (props: BasePropertyProps): JSX.Element => {
  const variantsMap = {
    exchange_transfer_revert: 'primary',
    digital_account_transfer_revert: 'primary',
    completed: 'success',
  }

  const field = 'revertStatus'
  const label = 'Revert Status'

  const newProps = { ...props, label, field, variantsMap }

  return <BaseCustomBadge {...newProps} />
}

export default TransactionRevertStatusesBadge
