import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { CreateFacebookAccountRepository, LoadUserAccountRepository, UpdateFacebookAccountRepository } from '@/data/contracts/repos'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/models/errors'
import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthenticationService', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepo: MockProxy<LoadUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository>
  let sut: FacebookAuthenticationService
  const token = 'any-token'

  beforeEach(() => {
    facebookApi = mock<LoadFacebookUserApi>()
    userAccountRepo = mock()
    sut = new FacebookAuthenticationService(facebookApi, userAccountRepo)
    userAccountRepo.load.mockResolvedValue(undefined)

    facebookApi.loadUser.mockResolvedValue({
      name: 'any-facebook-name',
      email: 'any-facebook-email',
      facebookId: 'any-fb-id'
    })
  })

  test('should call LoadFacebookApi with correct params', async () => {
    await sut.perform({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  test('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ token })
    expect(authResult).toEqual(new AuthenticationError())
  })

  test('should call LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token })
    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any-facebook-email' })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  test('should call CreateFacebookAccountRepo when LoadFacebookUserApi returns undefined', async () => {
    await sut.perform({ token })
    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      email: 'any-facebook-email',
      name: 'any-facebook-name',
      facebookId: 'any-fb-id'
    })
    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)
  })

  test('should call UpdateFacebookAccountRepo when LoadFacebookUserApi returns data', async () => {
    userAccountRepo.load.mockResolvedValueOnce({
      id: 'any-id',
      name: 'any-name'
    })

    await sut.perform({ token })
    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledWith({
      id: 'any-id',
      name: 'any-name',
      facebookId: 'any-fb-id'
    })
    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledTimes(1)
  })

  test('should update account name', async () => {
    userAccountRepo.load.mockResolvedValueOnce({
      id: 'any-id'
    })

    await sut.perform({ token })
    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledWith({
      id: 'any-id',
      name: 'any-facebook-name',
      facebookId: 'any-fb-id'
    })
    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledTimes(1)
  })
})
