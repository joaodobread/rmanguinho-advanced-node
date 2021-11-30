import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository } from '@/data/contracts/repos'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/models/errors'
import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>
  let sut: FacebookAuthenticationService
  const token = 'any-token'

  beforeEach(() => {
    loadFacebookUserApi = mock<LoadFacebookUserApi>()
    loadUserAccountRepo = mock<LoadUserAccountRepository>()
    sut = new FacebookAuthenticationService(loadFacebookUserApi, loadUserAccountRepo)
    loadFacebookUserApi.loadUser.mockResolvedValue({
      name: 'any-facebook-name',
      email: 'any-facebook-email',
      facebookId: 'any-fb-id'
    })
  })

  test('should call LoadFacebookApi with correct params', async () => {
    await sut.perform({ token })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  test('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ token })
    expect(authResult).toEqual(new AuthenticationError())
  })

  test('should call LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce({
      name: 'any-facebook-name',
      email: 'any-facebook-email',
      facebookId: 'any-fb-id'
    })
    await sut.perform({ token })
    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({ email: 'any-facebook-email' })
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1)
  })
})
