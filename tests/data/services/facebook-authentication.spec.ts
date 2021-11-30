import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/models/errors'

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string;
  result = undefined;
  callsCount: number = 0;

  async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token
    this.callsCount++
    return this.result
  };
}

describe('FacebookAuthenticationService', () => {
  test('should call LoadFacebookApi with correct params', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy()
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    await sut.perform({ token: 'any-token' })
    expect(loadFacebookUserApi.token).toBe('any-token')
    expect(loadFacebookUserApi.callsCount).toBe(1)
  })

  test('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy()
    loadFacebookUserApi.result = undefined
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    const authResult = await sut.perform({ token: 'any-token' })
    expect(authResult).toEqual(new AuthenticationError())
  })
})
