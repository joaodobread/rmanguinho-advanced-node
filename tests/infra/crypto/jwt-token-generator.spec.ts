import { JwtTokenGenerator } from '@/infra/crypto'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

describe('JwtTokenGenerator', () => {
  let sut: JwtTokenGenerator
  let fakeJwt: jest.Mocked<typeof jwt>

  beforeEach(() => {
    sut = new JwtTokenGenerator('any-secret')
  })

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>
  })

  test('should call sign with correct values', async () => {
    await sut.generateToken({ key: 'any-key', expirationInMs: 1000 })

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any-key' }, 'any-secret', { expiresIn: 1 })
  })

  test('should return a token', async () => {
    fakeJwt.sign.mockImplementationOnce(() => 'any-token')
    const token = await sut.generateToken({ key: 'any-key', expirationInMs: 1000 })

    expect(token).toBe('any-token')
  })

  test('should return a token', async () => {
    fakeJwt.sign.mockImplementationOnce(() => { throw new Error('jwt-error') })
    const promise = sut.generateToken({ key: 'any-key', expirationInMs: 1000 })

    await expect(promise).rejects.toThrow(new Error('jwt-error'))
  })
})
