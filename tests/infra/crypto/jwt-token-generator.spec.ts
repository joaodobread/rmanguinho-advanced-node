import { TokenGenerator } from '@/data/contracts/crypto'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

class JwtTokenGenerator {
  constructor (
    private readonly secret: string
  ) {}

  async generateToken (params: TokenGenerator.Params): Promise<void> {
    const expirationInSeconds = params.expirationInMs / 1000
    jwt.sign({ key: params.key }, this.secret, { expiresIn: expirationInSeconds })
  }
}

describe('JwtTokenGenerator', () => {
  test('should call sign with correct values', async () => {
    const fakeJwt = jwt as jest.Mocked<typeof jwt>
    const sut = new JwtTokenGenerator('any-secret')

    await sut.generateToken({ key: 'any-key', expirationInMs: 1000 })

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any-key' }, 'any-secret', { expiresIn: 1 })
  })
})
