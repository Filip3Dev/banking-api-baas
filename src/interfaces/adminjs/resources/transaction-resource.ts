import { getDevelopmentEnvironment } from '_core/utils/get-development-environment'
import { TransactionEntity } from '_interfaces/adminjs/entities/transaction-entity'
import { BaseResource, Label } from '_interfaces/adminjs/resources/base-resource'
import AdminJS, { ResourceOptions } from 'adminjs'
import path from 'path'

export class TransactionResource extends BaseResource {
  static getResource(): ResourceOptions {
    const transactionStatusesBadgeComponent = AdminJS.bundle(
      path.join(__dirname, '../', 'components', 'transaction-statuses-badge')
    )
    const transactionTypesBadgeComponent = AdminJS.bundle(
      path.join(__dirname, '../', 'components', 'transaction-types-badge')
    )
    const transactionRevertStatusesBadge = AdminJS.bundle(
      path.join(__dirname, '../', 'components', 'transaction-revert-statuses-badge')
    )

    return {
      resource: TransactionEntity,
      options: {
        navigation: {
          name: 'Exchange',
          icon: 'Money',
        },
        listProperties: [
          'id',
          'accountId',
          'assetId',
          'exchangePrice',
          'price',
          'quantity',
          'total',
          'type',
          'status',
          'updatedAt',
        ],
        sort: 'desc',
        properties: {
          status: {
            components: {
              list: transactionStatusesBadgeComponent,
              show: transactionStatusesBadgeComponent,
            },
          },
          type: {
            components: {
              list: transactionTypesBadgeComponent,
              show: transactionTypesBadgeComponent,
            },
          },
          revertStatus: {
            components: {
              list: transactionRevertStatusesBadge,
              show: transactionRevertStatusesBadge,
            },
          },
        },
        actions: {
          new: {
            isAccessible: getDevelopmentEnvironment(),
          },
          edit: {
            isAccessible: getDevelopmentEnvironment(),
          },
          delete: {
            isAccessible: getDevelopmentEnvironment(),
          },
        },
      },
    } as ResourceOptions
  }

  static getLabels(): Label {
    return {
      TransactionEntity: 'Transaction',
    }
  }
}
