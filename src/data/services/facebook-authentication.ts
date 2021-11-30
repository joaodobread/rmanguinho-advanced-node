import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { FacebookAuthentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/models/errors'
import { LoadUserAccountRepository, CreateFacebookAccountRepository } from '@/data/contracts/repos'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepo: LoadUserAccountRepository,
    private readonly createFacebookAccountRepo: CreateFacebookAccountRepository
  ) { }

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserByTokenApi.loadUser(params)
    if (fbData !== undefined) {
      await this.loadUserAccountRepo.load({ email: fbData.email })
      await this.createFacebookAccountRepo.createFromFacebook(fbData)
    }
    return new AuthenticationError()
  }
}
