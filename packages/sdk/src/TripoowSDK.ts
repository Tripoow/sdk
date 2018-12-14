import { RequestHandler, OriginResult, RequestOriginOptions, Headers } from '@tripoow/interfaces';

export interface ResponseBase<T> {
  error: boolean;
  message: string;
  results: T;
  status: number;
}

export interface BearerResult {
  bearer: string;
}

export type Environment = 'production' | 'stage' | 'development';

export class TripoowSDK<R extends RequestHandler> {
  private baseUrl: string;

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
      .post<ResponseBase<BearerResult>>(this.baseUrl + 'auth/login', {
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
    return response.results;
  }

  public setBearer(bearer: string): void
  {
    console.log('nop');
  }

  public async getOrigins(options?: RequestOriginOptions | undefined): Promise<OriginResult[]> {
    const request: RequestHandler = new this.builderRequest();
    const response = await request
      .get<ResponseBase<OriginResult[]>>(this.baseUrl + 'cities_beepry', {
        headers: new Headers([
          [ 'User-Agent', 'Request-Promise' ]
        ])
      });
    if (response.status >= 300) {
      throw new Error();
    }
    return response.results;
  }

  public async get<RequestOptions, ResponseResults>(
    url: string,
    options?: RequestOptions | undefined
  ): Promise<ResponseResults> {
    const request: RequestHandler = new this.builderRequest();
    const response = await request
      .get<ResponseBase<ResponseResults>>(this.baseUrl + url, options);
    if (response.status >= 300) {
      throw new Error();
    }
    return response.results;
  }

  public async post<RequestOptions, ResponseBody>(
    url: string,
    options?: RequestOptions | undefined
  ): Promise<ResponseBody> {
    const request: RequestHandler = new this.builderRequest();
    const response = await request
      .post<ResponseBase<ResponseBody>>(this.baseUrl + url, options);
    if (response.status >= 300) {
      throw new Error();
    }
    return response.results;
  }
}
