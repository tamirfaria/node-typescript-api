import { InternalError } from "@src/util/errors/internal-error";
import * as HTTPUtil from '@src/util/request';
import config, { IConfig } from 'config';
import { ForecastPoint, StormGlassForecastResponse, StormGlassPoint } from "./types";

export class StormGlassResponseError extends InternalError {
  constructor(message: string) {
    const internalMessage = 'Unexpected error returned by the StormGlass service'
    super(`${internalMessage}: ${message}`)
  }
}

export class ClientRequestError extends InternalError {
  constructor(message: string) {
    const internalMessage = 'Unexpected error when trying to communicate to StormGlass'
    super(`${internalMessage}: ${message}`)
  }
}

const stormGlassResourceConfig: IConfig = config.get('App.resources.StormGlass')

export class StormGlass {
  readonly stormGlassAPISource = 'noaa';
  readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';

  constructor(protected request = new HTTPUtil.Request()) { }

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
    return !!(
      point.time &&
      point.swellDirection?.[this.stormGlassAPISource] &&
      point.swellHeight?.[this.stormGlassAPISource] &&
      point.swellPeriod?.[this.stormGlassAPISource] &&
      point.waveDirection?.[this.stormGlassAPISource] &&
      point.waveHeight?.[this.stormGlassAPISource] &&
      point.windDirection?.[this.stormGlassAPISource] &&
      point.windSpeed?.[this.stormGlassAPISource]
    )
  }

  public async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]> {
    try {
      const url =
        `${stormGlassResourceConfig.get('apiUrl')}/weather/point?lat=${lat}&lng=${lng}&params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}`
      const headers = { Authorization: stormGlassResourceConfig.get('apiToken') as string }
      const response = await this.request.get<StormGlassForecastResponse>(url, { headers })

      return this.normalizedResponse(response.data)
    } catch (err) {
      if (err instanceof Error && HTTPUtil.Request.isRequestError(err)) {
        const error = HTTPUtil.Request.extractErrorData(err)
        throw new StormGlassResponseError(
          `Erro: ${JSON.stringify(error.data)} Code: ${error.status}`
        )
      }
      throw new ClientRequestError(JSON.stringify(err))
    }
  }
}
