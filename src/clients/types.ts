export interface StormGlassPointSource {
  [key: string]: number
}
export interface StormGlassPoint {
  readonly time: string,
  readonly swellDirection: StormGlassPointSource,
  readonly swellHeight: StormGlassPointSource,
  readonly swellPeriod: StormGlassPointSource,
  readonly waveDirection: StormGlassPointSource,
  readonly waveHeight: StormGlassPointSource,
  readonly windDirection: StormGlassPointSource,
  readonly windSpeed: StormGlassPointSource
}
export interface StormGlassForecastResponse {
  hours: StormGlassPoint[]
}

export interface ForecastPoint {
  time: string,
  swellDirection: number,
  swellHeight: number,
  swellPeriod: number,
  waveDirection: number,
  waveHeight: number,
  windDirection: number,
  windSpeed: number
}