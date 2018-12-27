import {
  RequestHandler,
  Headers,
  RequestBaseData,
  RequestFilters,
  ResponseResults,
} from '@tripoow/interfaces';

export interface ResponseBase<T> {
  error: boolean;
  message: string;
  results: T;
  status: number;
}

export type Environment = 'production' | 'stage' | 'development';

export class TripoowSDK<R extends RequestHandler> {
  private baseUrl: string;
  private defaultHeaders: Headers;

  constructor(
    protected builderRequest: new (defaultHeaders?: Headers) => R,
    protected env: Environment = 'production'
  ) {
    switch (this.env) {
      case 'development':
        this.baseUrl = 'https://devapi.tripoow.com/';
        break;
      case 'stage':
        this.baseUrl = 'https://stageapi.tripoow.com/';
        break;
      default:
        this.baseUrl = 'https://api.tripoow.com/';
        break;
    }
    this.defaultHeaders = new Headers([['User-Agent', 'Request-Promise']]);
  }

  public async authenticate(apiKey: string, apiSecret: string): Promise<boolean>;
  public async authenticate(user: string, password: string): Promise<boolean> {
    const bearerResult: ResponseResults.Authorization = await this.getBearer(user, password);
    this.setAuthorization(bearerResult.bearer);
    return true;
  }

  public async getBearer(user: string, password: string): Promise<ResponseResults.Authorization> {
    const request: RequestHandler = new this.builderRequest(this.defaultHeaders);
    const response = await request.post<ResponseBase<ResponseResults.AuthLogin>>(this.baseUrl + 'auth/login', {
      data: {
        email: user,
        password: password
      }
    });
    if (response.status >= 300) {
      throw new Error();
    }
    return {
      bearer: response.results.access_token,
      expiresIn: response.results.expires_in
    };
  }

  public setAuthorization(bearer: string): void {
    this.defaultHeaders.set('Authorization', 'Bearer ' + bearer);
  }

  public setLocale(locale: string): void {
    this.defaultHeaders.set('x-locale', locale);
  }

  public async getDestinations(filters: RequestFilters.Destination): Promise<ResponseResults.Destination[]> {
    const request: R = new this.builderRequest(this.defaultHeaders);
    const response = await request.get<ResponseBase<ResponseResults.Destination[]>>(
      this.baseUrl + 'destinations', {
        data: {
          destinations: {
            originCode: filters.originCode,
            budget: filters.budget
          }
        }
      }
    );
    if (response.status >= 300) {
      throw new Error();
    }
    return response.results;
  }

  public async getDates(filters: RequestFilters.Dates): Promise<ResponseResults.DatesOverview> {
    const request: R = new this.builderRequest(this.defaultHeaders);
    const response = await request.get<ResponseBase<ResponseResults.DatesOverview>>(
      this.baseUrl + 'destinations/' + filters.destinationCode + '/dates', {
        data: {
          destinations: {
            originCode: filters.originCode,
            budget: filters.budget,
            hasHotels: filters.hasHotels
          }
        }
      }
    );
    if (response.status >= 300) {
      throw new Error();
    }
    return response.results;
  }

  public async getOrigins(filters?: RequestFilters.Origin): Promise<ResponseResults.Origin[]> {
    const refactorData: (filters?: RequestFilters.Origin) => RequestBaseData | undefined = (
      filters?: RequestFilters.Origin
    ): RequestBaseData | undefined => {
      if (filters) {
        if (filters.suggest) {
          return {
            limit: 10,
            page: 0,
            filter_groups: [
              {
                filters: [
                  {
                    key: 'place',
                    operator: 'ct',
                    value: filters.suggest
                  }
                ]
              }
            ]
          };
        }
        if (filters.pos) {
          return {
            limit: 10,
            page: 0,
            filter_groups: [
              {
                filters: [
                  {
                    key: 'lat',
                    operator: 'eq',
                    value: filters.pos.lat
                  },
                  {
                    key: 'lon',
                    operator: 'eq',
                    value: filters.pos.lon
                  }
                ]
              }
            ]
          };
        }
      }
      return {
        limit: 10,
        page: 0
      };
    };
    const originsData = refactorData(filters);
    const request: R = new this.builderRequest(this.defaultHeaders);
    const response = await request.get<ResponseBase<ResponseResults.Origin[]>>(
      this.baseUrl + 'cities_beepry',
      {
        data: originsData
      }
    );
    if (response.status >= 300) {
      throw new Error();
    }
    return response.results;
  }


  public async getPacksOverview(filters: RequestFilters.PackOverview): Promise<ResponseResults.PackOverview> {
    const request: R = new this.builderRequest(this.defaultHeaders);
    const response = await request.get<ResponseBase<ResponseResults.PackOverview>>(
      this.baseUrl + '/packs/overview', {
        data: {
          packs: {
            budget: filters.budget,
            outwardDate: filters.outwardDate,
            returnDate: filters.returnDate,
            travelers: {
              adults: filters.travelers.adults
            },
            itineraries: [
              {
                origin: {
                  code: filters.originCode,
                  departureDate: filters.outwardDate,
                },
                destination: {
                  code: filters.destinationCode,
                }
              },
              {
                origin: {
                  code: filters.destinationCode
                },
                destination: {
                  code: filters.originCode,
                  arrivalDate: filters.returnDate
                }
              }
            ],
            routes: {
              carriersCode: [],
              durationMax: 0,
              segmentsMax: -1,
              stopoverDurationMax: -1,
            },
            accomodations: filters.accomodations
          }
        }
      }
    );
    if (response.status >= 300) {
      throw new Error();
    }
    return response.results;
  }

  public async getPacks(filters: RequestFilters.Pack): Promise<ResponseResults.Pack[]>
  {
    const request: R = new this.builderRequest(this.defaultHeaders);
    const response = await request.get<ResponseBase<ResponseResults.Pack[]>>(
      this.baseUrl + 'packs', {
        data: {
          packs: {
            budget: filters.budget,
            outwardDate: filters.outwardDate,
            returnDate: filters.returnDate,
            travelers: {
              adults: filters.travelers.adults
            },
            itineraries: [
              {
                origin: {
                  code: filters.originCode,
                  departureDate: filters.outwardDate,
                },
                destination: {
                  code: filters.destinationCode,
                }
              },
              {
                origin: {
                  code: filters.destinationCode
                },
                destination: {
                  code: filters.originCode,
                  arrivalDate: filters.returnDate
                }
              }
            ],
            routes: {
              carriersCode: [],
              durationMax: 0,
              segmentsMax: -1,
              stopoverDurationMax: -1,
            }
          }
        }
      }
    );
    return response.results;
  }

  public async get<RequestOptions, ResponseResults>(
    url: string,
    filters?: RequestOptions
  ): Promise<ResponseResults> {
    const request: R = new this.builderRequest(this.defaultHeaders);
    const response = await request.get<ResponseBase<ResponseResults>>(this.baseUrl + url, filters);
    if (response.status >= 300) {
      throw new Error();
    }
    return response.results;
  }

  public async post<RequestOptions, ResponseResults>(
    url: string,
    filters?: RequestOptions
  ): Promise<ResponseResults> {
    const request: R = new this.builderRequest(this.defaultHeaders);
    const response = await request.post<ResponseBase<ResponseResults>>(this.baseUrl + url, filters);
    if (response.status >= 300) {
      throw new Error();
    }
    return response.results;
  }
}
