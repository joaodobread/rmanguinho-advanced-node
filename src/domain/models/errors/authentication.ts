export class AuthenticationError extends Error {
  constructor () {
    super('Authenication failed')
    this.name = 'AuthenticationError'
  }
}
