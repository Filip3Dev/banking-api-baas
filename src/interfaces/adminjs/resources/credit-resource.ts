import { getDevelopmentEnvironment } from '_core/utils/get-development-environment'
import { CreditEntity } from '_interfaces/adminjs/entities/credit-entity'
import { BaseResource, Label } from '_interfaces/adminjs/resources/base-resource'
import { ResourceOptions } from 'adminjs'

export class CreditResource extends BaseResource {
  static getResource(): ResourceOptions {
    return {
      resource: CreditEntity,
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
      CreditEntity: 'Credit',
    }
  }
}
