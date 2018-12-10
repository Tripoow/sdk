import * as request_ from 'request-promise-native';
import { RequestHandler } from '@tripoow/interfaces';
import { CoreOptions } from 'request';

const request = request_;

export type RequestOptions = CoreOptions;
export type RequestOptionsWithUrl = request_.OptionsWithUrl;

export interface IncomingMessage {
  body: string;
  complete: boolean;
  headers: any;
  statusCode: number;
  statusMessage: string;
}

export interface StatusCodeError {
  error: string;
  message: string;
  name: string;
  response: IncomingMessage;
  options: any;
  stack: string;
  statusCode: number;
}

export class WebRequest implements RequestHandler {
  private refactorOptions(
    method: string,
    url: string,
    options?: RequestOptions
  ): RequestOptionsWithUrl {
    const optionsWithUrl: RequestOptionsWithUrl =
      options === undefined
        ? ({ url: url } as RequestOptionsWithUrl)
        : (options as RequestOptionsWithUrl);
    if (!optionsWithUrl.url) {
      optionsWithUrl.url = url;
    }
    optionsWithUrl.method = method;
    return optionsWithUrl;
  }

  public async handle<T = any>(options: RequestOptionsWithUrl): Promise<T> {
    if (options.json === undefined) {
      options.json = true;
    }
    try {
      return await request(options);
    } catch (error) {
      return error;
    }
  }

  public async get<T = any>(url: string, options?: RequestOptions | undefined): Promise<T> {
    return this.handle<T>(this.refactorOptions('get', url, options));
  }

  public async post<T = any>(url: string, options?: RequestOptions | undefined): Promise<T> {
    return this.handle<T>(this.refactorOptions('post', url, options));
  }

  public async put<T = any>(url: string, options?: RequestOptions | undefined): Promise<T> {
    return this.handle<T>(this.refactorOptions('post', url, options));
  }

  public async patch<T = any>(url: string, options?: RequestOptions | undefined): Promise<T> {
    return this.handle<T>(this.refactorOptions('post', url, options));
  }

  public async delete<T = any>(url: string, options?: RequestOptions | undefined): Promise<T> {
    return this.handle<T>(this.refactorOptions('post', url, options));
  }
}
