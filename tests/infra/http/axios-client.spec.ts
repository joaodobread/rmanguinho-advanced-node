import { HttpGetClient } from '@/infra/http'
import axios from 'axios'

jest.mock('axios')

class AxiosHttpClient {
  async get (args: HttpGetClient.Params): Promise<any> {
    const result = await axios.get(args.url, { params: args.params })
    return result.data
  }
}

describe('AxiosHttpClient', () => {
  let sut: AxiosHttpClient
  let fakeAxios: jest.Mocked<typeof axios>
  let url: string
  let params: object

  beforeEach(() => {
    sut = new AxiosHttpClient()
  })

  beforeAll(() => {
    fakeAxios = axios as jest.Mocked<typeof axios>
    url = 'any-url'
    params = { any: 'any' }
    fakeAxios.get.mockResolvedValue({
      status: 200,
      data: 'any-data'
    })
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

    test('should return data on success', async () => {
      const result = await sut.get({
        url,
        params
      })

      expect(result).toEqual('any-data')
      expect(fakeAxios.get).toHaveBeenCalledTimes(1)
    })

    test('should rethrow if get throws', async () => {
      fakeAxios.get.mockRejectedValueOnce(new Error('http-error'))
      const promise = sut.get({
        url,
        params
      })

      await expect(promise).rejects.toThrow(new Error('http-error'))
    })
  })
})
