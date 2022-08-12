import { LocaleTranslationsBlock, ResourceOptions } from 'adminjs'

export type Label = Record<string, string>

export type PropertyLabel = Record<string, Partial<LocaleTranslationsBlock>>

export abstract class BaseResource {
  static getResource(): ResourceOptions {
    throw new Error('Method not implemented.')
  }

  static getLabels(): Label {
    throw new Error('Method not implemented.')
  }
}
