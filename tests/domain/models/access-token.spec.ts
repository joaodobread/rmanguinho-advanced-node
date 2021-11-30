import { AccessToken } from '@/domain/models'

describe('AccessToken', () => {
  test('should create with a value', () => {
    const sut = new AccessToken('any-value')
    expect(sut).toEqual({ value: 'any-value' })
  })

  test('should expire in 1800000 ms', () => {
    expect(AccessToken.expirationInMs).toBe(1800000)
  })
})
