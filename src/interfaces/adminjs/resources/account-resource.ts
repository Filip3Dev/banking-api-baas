import { AccountRepository } from '_account/repository/account-repository'
import { getDevelopmentEnvironment } from '_core/utils/get-development-environment'
import { AccountEntity } from '_interfaces/adminjs/entities/account-entity'
import { InterfaceException } from '_interfaces/adminjs/errors/interface-exception'
import messages from '_interfaces/adminjs/messages/interface-exceptions'
import { BaseResource, Label } from '_interfaces/adminjs/resources/base-resource'
import { exportToCsv } from '_interfaces/adminjs/utils/export-to-csv'
import AdminJs, {
  ActionContext,
  ActionRequest,
  ActionResponse,
  NotFoundError,
  RecordActionResponse,
  ResourceOptions,
  ValidationError,
} from 'adminjs'
import path from 'path'

enum BlockActions {
  block = 'block',
  unblock = 'unblock',
}

export class AccountResource extends BaseResource {
  static getResource(accountRepository: AccountRepository): ResourceOptions
  static getResource(): ResourceOptions

  static getResource(accountRepository?: AccountRepository): ResourceOptions {
    if (!accountRepository) {
      throw new InterfaceException(messages.accountRepositoryInstanceNotProvided)
    }

    return {
      resource: AccountEntity,
      options: {
        navigation: {
          name: 'Exchange',
          icon: 'Money',
        },
        properties: {
          apiKey: {
            isVisible: false,
          },
          apiSecret: {
            isVisible: false,
          },
        },
        actions: {
          edit: {
            isAccessible: getDevelopmentEnvironment(),
          },
          delete: {
            isAccessible: getDevelopmentEnvironment(),
          },
          exportToCSV: this.exportToCsv(),
          block: this.mapBlockAction(accountRepository, BlockActions.block),
          unblock: this.mapBlockAction(accountRepository, BlockActions.unblock),
        },
      },
    } as ResourceOptions
  }

  static getLabels(): Label {
    return {
      AccountEntity: 'Account',
    }
  }

  static exportToCsv(): ResourceOptions {
    return {
      icon: 'Document',
      actionType: 'bulk',
      isVisible: true,
      component: AdminJs.bundle(path.join(__dirname, '../', 'components', 'export-to-csv')),
      variant: 'success',
      handler: async (_request: ActionRequest, _response: ActionResponse, context: ActionContext) => {
        const filename = `${new Date().getTime()}-account.csv`
        const columns = ['id', 'externalUserId', 'exchangeAccountId', 'isActive', 'createdAt', 'updatedAt']
        context.records[0].params['filepath'] = await exportToCsv(filename, context.records, columns)

        return {
          records: context.records,
        }
      },
    } as ResourceOptions
  }

  static mapBlockAction(accountRepository: AccountRepository, action: BlockActions): Record<string, unknown> {
    const icon = action === BlockActions.block ? 'Locked' : 'Unlocked'
    const guard = action === BlockActions.block ? 'confirmBlock' : 'confirmUnblock'
    const variant = action === BlockActions.block ? 'danger' : 'success'
    const isVisible = ({ record }: ActionContext): boolean => {
      const { isBlocked } = record.params
      return action === BlockActions.block ? !isBlocked : isBlocked
    }

    return {
      actionType: 'record',
      icon,
      guard,
      variant,
      component: false,
      isVisible,
      handler: async (request: ActionRequest, _response: ActionResponse, data) =>
        this.handleAccountBlock(request, data, accountRepository, action),
    }
  }

  static async handleAccountBlock(
    request: ActionRequest,
    data: unknown,
    accountRepository: AccountRepository,
    action: BlockActions
  ): Promise<RecordActionResponse> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { record, resource, currentAdmin, h, translateMessage } = data as any

    if (!request.params.recordId || !record) {
      throw new NotFoundError(['You have to pass "recordId" to Block Action'].join('\n'), 'Action#handler')
    }

    try {
      const { params } = record
      const account = await accountRepository.findOne(params.id)
      account.isBlocked = !account.isBlocked
      await accountRepository.save(account)
    } catch (error) {
      if (error instanceof ValidationError && error.baseError) {
        return {
          record: record.toJSON(currentAdmin),
          notice: {
            message: error.baseError.message,
            type: 'error',
          },
        }
      }
      throw error
    }
    const message = action === BlockActions.block ? 'successfullyBlocked' : 'successfullyUnblocked'

    return {
      record: record.toJSON(currentAdmin),
      redirectUrl: h.resourceUrl({ resourceId: resource._decorated?.id() || resource.id() }),
      notice: {
        message: translateMessage(message, resource.id()),
        type: 'success',
      },
    }
  }
}
