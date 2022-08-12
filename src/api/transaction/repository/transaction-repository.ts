import { HttpStatusCode } from '_core/enums'
import { DomainException } from '_core/exceptions/domain-exceptions'
import { Statement } from '_transaction/@types'
import messages from '_transaction/messages'
import { Transaction } from '_transaction/model/transaction-model'
import { format, eachMonthOfInterval } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { EntityRepository, Repository, SelectQueryBuilder, Between } from 'typeorm'

@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {
  /**
   * Reload an entity from the database
   * @param transaction
   */
  async reload(transaction: Transaction): Promise<Transaction> {
    const transactionUpToDate = await this.findOneOrFail(transaction.id)
    if (!transactionUpToDate) {
      throw new DomainException(
        messages.transactionNotFound.message,
        HttpStatusCode.NOT_FOUND,
        messages.transactionNotFound.code
      )
    }
    return transactionUpToDate
  }

  async removeAll(): Promise<void> {
    await this.remove(await this.find())
  }

  async findOneByIdWithAccountAndAsset(transactionId: number): Promise<Transaction> {
    return this.findOne(transactionId, { relations: ['account', 'asset'] })
  }

  async findAllByAssetAndAccount(
    accountId: number,
    symbol: string,
    orderBy = 'id',
    sort: 'ASC' | 'DESC' = 'ASC'
  ): Promise<Transaction[]> {
    return this.find({
      join: { alias: 'transactions', innerJoin: { asset: 'transactions.asset' } },
      where: (qb: SelectQueryBuilder<Transaction>) => {
        qb.where({
          accountId,
        }).andWhere('asset.symbol = :symbol', { symbol })
      },
      order: {
        [orderBy]: sort,
      },
    })
  }

  async findTransactionsByDateAndAccount(
    dateInitial: Date,
    dateFinal: Date,
    accountId: number,
    offset: number,
    limit: number
  ): Promise<Statement> {
    const [totalResults, list] = await Promise.all([
      this.count({
        select: ['id'],
        where: (qb: SelectQueryBuilder<Transaction>) => {
          qb.where({ accountId, dtTransaction: Between(dateInitial, dateFinal) })
        },
      }),
      this.createQueryBuilder('transactions')
        .innerJoinAndSelect('transactions.transactionType', 'tester')
        .where({
          accountId,
          dtTransaction: Between(dateInitial, dateFinal),
        })
        .skip(offset > 1 ? (offset - 1) * limit : 0)
        .take(limit)
        .getMany(),
    ])

    const creation = await this.query(`SELECT created_at FROM accounts WHERE id = ${accountId}`)

    const eachMonth = eachMonthOfInterval({
      start: new Date(creation[0].created_at),
      end: new Date(),
    })

    const months = eachMonth.map((element) => {
      let date = format(new Date(element), 'MMM/yyyy', { locale: ptBR })
      date = date.toLowerCase()
      return date
    })
    return {
      haveTransactions: !!totalResults,
      statement: list,
      totalResults: totalResults,
      months,
      currentPage: offset,
      perPage: limit,
      totalPages: Math.ceil(totalResults / limit),
    }
  }
}
