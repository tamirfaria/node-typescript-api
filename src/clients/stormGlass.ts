import { AxiosStatic } from "axios";
import { ForecastPoint, StormGlassForecastResponse, StormGlassPoint } from "./types";
export class StormGlass {
  readonly stormGlassAPISource = 'noaa';
  readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';

  constructor(protected request: AxiosStatic) { }

  private normalizedResponse(points: StormGlassForecastResponse): ForecastPoint[] {
    return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
      time: point.time,
      swellDirection: point.swellDirection[this.stormGlassAPISource],
      swellHeight: point.swellHeight[this.stormGlassAPISource],
      swellPeriod: point.swellPeriod[this.stormGlassAPISource],
      waveDirection: point.waveDirection[this.stormGlassAPISource],
      windDirection: point.windDirection[this.stormGlassAPISource],
      waveHeight: point.waveHeight[this.stormGlassAPISource],
      windSpeed: point.windSpeed[this.stormGlassAPISource],
    }))
  }

  private isValidPoint(point: Partial<StormGlassPoint>): boolean {
    return Boolean(
      point.time && point.swellDirection?.[this.stormGlassAPISource] && point.swellHeight?.[this.stormGlassAPISource] && point.swellPeriod?.[this.stormGlassAPISource] && point.waveDirection?.[this.stormGlassAPISource] && point.waveHeight?.[this.stormGlassAPISource] && point.windDirection?.[this.stormGlassAPISource] && point.windSpeed?.[this.stormGlassAPISource]
    )
  }

  public async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]> {
    const url = `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}`
    const headers = { Authorization: 'fake-token' }
    const response = await this.request.get<StormGlassForecastResponse>(url, { headers })

    return this.normalizedResponse(response.data)
  }
}
