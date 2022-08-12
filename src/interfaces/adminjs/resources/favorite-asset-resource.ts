import { getDevelopmentEnvironment } from '_core/utils/get-development-environment'
import { FavoriteAssetEntity } from '_interfaces/adminjs/entities/favorite-asset-entity'
import { BaseResource, Label } from '_interfaces/adminjs/resources/base-resource'
import { ResourceOptions } from 'adminjs'

export class FavoriteAssetResource extends BaseResource {
  static getResource(): ResourceOptions {
    return {
      resource: FavoriteAssetEntity,
      options: {
        navigation: {
          name: 'Exchange',
          icon: 'Money',
        },
        actions: {
          list: {
            isAccessible: getDevelopmentEnvironment(),
          },
        },
      },
    } as ResourceOptions
  }

  static getLabels(): Label {
    return {
      FavoriteAssetEntity: 'Favorite Asset',
    }
  }
}
