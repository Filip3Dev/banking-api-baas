import { HashingHandler } from '_core/services/types'
import { UserEntity, UserRoles } from '_interfaces/adminjs/entities/user-entity'
import { InterfaceException } from '_interfaces/adminjs/errors/interface-exception'
import messages from '_interfaces/adminjs/messages/interface-exceptions'
import { BaseResource, Label } from '_interfaces/adminjs/resources/base-resource'
import { isAdmin } from '_interfaces/adminjs/utils/role-checks'
import { ActionRequest, ResourceOptions } from 'adminjs'

export class UserResource extends BaseResource {
  static getResource(hashingHandler: HashingHandler): ResourceOptions
  static getResource(): ResourceOptions

  static getResource(hashingHandler?: HashingHandler): ResourceOptions {
    if (!hashingHandler) {
      throw new InterfaceException(messages.hashingHandlerInstanceNotProvided)
    }

    return {
      resource: UserEntity,
      options: {
        navigation: {
          name: 'Admin',
          icon: 'Dashboard',
        },
        properties: {
          email: {
            isRequired: true,
          },
          hashedPassword: {
            isVisible: false,
          },
          password: {
            type: 'password',
            isVisible: {
              list: false,
              edit: true,
              filter: false,
              show: false,
            },
            isRequired: true,
          },
          role: {
            availableValues: [
              { value: UserRoles.ADMIN, label: 'Admin' },
              { value: UserRoles.STAFF, label: 'Staff' },
            ],
            isRequired: true,
          },
        },
        actions: {
          new: {
            before: (request: ActionRequest) => this.encryptPassword(request, hashingHandler),
            isAccessible: isAdmin,
          },
          edit: {
            before: (request: ActionRequest) => this.encryptPassword(request, hashingHandler),
            isAccessible: isAdmin,
          },
          delete: { isAccessible: isAdmin },
          list: { isAccessible: isAdmin },
          show: { isAccessible: isAdmin },
        },
      },
    } as ResourceOptions
  }

  static getLabels(): Label {
    return {
      UserEntity: 'User',
    }
  }

  static async encryptPassword(request: ActionRequest, hashingHandler: HashingHandler): Promise<ActionRequest> {
    if (request.payload.password) {
      request.payload = {
        ...request.payload,
        hashedPassword: hashingHandler.hash(request.payload.password),
        password: undefined,
      }
    }
    return request
  }
}
