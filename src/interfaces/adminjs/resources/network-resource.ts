import { NetworkEntity } from '_interfaces/adminjs/entities/network-entity'
import { BaseResource, Label } from '_interfaces/adminjs/resources/base-resource'
import { ResourceOptions } from 'adminjs'

export class NetworkResource extends BaseResource {
  static _editPropertiesOrder = ['code', 'name']
  static _generalPropertiesOrder = ['id', ...this._editPropertiesOrder, 'createdAt', 'updatedAt']

  static getResource(): ResourceOptions {
    return {
      resource: NetworkEntity,
      options: {
        navigation: {
          name: 'Exchange',
          icon: 'Money',
        },
        properties: {
          code: {
            isRequired: true,
            props: {
              placeholder: 'Digite o código da rede',
            },
          },
          name: {
            isRequired: true,
            props: {
              placeholder: 'Digite o nome da rede',
            },
          },
        },
        listProperties: this._generalPropertiesOrder,
        showProperties: this._generalPropertiesOrder,
        editProperties: this._editPropertiesOrder,
      },
    } as ResourceOptions
  }

  static getLabels(): Label {
    return {
      NetworkEntity: 'Network',
    }
  }
}
