import { ExportToCsvError } from '_interfaces/adminjs/errors/export-to-csv-error'
import { BaseRecord } from 'adminjs'
import fs from 'fs'
import path from 'path'

export async function exportToCsv(
  filename: string,
  records: BaseRecord[],
  columns: string[],
  delimiter = ','
): Promise<string> {
  const fileContent = [
    columns.join(delimiter),
    ...records.map((record) => writeCsvLine(record, columns, delimiter)),
  ].join('\n')

  // TODO: save files to a S3 bucket
  const filepath = path.join(__dirname, '../', '../', 'express', 'public', filename)

  fs.writeFile(filepath, fileContent, (err) => {
    if (err) {
      throw new ExportToCsvError(err)
    }
  })

  // TODO: return S3 file path
  return `static/${filename}`
}

function writeCsvLine(record: BaseRecord, columns: string[], delimiter: string): string {
  function concatColumns(previousColumns: string, column: string): string {
    const prevColumns = `${previousColumns}${!previousColumns.length ? '' : delimiter}"`
    return `${prevColumns}${!record.params[column] ? '' : record.params[column]}"`
  }

  return columns.reduce((acc, key) => concatColumns(acc, key), '')
}
