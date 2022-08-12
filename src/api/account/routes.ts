import { AccountRepository } from '_account/repository/account-repository'
import { TransactionRepository } from '_account/repository/transaction-repository'
import { TransactionTypeRepository } from '_account/repository/transaction-type-repository'
import { CreateAccount } from '_account/use-case/create-account'
import { AccountRequest } from '_account/use-case/create-account/payloads'
import { GetAccountBalance } from '_account/use-case/get-account-balance'
import { AccountBalanceRequest } from '_account/use-case/get-account-balance/payloads'
import { authorization } from '_config/middlewares/authorization'
import { logger } from '_core/adapter/logger'
import { HttpStatusCode } from '_core/enums'
import express, { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'

import { AccountSegmentationRepository } from './repository/account-segmentation-repository'
import { AccountStatusRepository } from './repository/account-status-repository'
import { FiatRepository } from './repository/fiat-repository'

function routes(http: express.Application): void {
  http.post('/api/v1/account', authorization, async (req: Request, res: Response) => {
    const request: AccountRequest = {
      externalUserId: req.body.externalUserId,
      fiatSymbol: req.body.fiatSymbol,
    }

    const createAccount = new CreateAccount(
      getCustomRepository(AccountRepository),
      getCustomRepository(FiatRepository),
      getCustomRepository(AccountStatusRepository),
      getCustomRepository(AccountSegmentationRepository),
      getCustomRepository(TransactionRepository),
      getCustomRepository(TransactionTypeRepository),
      logger
    )
    const account = await createAccount.handle(request)

    return res.status(HttpStatusCode.CREATED).json(account)
  })

  http.get('/api/v1/account/balance', authorization, async (req: Request, res: Response) => {
    const request: AccountBalanceRequest = {
      externalUserId: String(req.query.externalUserId),
      fiatSymbol: String(req.query.fiatSymbol),
    }

    const getAccountBalance = new GetAccountBalance(
      getCustomRepository(AccountRepository),
      getCustomRepository(FiatRepository),
      logger
    )
    const account = await getAccountBalance.handle(request)

    return res.status(HttpStatusCode.OK).json({ balance: account.balance })
  })
}

export default routes
