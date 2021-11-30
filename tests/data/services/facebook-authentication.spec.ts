import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repos'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/models/errors'
import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>
  let createFacebookAccountRepo: MockProxy<CreateFacebookAccountRepository>
  let sut: FacebookAuthenticationService
  const token = 'any-token'

  beforeEach(() => {
    loadFacebookUserApi = mock<LoadFacebookUserApi>()
    loadUserAccountRepo = mock<LoadUserAccountRepository>()
    createFacebookAccountRepo = mock<CreateFacebookAccountRepository>()
    sut = new FacebookAuthenticationService(loadFacebookUserApi, loadUserAccountRepo, createFacebookAccountRepo)
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
    await sut.perform({ token })
    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({ email: 'any-facebook-email' })
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  test('should call CreateUserAccountRepo when LoadFacebookUserApi returns undefined', async () => {
    loadUserAccountRepo.load.mockResolvedValueOnce(undefined)

    await sut.perform({ token })
    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      email: 'any-facebook-email',
      name: 'any-facebook-name',
      facebookId: 'any-fb-id'
    })
    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)
  })
})
