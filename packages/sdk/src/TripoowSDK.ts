import {
  RequestHandler,
  Headers,
  RequestBaseData,
  Filters,
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

  public async getDestinations(options: Filters.Destination): Promise<ResponseResults.Destination[]> {
    const request: R = new this.builderRequest(this.defaultHeaders);
    const response = await request.get<ResponseBase<ResponseResults.Destination[]>>(
      this.baseUrl + 'destinations', {
        data: {
          destinations: {
            originCode: options.originCode,
            budget: options.budget
          }
        }
      }
    );
    if (response.status >= 300) {
      throw new Error();
    }
    return response.results;
  }

  public async getDates(options: Filters.Dates): Promise<ResponseResults.DatesOverview> {
    const request: R = new this.builderRequest(this.defaultHeaders);
    const response = await request.get<ResponseBase<ResponseResults.DatesOverview>>(
      this.baseUrl + 'destinations/' + options.destinationCode + '/dates', {
        data: {
          destinations: {
            originCode: options.originCode,
            budget: options.budget,
            hasHotels: options.hasHotels
          }
        }
      }
    );
    if (response.status >= 300) {
      throw new Error();
    }
    return response.results;
  }

  public async getOrigins(options?: Filters.Origin): Promise<ResponseResults.Origin[]> {
    const refactorData: (options?: Filters.Origin) => RequestBaseData | undefined = (
      options?: Filters.Origin
    ): RequestBaseData | undefined => {
      if (options) {
        if (options.suggest) {
          return {
            limit: 10,
            page: 0,
            filter_groups: [
              {
                filters: [
                  {
                    key: 'place',
                    operator: 'ct',
                    value: options.suggest
                  }
                ]
              }
            ]
          };
        }
        if (options.pos) {
          return {
            limit: 10,
            page: 0,
            filter_groups: [
              {
                filters: [
                  {
                    key: 'lat',
                    operator: 'eq',
                    value: options.pos.lat
                  },
                  {
                    key: 'lon',
                    operator: 'eq',
                    value: options.pos.lon
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
    const originsData = refactorData(options);
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


  public async getPacksOverview(options: Filters.PackOverview): Promise<ResponseResults.PackOverview> {
    const request: R = new this.builderRequest(this.defaultHeaders);
    const response = await request.get<ResponseBase<ResponseResults.PackOverview>>(
      this.baseUrl + '/packs/overview', {
        data: {
          packs: {
            budget: options.budget,
            outwardDate: options.outwardDate,
            returnDate: options.returnDate,
            travelers: {
              adults: options.travelers.adults
            },
            itineraries: [
              {
                origin: {
                  code: options.originCode,
                  departureDate: options.outwardDate,
                },
                destination: {
                  code: options.destinationCode,
                }
              },
              {
                origin: {
                  code: options.destinationCode
                },
                destination: {
                  code: options.originCode,
                  arrivalDate: options.returnDate
                }
              }
            ],
            routes: {
              carriersCode: [],
              durationMax: 0,
              segmentsMax: -1,
              stopoverDurationMax: -1,
            },
            accomodations: options.accomodations
          }
        }
      }
    );
    if (response.status >= 300) {
      throw new Error();
    }
    return response.results;
  }

  public async getPacks(options: Filters.Pack): Promise<ResponseResults.Pack[]>
  {
    const request: R = new this.builderRequest(this.defaultHeaders);
    const response = await request.get<ResponseBase<ResponseResults.Pack[]>>(
      this.baseUrl + 'packs', {
        data: {
          packs: {
            budget: options.budget,
            outwardDate: options.outwardDate,
            returnDate: options.returnDate,
            travelers: {
              adults: options.travelers.adults
            },
            itineraries: [
              {
                origin: {
                  code: options.originCode,
                  departureDate: options.outwardDate,
                },
                destination: {
                  code: options.destinationCode,
                }
              },
              {
                origin: {
                  code: options.destinationCode
                },
                destination: {
                  code: options.originCode,
                  arrivalDate: options.returnDate
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
    options?: RequestOptions
  ): Promise<ResponseResults> {
    const request: R = new this.builderRequest(this.defaultHeaders);
    const response = await request.get<ResponseBase<ResponseResults>>(this.baseUrl + url, options);
    if (response.status >= 300) {
      throw new Error();
    }
    return response.results;
  }

  public async post<RequestOptions, ResponseResults>(
    url: string,
    options?: RequestOptions
  ): Promise<ResponseResults> {
    const request: R = new this.builderRequest(this.defaultHeaders);
    const response = await request.post<ResponseBase<ResponseResults>>(this.baseUrl + url, options);
    if (response.status >= 300) {
      throw new Error();
    }
    return response.results;
  }
}
