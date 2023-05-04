import stormGlassNormalized3HoursFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json'
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json'
import axios from "axios"
import { StormGlass } from "../stormGlass"

jest.mock('axios')

describe('StormGlass client', () => {
  it('should return the normalized forecast from the StormGlass service', async () => {
    axios.get = jest.fn().mockResolvedValue({data: stormGlassWeather3HoursFixture});

    const lat = -33.792726
    const lng = 151.289824

    const stormGlass = new StormGlass(axios)
    const response = await stormGlass.fetchPoints(lat, lng)
    expect(response).toEqual(stormGlassNormalized3HoursFixture)
  })
})