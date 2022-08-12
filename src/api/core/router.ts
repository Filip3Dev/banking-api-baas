import AccountRoutes from '_account/routes'
import TransactionRoutes from '_transaction/routes'
import express from 'express'

export function getRoutes(http: express.Application): void {
  AccountRoutes(http)
  TransactionRoutes(http)
}
