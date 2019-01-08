import {
  RequestHandler,
  Headers,
  RequestFilters,
  ResponseResults,
  Data,
  RequestStream,
} from '@tripoow/interfaces';

export interface ResponseSDKBase<T> {
  error: boolean;
  message: string;
  results: T;
  status: number;
  metaQuery?: {[key: string]: any};
}

export type Environment = 'production' | 'stage' | 'development';

export interface RequestBaseData extends Data {
  filter_groups?: {
    or?: boolean;
    filters: {
      key: string;
      value: string;
      operator: string;
    }[];
  }[];
}

export class TripoowSDK<R extends RequestHandler> {
  private baseUrl: string;
  private defaultHeaders: Headers;
  private defaultLimit = 20;

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
    const response = await request.post<ResponseSDKBase<ResponseResults.AuthLogin>>(this.baseUrl + 'auth/login', {
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

  public setLimit(limit: number): void {
    if (limit <= 200 && limit >= 1) {
      this.defaultLimit = limit;
    }
  }

  public streamOrigins(filters?: RequestFilters.Origin): RequestStream<ResponseResults.Origin, ResponseSDKBase<ResponseResults.Origin[]>> {
    const refactorData: (filters?: RequestFilters.Origin) => RequestBaseData | undefined = (
      filters?: RequestFilters.Origin
    ): RequestBaseData | undefined => {
      if (filters) {
        if (filters.suggest) {
          return {
            limit: this.defaultLimit,
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
            limit: this.defaultLimit,
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
        limit: this.defaultLimit,
        page: 0
      };
    };
    const originsData = refactorData(filters);
    const request: R = new this.builderRequest(this.defaultHeaders);
    return request.createStream<ResponseResults.Origin, ResponseSDKBase<ResponseResults.Origin[]>>(
      this.baseUrl + 'cities_beepry', {
        data: originsData
      }
    );
  }

  public streamDestinations(filters: RequestFilters.Destination): RequestStream<ResponseResults.Destination, ResponseSDKBase<ResponseResults.Destination[]>> {
    const request: R = new this.builderRequest(this.defaultHeaders);
    return request.createStream<ResponseResults.Destination, ResponseSDKBase<ResponseResults.Destination[]>>(
      this.baseUrl + 'destinations', {
        data: {
          limit: this.defaultLimit,
          page: 0,
          destinations: {
            originCode: filters.originCode,
            budget: filters.budget
          }
        }
      }
    );
  }

  public streamDates(filters: RequestFilters.Dates): RequestStream<ResponseResults.Dates, ResponseSDKBase<ResponseResults.Dates[]>> {
    const request: R = new this.builderRequest(this.defaultHeaders);
    return request.createStream<ResponseResults.Dates, ResponseSDKBase<ResponseResults.Dates[]>>(
      this.baseUrl + 'destinations/' + filters.destinationCode + '/dates', {
        data: {
          limit: this.defaultLimit,
          page: 0,
          destinations: {
            originCode: filters.originCode,
            type: filters.type,
            budget: filters.budget,
            hasHotels: filters.hasHotels
          }
        }
      }
    );
  }

  public async getDatesOverview(filters: RequestFilters.Dates): Promise<ResponseSDKBase<ResponseResults.DatesOverview>> {
    const request: R = new this.builderRequest(this.defaultHeaders);
    const response = await request.post<ResponseSDKBase<ResponseResults.DatesOverview>>(
      this.baseUrl + 'destinations/' + filters.destinationCode + '/dates', {
        data: {
          limit: this.defaultLimit,
          page: 0,
          destinations: {
            originCode: filters.originCode,
            budget: filters.budget,
            hasHotels: filters.hasHotels
          }
        }
      }
    );
    return response;
  }

  public async getPacksOverview(filters: RequestFilters.PackOverview): Promise<ResponseSDKBase<ResponseResults.PackOverview>> {
    const request: R = new this.builderRequest(this.defaultHeaders);
    const response = await request.get<ResponseSDKBase<ResponseResults.PackOverview>>(
      this.baseUrl + 'packs/overview', {
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
    return response;
  }

  public streamPacks(filters: RequestFilters.Pack): RequestStream<ResponseResults.Pack, ResponseSDKBase<ResponseResults.Pack[]>> {
    const request: R = new this.builderRequest(this.defaultHeaders);
    return request.createStream<ResponseResults.Pack, ResponseSDKBase<ResponseResults.Pack[]>>(
      this.baseUrl + 'packs', {
        data: {
          limit: this.defaultLimit,
          page: 0,
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
  }

  public async getPackCheck(packToken: string): Promise<ResponseSDKBase<ResponseResults.PackCheck>> {
    const request: R = new this.builderRequest(this.defaultHeaders);
    const response = await request.post<ResponseSDKBase<ResponseResults.PackCheck>>(
      this.baseUrl + 'packs/check', {
        data: {
          check: {
            packToken: packToken
          }
        }
      }
    );
    return response;
  }

  public streamAccomodations(filters: RequestFilters.Accomodation): RequestStream<ResponseResults.Accomodation, ResponseSDKBase<ResponseResults.Accomodation[]>> {
    const request: R = new this.builderRequest(this.defaultHeaders);
    return request.createStream<ResponseResults.Accomodation, ResponseSDKBase<ResponseResults.Accomodation[]>>(
      this.baseUrl + 'accomodations', {
        data: {
          limit: this.defaultLimit,
          page: 0,
          accomodations: {
            checkin: filters.checkin,
            checkout: filters.checkout,
            destinationCode: filters.destinationCode,
            guests: filters.guests,
            priceNightMin: filters.priceNightMin,
            priceNightMax: filters.priceNightMax,
            ratingMin: filters.ratingMin,
            stars: filters.stars,
            metersFromCenterMin: filters.metersFromCenterMin,
            metersFromCenterMax: filters.metersFromCenterMax,
            facilities: filters.facilities,
          }
        }
      }
    );
  }

  public async getBookings(): Promise<ResponseSDKBase<ResponseResults.Bookings>> {
    const request: R = new this.builderRequest(this.defaultHeaders);
    const response = await request.get(this.baseUrl + 'bookings');
    return response;
  }

  public async get<Filters, Results>(
    url: string,
    filters?: Filters
  ): Promise<ResponseSDKBase<Results>> {
    const request: R = new this.builderRequest(this.defaultHeaders);
    const response = await request.get<ResponseSDKBase<Results>>(this.baseUrl + url, filters);
    if (response.status >= 300) {
      throw new Error();
    }
    return response;
  }

  public async post<Filters, Results>(
    url: string,
    filters?: Filters
  ): Promise<ResponseSDKBase<Results>> {
    const request: R = new this.builderRequest(this.defaultHeaders);
    const response = await request.post<ResponseSDKBase<Results>>(this.baseUrl + url, filters);
    if (response.status >= 300) {
      throw new Error();
    }
    return response;
  }
}
