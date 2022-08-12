import { Badge, Box, FormGroup, Label, RichText } from '@adminjs/design-system'
import { BasePropertyProps } from 'adminjs'
import React, { useState } from 'react'

import { removeHtmlTags } from '../utils/remove-html-tags'

interface LimitedLengthRichTextProps extends BasePropertyProps {
  maxLength: number
  borderless: boolean
}

const LimitedLengthRichText = (props: LimitedLengthRichTextProps): JSX.Element => {
  const { record, resource, property } = props
  const label = resource.properties[property.path].label
  const maxLength = property.props.maxLength ?? 140

  const [value, setValue] = useState(record.params[property.path] ?? '')
  const [filteredContentLength, setFilteredContentLength] = useState(0)
  const [charCounterOverflow, setCharCounterOverflow] = useState(false)

  let { borderless } = props
  borderless = borderless ?? false

  const handleNewValue = (content: string) => {
    const filteredContentLength = removeHtmlTags(content).length
    const isOverflowingMaxLength = filteredContentLength > maxLength

    setFilteredContentLength(filteredContentLength)
    setCharCounterOverflow(isOverflowingMaxLength)
    setValue(content)

    record.params[property.path] = content
  }

  return (
    <FormGroup>
      <Label>{label}</Label>
      <Box style={{ position: 'relative' }}>
        <RichText
          borderless={borderless}
          quill={{
            theme: 'snow',
            modules: {
              toolbar: {
                container: [
                  [{ header: [1, 2, 3, 4, 5, 6, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  ['blockquote', 'code-block'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  [{ indent: '-1' }, { indent: '+1' }],
                  [{ align: [] }],
                  ['link'],
                  ['clean'],
                ],
              },
            },
          }}
          onChange={(content) => handleNewValue(content)}
          value={value}
        />
        <Badge
          variant={charCounterOverflow ? 'danger' : 'info'}
          style={{ position: 'absolute', right: '2px', bottom: '2px' }}
          outline={!charCounterOverflow}
        >
          {filteredContentLength}/{maxLength}
        </Badge>
      </Box>
    </FormGroup>
  )
}

export default LimitedLengthRichText
