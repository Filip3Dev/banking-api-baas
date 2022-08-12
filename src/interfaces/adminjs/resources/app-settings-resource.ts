import { AppSettingsEntity } from '_interfaces/adminjs/entities/app-settings-entity'
import { BaseResource, Label, PropertyLabel } from '_interfaces/adminjs/resources/base-resource'
import { ResourceOptions } from 'adminjs'

export class AppSettingsResource extends BaseResource {
  static getResource(): ResourceOptions {
    return {
      resource: AppSettingsEntity,
      options: {
        navigation: {
          name: 'Settings',
          icon: 'Settings',
        },
        properties: {
          id: {
            isVisible: false,
          },
          feesValidityStartDate: {
            isVisible: false,
          },
          feesValidityEndDate: {
            isVisible: false,
          },
          buyingExchangeFeePercentage: {
            isDisabled: true,
          },
          sellingExchangeFeePercentage: {
            isDisabled: true,
          },
        },
        actions: {
          new: {
            isAccessible: false,
          },
          delete: {
            isAccessible: false,
          },
        },
      },
    } as ResourceOptions
  }

  static getLabels(): Label {
    return {
      AppSettingsEntity: 'App Settings',
    }
  }

  static getPropertiesLabels(): PropertyLabel {
    return {
      AppSettingsEntity: {
        properties: {
          buyingExchangeFeePercentage: 'Buying Exchange Fee Percentage (Binance)',
          sellingExchangeFeePercentage: 'Selling Exchange Fee Percentage (Binance)',
        },
      },
    }
  }
}
