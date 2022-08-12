import { authorization } from '_config/middlewares/authorization'
import { logger } from '_core/adapter/logger'
import { HttpStatusCode } from '_core/enums'
import { TransactionRepository } from '_transaction/repository/transaction-repository'
import { TransactionTypeRepository } from '_transaction/repository/transaction-type-repository'
import { CreditTransaction } from '_transaction/use-case/credit-transaction'
import { TransactionRequest } from '_transaction/use-case/credit-transaction/payloads'
import { ListTransactions } from '_transaction/use-case/list-transactions'
import { StatementRequest } from '_transaction/use-case/list-transactions/payloads'
import express, { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'

import { TransactionTypes } from './enums'
import { AccountRepository } from './repository/account-repository'
import { AccountSegmentationRepository } from './repository/account-segmentation-repository'
import { AccountStatusRepository } from './repository/account-status-repository'
import { FiatRepository } from './repository/fiat-repository'
import { DebitTransaction } from './use-case/debit-transaction'
import { ListTransactionTypes } from './use-case/list-transaction-types'
import { ManualTransaction } from './use-case/manual-transactions'
import { TransactionManualRequest } from './use-case/manual-transactions/payloads'
import { P2PTransaction } from './use-case/p2p-transaction'
import { TransactionP2PRequest } from './use-case/p2p-transaction/payloads'
import { RevertTransaction } from './use-case/revert-transaction'

export default function routes(http: express.Application): void {
  http.post('/api/v1/transaction/cash_in', authorization, async (req: Request, res: Response): Promise<Response> => {
    const request: TransactionRequest = {
      amount: req.body.amount,
      externalIdentifier: req.body.extTransactionId,
      externalUserId: req.body.externalUserId,
      description: String(req.body.description),
      symbol: req.body.fiatSymbol,
      transactionTypeSlug: TransactionTypes.CASH_IN,
      reason: req.body.reason,
    }

    const creditTransaction = new CreditTransaction(
      getCustomRepository(TransactionRepository),
      getCustomRepository(TransactionTypeRepository),
      getCustomRepository(AccountRepository),
      getCustomRepository(FiatRepository),
      getCustomRepository(AccountStatusRepository),
      getCustomRepository(AccountSegmentationRepository),
      logger
    )

    const transaction = await creditTransaction.handle(request)

    return res.status(HttpStatusCode.OK).json({
      amount: transaction.amount,
      balance: transaction.account.balance,
      dtTransaction: transaction.dtTransaction,
    })
  })

  http.post('/api/v1/transaction/buy_crypto', authorization, async (req: Request, res: Response): Promise<Response> => {
    const request: TransactionRequest = {
      amount: Number(req.body.amount),
      externalIdentifier: String(req.body.extTransactionId),
      externalUserId: String(req.body.externalUserId),
      description: String(req.body.description),
      symbol: req.body.fiatSymbol,
      transactionTypeSlug: TransactionTypes.BUY_CRYPTO,
      reason: req.body.reason,
    }

    const debitTransaction = new DebitTransaction(
      getCustomRepository(TransactionRepository),
      getCustomRepository(TransactionTypeRepository),
      getCustomRepository(AccountRepository),
      getCustomRepository(FiatRepository),
      getCustomRepository(AccountStatusRepository),
      getCustomRepository(AccountSegmentationRepository),
      logger
    )

    const transaction = await debitTransaction.handle(request)

    return res.status(HttpStatusCode.OK).json({
      id: transaction.uuid,
      amount: transaction.amount,
      balance: transaction.account.balance,
      dtTransaction: transaction.dtTransaction,
    })
  })

  http.post(
    '/api/v1/transaction/deposit_finance',
    authorization,
    async (req: Request, res: Response): Promise<Response> => {
      const request: TransactionRequest = {
        amount: req.body.amount,
        externalIdentifier: req.body.extTransactionId,
        externalUserId: req.body.externalUserId,
        description: String(req.body.description),
        symbol: req.body.fiatSymbol,
        transactionTypeSlug: TransactionTypes.DEPOSIT_FINANCE,
        reason: req.body.reason,
      }

      const debitTransaction = new DebitTransaction(
        getCustomRepository(TransactionRepository),
        getCustomRepository(TransactionTypeRepository),
        getCustomRepository(AccountRepository),
        getCustomRepository(FiatRepository),
        getCustomRepository(AccountStatusRepository),
        getCustomRepository(AccountSegmentationRepository),
        logger
      )

      const transaction = await debitTransaction.handle(request)

      return res.status(HttpStatusCode.OK).json({
        amount: transaction.amount,
        balance: transaction.account.balance,
        dtTransaction: transaction.dtTransaction,
      })
    }
  )

  http.post('/api/v1/transaction/revert_buy', authorization, async (req: Request, res: Response): Promise<Response> => {
    const request: TransactionRequest = {
      amount: req.body.amount,
      externalIdentifier: req.body.extTransactionId,
      externalUserId: req.body.externalUserId,
      description: String(req.body.description),
      symbol: req.body.fiatSymbol,
      transactionTypeSlug: TransactionTypes.REVERT_BUY,
      reason: req.body.reason,
    }

    const revertTransaction = new RevertTransaction(
      getCustomRepository(TransactionRepository),
      getCustomRepository(TransactionTypeRepository),
      getCustomRepository(AccountRepository),
      getCustomRepository(FiatRepository),
      getCustomRepository(AccountStatusRepository),
      getCustomRepository(AccountSegmentationRepository),
      logger
    )

    const transaction = await revertTransaction.handle(request)

    return res.status(HttpStatusCode.OK).json({
      id: transaction.id,
      amount: transaction.amount,
      balance: transaction.account.balance,
      dtTransaction: transaction.dtTransaction,
    })
  })

  http.post('/api/v1/transaction/cash_out', authorization, async (req: Request, res: Response): Promise<Response> => {
    const request: TransactionRequest = {
      amount: req.body.amount,
      externalIdentifier: req.body.extTransactionId,
      externalUserId: req.body.externalUserId,
      description: String(req.body.description),
      symbol: req.body.fiatSymbol,
      transactionTypeSlug: TransactionTypes.CASH_OUT,
      reason: req.body.reason,
    }

    const debitTransaction = new DebitTransaction(
      getCustomRepository(TransactionRepository),
      getCustomRepository(TransactionTypeRepository),
      getCustomRepository(AccountRepository),
      getCustomRepository(FiatRepository),
      getCustomRepository(AccountStatusRepository),
      getCustomRepository(AccountSegmentationRepository),
      logger
    )

    const transaction = await debitTransaction.handle(request)

    return res.status(HttpStatusCode.OK).json({
      amount: transaction.amount,
      balance: transaction.account.balance,
      dtTransaction: transaction.dtTransaction,
    })
  })

  http.post('/api/v1/transaction/sell_crypto', authorization, async (req: Request, res: Response) => {
    const request: TransactionRequest = {
      amount: req.body.amount,
      externalIdentifier: req.body.extTransactionId,
      externalUserId: req.body.externalUserId,
      description: String(req.body.description),
      symbol: req.body.fiatSymbol,
      transactionTypeSlug: TransactionTypes.SELL_CRYPTO,
      reason: req.body.reason,
    }

    const creditTransaction = new CreditTransaction(
      getCustomRepository(TransactionRepository),
      getCustomRepository(TransactionTypeRepository),
      getCustomRepository(AccountRepository),
      getCustomRepository(FiatRepository),
      getCustomRepository(AccountStatusRepository),
      getCustomRepository(AccountSegmentationRepository),
      logger
    )

    const transaction = await creditTransaction.handle(request)

    return res.status(HttpStatusCode.OK).json({
      id: transaction.uuid,
      amount: transaction.amount,
      balance: transaction.account.balance,
      dtTransaction: transaction.dtTransaction,
    })
  })

  http.post('/api/v1/transaction/migration_dock_balance', authorization, async (req: Request, res: Response) => {
    const request: TransactionRequest = {
      amount: req.body.amount,
      externalIdentifier: req.body.extTransactionId,
      externalUserId: req.body.externalUserId,
      description: String(req.body.description),
      symbol: req.body.fiatSymbol,
      transactionTypeSlug: TransactionTypes.MIGRATION_BAAS_DOCK,
      reason: req.body.reason,
    }

    const creditTransaction = new CreditTransaction(
      getCustomRepository(TransactionRepository),
      getCustomRepository(TransactionTypeRepository),
      getCustomRepository(AccountRepository),
      getCustomRepository(FiatRepository),
      getCustomRepository(AccountStatusRepository),
      getCustomRepository(AccountSegmentationRepository),
      logger
    )

    const transaction = await creditTransaction.handle(request)

    return res.status(HttpStatusCode.OK).json({
      amount: transaction.amount,
      balance: transaction.account.balance,
      dtTransaction: transaction.dtTransaction,
    })
  })

  http.post('/api/v1/transaction/cash_in_payment_slip', authorization, async (req: Request, res: Response) => {
    const request: TransactionRequest = {
      amount: req.body.amount,
      externalIdentifier: req.body.extTransactionId,
      externalUserId: req.body.externalUserId,
      description: String(req.body.description),
      symbol: req.body.fiatSymbol,
      transactionTypeSlug: TransactionTypes.CASH_IN_PAYMENT_SLIP,
      reason: req.body.reason,
    }

    const creditTransaction = new CreditTransaction(
      getCustomRepository(TransactionRepository),
      getCustomRepository(TransactionTypeRepository),
      getCustomRepository(AccountRepository),
      getCustomRepository(FiatRepository),
      getCustomRepository(AccountStatusRepository),
      getCustomRepository(AccountSegmentationRepository),
      logger
    )

    const transaction = await creditTransaction.handle(request)

    return res.status(HttpStatusCode.OK).json({
      amount: transaction.amount,
      balance: transaction.account.balance,
      dtTransaction: transaction.dtTransaction,
    })
  })

  http.post(
    '/api/v1/transaction/withdraw_finance',
    authorization,
    async (req: Request, res: Response): Promise<Response> => {
      const request: TransactionRequest = {
        amount: req.body.amount,
        externalIdentifier: req.body.extTransactionId,
        externalUserId: req.body.externalUserId,
        description: String(req.body.description),
        symbol: req.body.fiatSymbol,
        transactionTypeSlug: TransactionTypes.WITHDRAW_FINANCE,
        reason: req.body.reason,
      }

      const creditTransaction = new CreditTransaction(
        getCustomRepository(TransactionRepository),
        getCustomRepository(TransactionTypeRepository),
        getCustomRepository(AccountRepository),
        getCustomRepository(FiatRepository),
        getCustomRepository(AccountStatusRepository),
        getCustomRepository(AccountSegmentationRepository),
        logger
      )

      const transaction = await creditTransaction.handle(request)

      return res.status(HttpStatusCode.OK).json({
        amount: transaction.amount,
        balance: transaction.account.balance,
        dtTransaction: transaction.dtTransaction,
      })
    }
  )

  http.post(
    '/api/v1/transaction/cash_out_manual_payment',
    authorization,
    async (req: Request, res: Response): Promise<Response> => {
      const request: TransactionRequest = {
        amount: req.body.amount,
        externalIdentifier: req.body.extTransactionId,
        externalUserId: req.body.externalUserId,
        description: String(req.body.description),
        symbol: req.body.fiatSymbol,
        transactionTypeSlug: TransactionTypes.CASH_OUT_MANUAL_PAYMENT,
        reason: req.body.reason,
      }

      const debitTransaction = new DebitTransaction(
        getCustomRepository(TransactionRepository),
        getCustomRepository(TransactionTypeRepository),
        getCustomRepository(AccountRepository),
        getCustomRepository(FiatRepository),
        getCustomRepository(AccountStatusRepository),
        getCustomRepository(AccountSegmentationRepository),
        logger
      )

      const transaction = await debitTransaction.handle(request)

      return res.status(HttpStatusCode.OK).json({
        amount: transaction.amount,
        balance: transaction.account.balance,
        dtTransaction: transaction.dtTransaction,
      })
    }
  )

  http.post('/api/v1/transaction/revert_out', authorization, async (req: Request, res: Response): Promise<Response> => {
    const request: TransactionRequest = {
      amount: req.body.amount,
      externalIdentifier: req.body.extTransactionId,
      externalUserId: req.body.externalUserId,
      description: String(req.body.description),
      symbol: req.body.fiatSymbol,
      transactionTypeSlug: TransactionTypes.REVERT_CASH_OUT,
    }

    const creditTransaction = new CreditTransaction(
      getCustomRepository(TransactionRepository),
      getCustomRepository(TransactionTypeRepository),
      getCustomRepository(AccountRepository),
      getCustomRepository(FiatRepository),
      getCustomRepository(AccountStatusRepository),
      getCustomRepository(AccountSegmentationRepository),
      logger
    )

    const transaction = await creditTransaction.handle(request)

    return res.status(HttpStatusCode.OK).json({
      amount: transaction.amount,
      balance: transaction.account.balance,
      dtTransaction: transaction.dtTransaction,
    })
  })

  http.get('/api/v1/statements', authorization, async (req: Request, res: Response): Promise<Response> => {
    const request: StatementRequest = {
      page: Number(req.query.page) || 1,
      month: String(req.query.month) || '',
      pageSize: Number(req.query.pageSize) || 50,
      externalUserId: String(req.query.externalUserId),
      fiatSymbol: String(req.query.fiatSymbol),
    }
    const listTransactions = new ListTransactions(
      getCustomRepository(AccountRepository),
      getCustomRepository(FiatRepository),
      getCustomRepository(TransactionRepository),
      logger
    )
    const transaction = await listTransactions.handle(request)
    return res.status(HttpStatusCode.OK).json(transaction)
  })

  http.get('/api/v1/transaction/type', authorization, async (req: Request, res: Response): Promise<Response> => {
    const listTransactionsType = new ListTransactionTypes(getCustomRepository(TransactionTypeRepository))
    const transactionType = await listTransactionsType.handle()
    return res.status(HttpStatusCode.OK).json(transactionType)
  })

  http.post('/api/v1/transaction', authorization, async (req: Request, res: Response): Promise<Response> => {
    const request: TransactionManualRequest = {
      amount: req.body.amount,
      externalUserId: req.body.externalUserId,
      description: req.body.description,
      symbol: req.body.symbol,
      transactionTypeSlug: req.body.transactionType,
      externalIdentifier: req.body.extTransactionId,
    }
    const manualTransaction = new ManualTransaction(
      getCustomRepository(TransactionRepository),
      getCustomRepository(TransactionTypeRepository),
      getCustomRepository(AccountRepository),
      getCustomRepository(FiatRepository),
      logger
    )
    const transaction = await manualTransaction.handle(request)

    return res.status(HttpStatusCode.OK).json({
      amount: transaction.amount,
      operationType: transaction.operationType,
      dtTransaction: transaction.dtTransaction,
    })
  })

  http.post(
    '/api/v1/transaction/transfer_p2p',
    authorization,
    async (req: Request, res: Response): Promise<Response> => {
      const request: TransactionP2PRequest = {
        extUserIdIn: req.body.extUserIdIn,
        extUserIdOut: req.body.extUserIdOut,
        amount: req.body.amount,
        fiatSymbol: req.body.fiatSymbol,
      }
      const responseTransaction = new P2PTransaction(
        getCustomRepository(TransactionRepository),
        getCustomRepository(TransactionTypeRepository),
        getCustomRepository(AccountRepository),
        getCustomRepository(FiatRepository),
        logger
      )
      const transaction = await responseTransaction.handle(request)

      return res.status(HttpStatusCode.OK).json({
        id: transaction.id,
        amount: transaction.amount,
        operationType: transaction.operationType,
        dtTransaction: transaction.dtTransaction,
      })
    }
  )
}
