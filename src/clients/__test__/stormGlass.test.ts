import * as HTTPUtil from '@src/util/request'
import stormGlassNormalized3HoursFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json'
import * as stormglassWeatherPointFixture from '@test/fixtures/stormglass_weather_3_hours.json'
import { StormGlass } from "../stormGlass"

jest.mock('@src/util/request')

describe('StormGlass client', () => {
  const lat = -33.792726
  const lng = 151.289824
  const MockedRequestClass = HTTPUtil.Request as jest.Mocked<typeof HTTPUtil.Request>
  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>

  it('should return the normalized forecast from the StormGlass service', async () => {
    mockedRequest.get.mockResolvedValue({ data: stormglassWeatherPointFixture } as HTTPUtil.Response)
    const stormGlass = new StormGlass(mockedRequest)
    const response = await stormGlass.fetchPoints(lat, lng)
    expect(response).toEqual(stormGlassNormalized3HoursFixture)
  })

  it('should exclude incomplete data points', async () => {
    const incompleteResponse = {
      hours: [
        {
          windDirection: { noaa: 300 },
          time: '2020-04-26T00:00:00:00+00:00'
        }
      ]
    }
    mockedRequest.get.mockResolvedValue({ data: incompleteResponse } as HTTPUtil.Response)
    const stormGlass = new StormGlass(mockedRequest)
    const response = await stormGlass.fetchPoints(lat, lng)
    expect(response).toEqual([])
  })

  it('should get a generic error from StormGlass service when the request fail before reaching the service', async () => {
    mockedRequest.get.mockRejectedValue({ message: 'Network Error' })
    const stormGlass = new StormGlass(mockedRequest)
    const response = stormGlass.fetchPoints(lat, lng)
    await expect(response).rejects.toThrow(`Unexpected error when trying to communicate to StormGlass: {"message":"Network Error"}`)
  })

  it('should get an StormGlassResponseError when the StormGlass service responds with error', async () => {
    class FakeAxiosError extends Error {
      constructor(public response: object) {
        super()
      }
    }

    const rateLimitMessage = {
      status: 429,
      data: { errors: ['Rate Limite reached'] }
    }

    mockedRequest.get.mockRejectedValue(new FakeAxiosError(rateLimitMessage))
    MockedRequestClass.isRequestError.mockReturnValue(true)
    MockedRequestClass.extractErrorData.mockReturnValue(rateLimitMessage)
    const stormGlass = new StormGlass(mockedRequest)
    
    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Erro: {"errors":["Rate Limite reached"]} Code: 429'
    )
  })
})