import { FacebookAuthentication } from '@/domain/features'

interface LoadFacebookUserApi {
  loadUser: (params: LoadFacebookUserApi.Params) => Promise<void>
}

namespace LoadFacebookUserApi {
  export type Params = {
    token: string
  }
}

class FacebookAuthenticationService {
  constructor (private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi) {}
  async perform (params: FacebookAuthentication.Params): Promise<void> {
    await this.loadFacebookUserByTokenApi.loadUser(params)
  }
}

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string;
  async loadUser (params: LoadFacebookUserApi.Params): Promise<void> {
    this.token = params.token
  };
}

describe('FacebookAuthenticationService', () => {
  test('should call LoadFacebookApi with correct params', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy()
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    await sut.perform({ token: 'any-token' })

    expect(loadFacebookUserApi.token).toBe('any-token')
  })
})
