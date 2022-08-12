import { AccountRepository } from '_account/repository/account-repository'
import { loadConnection } from '_config/database'
import { CryptoHashingHandler } from '_core/services/crypto-hashing-handler'
import { UserEntity } from '_interfaces/adminjs/entities/user-entity'
import { AccountResource } from '_interfaces/adminjs/resources/account-resource'
import { AppSettingsResource } from '_interfaces/adminjs/resources/app-settings-resource'
import { AssetNetworkResource } from '_interfaces/adminjs/resources/asset-network-resource'
import { CategoryResource } from '_interfaces/adminjs/resources/category-resource'
import { CreditResource } from '_interfaces/adminjs/resources/credit-resource'
import { FavoriteAssetResource } from '_interfaces/adminjs/resources/favorite-asset-resource'
import { NetworkResource } from '_interfaces/adminjs/resources/network-resource'
import { TransactionResource } from '_interfaces/adminjs/resources/transaction-resource'
import { TransferResource } from '_interfaces/adminjs/resources/transfer-resource'
import { TransferStatusResource } from '_interfaces/adminjs/resources/transfer-status-resource'
import { UserResource } from '_interfaces/adminjs/resources/user-resources'
import AdminJsExpress from '@adminjs/express'
import { Database, Resource } from '@adminjs/typeorm'
import AdminJs from 'adminjs'
import { Router } from 'express'
import { getCustomRepository } from 'typeorm'

interface AdminJsConfig {
  adminJs: AdminJs
  adminJsRouter: Router
}

async function setupAdminJs(): Promise<AdminJsConfig> {
  AdminJs.registerAdapter({ Database, Resource })
  const hashingHandler = new CryptoHashingHandler()
  const accountRepository = getCustomRepository(AccountRepository)

  const resources = [
    AccountResource.getResource(accountRepository),
    CategoryResource.getResource(),
    FavoriteAssetResource.getResource(),
    TransactionResource.getResource(),
    AppSettingsResource.getResource(),
    UserResource.getResource(hashingHandler),
    CreditResource.getResource(),
    NetworkResource.getResource(),
    AssetNetworkResource.getResource(),
    TransferStatusResource.getResource(),
    TransferResource.getResource(),
  ]

  const labels = {
    ...AccountResource.getLabels(),
    ...CategoryResource.getLabels(),
    ...FavoriteAssetResource.getLabels(),
    ...TransactionResource.getLabels(),
    ...AppSettingsResource.getLabels(),
    ...UserResource.getLabels(),
    ...CreditResource.getLabels(),
    ...NetworkResource.getLabels(),
    ...AssetNetworkResource.getLabels(),
    ...TransferStatusResource.getLabels(),
    ...TransferResource.getLabels(),
  }

  const adminJs = new AdminJs({
    resources,
    locale: {
      language: 'en',
      translations: {
        labels,
        resources: {
          ...AppSettingsResource.getPropertiesLabels(),
        },
        messages: {
          confirmBlock: 'Do you really want to block this account?',
          confirmUnblock: 'Do you really want to unblock this account?',
          successfullyBlocked: 'Successfully blocked given account',
          successfullyUnblocked: 'Successfully unblocked given account',
        },
      },
    },
    rootPath: '/admin',
    branding: {
      companyName: 'RedBenx',
      logo: '/static/brand.svg',
    },
  })

  const adminJsRouter = AdminJsExpress.buildAuthenticatedRouter(
    adminJs,
    {
      authenticate: async (email, password) => {
        const user = await UserEntity.findOne({ email })
        if (!user || !hashingHandler.verify(user.hashedPassword, password)) {
          return false
        }
        return user
      },
      cookiePassword: process.env.ADMINJS_COOKIE_SECURITY_SECRET,
    },
    null,
    { resave: false, saveUninitialized: true }
  )

  return { adminJs, adminJsRouter } as AdminJsConfig
}

export default loadConnection().then(setupAdminJs)
