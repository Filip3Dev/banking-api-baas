import { getDevelopmentEnvironment } from '_core/utils/get-development-environment'
import { TransferEntity } from '_interfaces/adminjs/entities/transfer-entity'
import { BaseResource, Label } from '_interfaces/adminjs/resources/base-resource'
import { ResourceOptions } from 'adminjs'

export class TransferResource extends BaseResource {
  static getResource(): ResourceOptions {
    return {
      resource: TransferEntity,
      options: {
        navigation: {
          name: 'Exchange',
          icon: 'Money',
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
      TransferEntity: 'Transfer',
    }
  }
}
