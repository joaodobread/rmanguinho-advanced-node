import { AccessToken } from '@/domain/models'

describe('AccessToken', () => {
  test('should create with a value', () => {
    const sut = new AccessToken('any-value')
    expect(sut).toEqual({ value: 'any-value' })
  })
})
