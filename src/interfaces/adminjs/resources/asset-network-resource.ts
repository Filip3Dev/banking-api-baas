import { AssetNetworkEntity } from '_interfaces/adminjs/entities/asset-network-entity'
import { BaseResource, Label } from '_interfaces/adminjs/resources/base-resource'
import { ResourceOptions } from 'adminjs'

export class AssetNetworkResource extends BaseResource {
  static getResource(): ResourceOptions {
    return {
      resource: AssetNetworkEntity,
      options: {
        navigation: {
          name: 'Exchange',
          icon: 'Money',
        },
      },
    } as ResourceOptions
  }

  static getLabels(): Label {
    return {
      AssetNetworkEntity: 'Asset Network',
    }
  }
}
