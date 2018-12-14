import { RequestHandler, OriginResult, OriginOptions, Headers, RequestBaseData } from '@tripoow/interfaces';

export interface ResponseBase<T> {
  error: boolean;
  message: string;
  results: T;
  status: number;
}

export interface BearerResult {
  bearer: string;
  expiresIn: number;
}

export interface LoginResult {
  access_token: string;
  expires_in: number;
  user_id: number;
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
    this.defaultHeaders = new Headers();
  }

  public async authenticate(apiKey: string, apiSecret: string): Promise<boolean>;
  public async authenticate(user: string, password: string): Promise<boolean> {
    const bearerResult: BearerResult = await this.getBearer(user, password);
    this.setBearer(bearerResult.bearer);
    return true;
  }

  public async getBearer(user: string, password: string): Promise<BearerResult> {
    const request: RequestHandler = new this.builderRequest();
    const response = await request
      .post<ResponseBase<LoginResult>>(this.baseUrl + 'auth/login', {
        headers: new Headers([
          [ 'User-Agent', 'Request-Promise' ]
        ]),
        data: {
          'email': user,
          'password': password
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

  public setBearer(bearer: string): void
  {
    this.defaultHeaders.set('Authorization', 'Bearer '+bearer);
  }

  public async getOrigins(options?: OriginOptions): Promise<OriginResult[]> {
    const refactorData: (options?: OriginOptions) => RequestBaseData | undefined = (options?: OriginOptions): RequestBaseData | undefined => {
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
    const request: RequestHandler = new this.builderRequest(this.defaultHeaders);
    const response = await request
      .get<ResponseBase<OriginResult[]>>(this.baseUrl + 'cities_beepry', {
        headers: new Headers([
          [ 'User-Agent', 'Request-Promise' ]
        ]),
        data: originsData
      });
    if (response.status >= 300) {
      throw new Error();
    }
    return response.results;
  }

  public async get<RequestOptions, ResponseResults>(url: string, options?: RequestOptions): Promise<ResponseResults> {
    const request: RequestHandler = new this.builderRequest(this.defaultHeaders);
    const response = await request
      .get<ResponseBase<ResponseResults>>(this.baseUrl + url, options);
    if (response.status >= 300) {
      throw new Error();
    }
    return response.results;
  }

  public async post<RequestOptions, ResponseBody>(url: string, options?: RequestOptions): Promise<ResponseBody> {
    const request: RequestHandler = new this.builderRequest(this.defaultHeaders);
    const response = await request
      .post<ResponseBase<ResponseBody>>(this.baseUrl + url, options);
    if (response.status >= 300) {
      throw new Error();
    }
    return response.results;
  }
}
