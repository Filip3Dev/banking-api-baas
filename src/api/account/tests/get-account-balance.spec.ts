import messages from '_account/messages'
import { AccountRepository } from '_account/repository/account-repository'
import { FiatRepository } from '_account/repository/fiat-repository'
import exceptions from '_account/tests/exceptions'
import { makeAccount } from '_account/tests/helpers/make-functions'
import { GetAccountBalance } from '_account/use-case/get-account-balance'
import { AccountBalanceRequest } from '_account/use-case/get-account-balance/payloads'
import { logger } from '_core/adapter/logger'
import { DB_CONNECTION_NAMES } from '_core/constants'
import { HttpStatusCode } from '_core/enums'
import { getCustomRepository } from 'typeorm'

let accountRepository: AccountRepository = undefined
let getAccountBalance: GetAccountBalance = undefined
let fiatRepository: FiatRepository = undefined

beforeEach(async () => {
  accountRepository = getCustomRepository(AccountRepository, DB_CONNECTION_NAMES.TEST)
  await accountRepository.removeAll()

  fiatRepository = getCustomRepository(FiatRepository, DB_CONNECTION_NAMES.TEST)

  getAccountBalance = new GetAccountBalance(accountRepository, fiatRepository, logger)
})

describe('Test GetAccountBalance use case', () => {
  const externalUserId = '261'
  const fiatSymbol = 'BRL'

  it('gets the account balance for the given id', async (done) => {
    const account = await makeAccount()

    const request: AccountBalanceRequest = {
      externalUserId: account.externalUserId,
      fiatSymbol: fiatSymbol,
    }

    const accountResponse = await getAccountBalance.handle(request)

    expect(accountResponse.balance).not.toBeNull()
    expect(accountResponse.fiat.symbol).toBe(fiatSymbol)

    done()
  })

  it('fails when trying to get an account that does not exist', async (done) => {
    const request: AccountBalanceRequest = {
      externalUserId: externalUserId,
      fiatSymbol: fiatSymbol,
    }

    expect(async () => {
      await getAccountBalance.handle(request)
    }).rejects.toMatchObject({
      name: exceptions.domainException,
      message: messages.accountNotFound.message,
      code: HttpStatusCode.NOT_FOUND,
      codeAsString: messages.accountNotFound.code,
    })
    done()
  })
})
