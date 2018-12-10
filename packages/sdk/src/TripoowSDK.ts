import { RequestHandler, CityResult } from '@tripoow/interfaces';

export interface RequestCityOptions {}

export interface ResponseBase<T> {
  error: boolean;
  message: string;
  results: T;
  status: number;
}

export class TripoowSDK {
  private baseUrl: string;

  constructor(protected request: RequestHandler) {
    this.baseUrl = 'https://api.tripoow.com/';
  }

  public getCities(options?: RequestCityOptions | undefined): Promise<CityResult[]> {
    return this.request
      .get<ResponseBase<CityResult[]>>(this.baseUrl + 'cities', {
        headers: {
          'User-Agent': 'Request-Promise'
        }
      })
      .then((response: ResponseBase<CityResult[]>) => {
        if (response.status >= 300) {
          throw new Error();
        }
        return response.results;
      });
  }

  public get<RequestOptions, ResponseResults>(
    url: string,
    options?: RequestOptions | undefined
  ): Promise<ResponseResults> {
    return this.request
      .get<ResponseBase<ResponseResults>>(this.baseUrl + url, options)
      .then((response) => {
        if (response.status >= 300) {
          throw new Error();
        }
        return response.results;
      });
  }

  public post<RequestOptions, ResponseBody>(
    url: string,
    options?: RequestOptions | undefined
  ): Promise<ResponseBody> {
    return this.request
      .post<ResponseBase<ResponseBody>>(this.baseUrl + url, options)
      .then((response) => {
        if (response.status >= 300) {
          throw new Error();
        }
        return response.results;
      });
  }
}
