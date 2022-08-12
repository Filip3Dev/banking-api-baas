import { TransferStatusEntity } from '_interfaces/adminjs/entities/transfer-status-entity'
import { BaseResource, Label } from '_interfaces/adminjs/resources/base-resource'
import { ResourceOptions } from 'adminjs'

export class TransferStatusResource extends BaseResource {
  static _editPropertiesOrder = ['exchangeStatusId', 'description', 'transferType']
  static _generalPropertiesOrder = ['id', ...this._editPropertiesOrder, 'createdAt']

  static getResource(): ResourceOptions {
    return {
      resource: TransferStatusEntity,
      options: {
        navigation: {
          name: 'Exchange',
          icon: 'Money',
        },
        properties: {
          exchangeStatusId: {
            isRequired: true,
            props: {
              placeholder: 'Digite o código do status na exchange (Binance)',
            },
          },
          description: {
            isRequired: true,
            isTitle: true,
            props: {
              placeholder: 'Digite a descrição do status na exchange (Binance)',
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
      TransferStatusEntity: 'Transfer status',
    }
  }
}
