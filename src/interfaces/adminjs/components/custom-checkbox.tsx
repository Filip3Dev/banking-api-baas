import { Box, CheckBox, Label } from '@adminjs/design-system'
import { BasePropertyProps } from 'adminjs'
import React, { useState } from 'react'

interface CustomCheckBoxProps extends BasePropertyProps {
  defaultChecked: boolean
}

const CustomCheckBox = (props: CustomCheckBoxProps): JSX.Element => {
  const { record, resource, property } = props
  const label = resource.properties[property.path].label

  const initialState = record.id ? record.params[property.path] : property.props.defaultChecked

  const [checked, setChecked] = useState(initialState)

  record.params[property.path] = checked

  return (
    <Box flexDirection="column" marginRight={15}>
      <CheckBox id={`checkbox${label}`} checked={checked} onChange={() => setChecked(!checked)} />
      <Label inline htmlFor={`checkbox${label}`} ml="default">
        {label}
      </Label>
    </Box>
  )
}

export default CustomCheckBox
