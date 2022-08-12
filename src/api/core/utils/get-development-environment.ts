import { ENV, ENVIRONMENTS } from '_core/constants'

export const getDevelopmentEnvironment = (): boolean => {
  return ENV === ENVIRONMENTS.DEV
}
