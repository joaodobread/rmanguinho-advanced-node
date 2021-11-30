import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { FacebookAuthentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/models/errors'
import { LoadUserAccountRepository } from '@/data/contracts/repos'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi,
    private readonly userRepo: LoadUserAccountRepository
  ) { }

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserByTokenApi.loadUser(params)
    if (fbData !== undefined) {
      await this.userRepo.load({ email: fbData.email })
    }
    return new AuthenticationError()
  }
}
