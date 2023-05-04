import { AxiosStatic } from "axios";

export class StormGlass {
  readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassAPISource = 'noaa';

  constructor(protected request: AxiosStatic) { }

  public async fetchPoints(lat: number, lng: number): Promise<object> {
    const url = `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}`
    
    return this.request.get(url)
  }
}