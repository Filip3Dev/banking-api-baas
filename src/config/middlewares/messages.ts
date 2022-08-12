const authorizationError = 'AuthorizationError'

export default {
  secretKeyNotProvided: {
    name: authorizationError,
    message: 'Secret Key was not provided',
    code: 'secret_key_not_provided',
  },
  invalidSecretKey: {
    name: authorizationError,
    message: 'Invalid secret key provided',
    code: 'invalid_secret_key',
  },
}
