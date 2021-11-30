import { FacebookAccount } from '@/domain/models'

describe('FacebookAccount', () => {
  const fbData = {
    name: 'any-fb-name',
    email: 'any-fb-email',
    facebookId: 'any-fb-id'
  }
  test('should create with facebook data only', () => {
    const sut = new FacebookAccount(fbData)
    expect(sut).toEqual(fbData)
  })

  test('should update name if is empty', () => {
    const accountData = { id: 'any-id' }
    const sut = new FacebookAccount(fbData, accountData)
    expect(sut).toEqual({
      id: 'any-id',
      name: 'any-fb-name',
      email: 'any-fb-email',
      facebookId: 'any-fb-id'
    })
  })

  test('should not update name if is not empty', () => {
    const accountData = { id: 'any-id', name: 'any-name' }
    const sut = new FacebookAccount(fbData, accountData)
    expect(sut).toEqual({
      id: 'any-id',
      name: 'any-name',
      email: 'any-fb-email',
      facebookId: 'any-fb-id'
    })
  })
})
