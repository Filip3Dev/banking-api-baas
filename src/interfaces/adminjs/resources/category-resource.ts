import { CategoryEntity } from '_interfaces/adminjs/entities/category-entity'
import { BaseResource, Label } from '_interfaces/adminjs/resources/base-resource'
import { ResourceOptions } from 'adminjs'

export class CategoryResource extends BaseResource {
  static getResource(): ResourceOptions {
    return {
      resource: CategoryEntity,
      options: {
        navigation: {
          name: 'Exchange',
          icon: 'Money',
        },
        properties: {
          name: {
            isRequired: true,
            props: {
              placeholder: 'Digite o nome da categoria',
            },
          },
          description: {
            type: 'richtext',
            props: {
              placeholder: 'Digite a descrição da categoria',
            },
          },
        },
      },
    } as ResourceOptions
  }

  static getLabels(): Label {
    return {
      CategoryEntity: 'Category',
    }
  }
}
