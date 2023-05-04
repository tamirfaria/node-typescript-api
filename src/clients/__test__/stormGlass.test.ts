import stormGlassNormalized3HoursFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json'
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json'
import axios from "axios"
import { StormGlass } from "../stormGlass"

jest.mock('axios')

describe('StormGlass client', () => {
  const mockAxios = axios as jest.Mocked<typeof axios>
  it('should return the normalized forecast from the StormGlass service', async () => {
    mockAxios.get.mockResolvedValue({data: stormGlassWeather3HoursFixture});
    
    const lat = -33.792726
    const lng = 151.289824

    const stormGlass = new StormGlass(mockAxios)
    const response = await stormGlass.fetchPoints(lat, lng)
    expect(response).toEqual(stormGlassNormalized3HoursFixture)
  })
})