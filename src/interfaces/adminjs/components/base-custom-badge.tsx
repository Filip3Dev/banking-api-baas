import { Badge, ValueGroup } from '@adminjs/design-system'
import { BasePropertyProps } from 'adminjs'
import React from 'react'

interface BaseCustomBadgeProps extends BasePropertyProps {
  variantsMap: Record<string, string>
  label: string
  field: string
}

const BaseCustomBadge = (props: BaseCustomBadgeProps): JSX.Element => {
  const { label, field, record, where, variantsMap } = props

  const value = record.params[field]

  const badgeComponent = <Badge variant={variantsMap[value]}>{value?.toUpperCase()}</Badge>

  if (where === 'show') {
    return <ValueGroup label={label}>{badgeComponent}</ValueGroup>
  }

  return badgeComponent
}

export default BaseCustomBadge
