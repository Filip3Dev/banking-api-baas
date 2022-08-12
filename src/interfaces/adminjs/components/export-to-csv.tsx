import { Box, Header, Button, Link, Table, TableRow, TableCell, TableHead, TableBody } from '@adminjs/design-system'
import { ActionProps } from 'adminjs'
import React from 'react'

import messages from '../messages/export-to-csv'

const ExportToCsv = (props: ActionProps): JSX.Element => {
  const { records } = props
  // TODO: receive the entire path from backend
  const filePath = records[0]?.params.filepath ? `http://localhost:8080/${records[0]?.params.filepath}` : ''

  return (
    <Box width={1} variant="grey">
      <Box variant="white" flex flexDirection="column" alignItems="center">
        <Header.H3>{messages.headline}</Header.H3>
        <Link href={filePath}>
          <Button mt="xl" mb="xl" variant="success">
            {messages.downloadButton}
          </Button>
        </Link>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{messages.table.id}</TableCell>
              <TableCell>{messages.table.exchangeAccountId}</TableCell>
              <TableCell>{messages.table.externalUserId}</TableCell>
              <TableCell>{messages.table.createdAt}</TableCell>
              <TableCell>{messages.table.updatedAt}</TableCell>
            </TableRow>
          </TableHead>
          {records?.map((record) => {
            return (
              <TableBody>
                <TableRow>
                  <TableCell fontSize="xl">{record.params.id}</TableCell>
                  <TableCell fontSize="xl">{record.params.exchangeAccountId}</TableCell>
                  <TableCell fontSize="xl">{record.params.externalUserId}</TableCell>
                  <TableCell fontSize="xl">{record.params.createdAt}</TableCell>
                  <TableCell fontSize="xl">{record.params.updatedAt}</TableCell>
                </TableRow>
              </TableBody>
            )
          })}
        </Table>
      </Box>
    </Box>
  )
}

export default ExportToCsv
