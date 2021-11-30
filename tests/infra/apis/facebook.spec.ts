import { FacebookApi } from '@/infra/apis'
import { HttpGetClient } from '@/infra/http'
import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookApi', () => {
  let clientId: string
  let clientSecret: string
  let sut: FacebookApi
  let httpClient: MockProxy<HttpGetClient>

  beforeAll(() => {
    clientId = 'client_id'
    clientSecret = 'clientSecret'
    httpClient = mock()
  })

  beforeEach(() => {
    httpClient.get
      .mockResolvedValueOnce({ access_token: 'any-app-token' })
      .mockResolvedValueOnce({ data: { user_id: 'any-user-id' } })
      .mockResolvedValueOnce({ id: 'any-fb-id', name: 'any-fb-name', email: 'any-fb-email' })

    sut = new FacebookApi(httpClient, clientId, clientSecret)
  })

  test('should get app token', async () => {
    await sut.loadUser({ token: 'any-client-token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      }
    })
  })

  test('should get debug token', async () => {
    await sut.loadUser({ token: 'any-client-token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/debug_token',
      params: {
        access_token: 'any-app-token',
        input_token: 'any-client-token'
      }
    })
  })

  test('should get user info', async () => {
    await sut.loadUser({ token: 'any-client-token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/any-user-id',
      params: {
        fields: 'id,name,email',
        access_token: 'any-client-token'
      }
    })
  })

  test('should return facebook user', async () => {
    const fbUser = await sut.loadUser({ token: 'any-client-token' })

    expect(fbUser).toEqual({
      facebookId: 'any-fb-id',
      name: 'any-fb-name',
      email: 'any-fb-email'
    })
  })
})
