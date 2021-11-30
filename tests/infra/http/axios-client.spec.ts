import { HttpGetClient } from '@/infra/http'
import axios from 'axios'

jest.mock('axios')

class AxiosHttpClient {
  async get (args: HttpGetClient.Params): Promise<void> {
    await axios.get(args.url, { params: args.params })
  }
}

describe('AxiosHttpClient', () => {
  let sut: AxiosHttpClient
  let fakeAxios: jest.Mocked < typeof axios >
  let url: string
  let params: object

  beforeEach(() => {
    sut = new AxiosHttpClient()
  })

  beforeAll(() => {
    fakeAxios = axios as jest.Mocked<typeof axios>
    url = 'any-url'
    params = { any: 'any' }
  })

  describe('get', () => {
    test('should call get with correct params', async () => {
      await sut.get({
        url,
        params
      })

      expect(fakeAxios.get).toHaveBeenCalledWith('any-url', { params })
      expect(fakeAxios.get).toHaveBeenCalledTimes(1)
    })
  })
})
