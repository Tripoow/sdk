import { Headers } from './Headers';

export type Data = {
  limit?: number;
  page?: number;
  [key: string]: any
};

export type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface RequestOptions<D extends Data = Data> {
  headers?: Headers;
  data?: D
}

export interface RequestCore<D extends Data = Data> {
    url: string;
    method: Method;
    headers?: Headers;
    body?: D;
}

export interface ResponseBase<T> {
  status: number;
  results: T;
  [key: string]: any;
}

export class HttpError<T = any> extends Error {
  constructor(public response: ResponseBase<T>) {
    super(`${response.status} for ${response.url}`);
    this.name = 'HttpError';
  }
}

export abstract class RequestHandler {

  constructor(
    protected defaultHeaders?: Headers
  ) {
  }

  public static serialize(obj: Data, prefix?: any): string {
    const str: string[] = [];
    let p: string;
    for (p in obj) {
      if (obj.hasOwnProperty(p)) {
        const k: string = prefix
          ? prefix + '[' + p + ']'
          : p;
        const v: object | string | number | null | undefined = obj[p];
        if (typeof obj[p] !== 'undefined' && !isNaN(obj[p])) {
          const value: string = (v !== null && typeof v === 'object')
            ? RequestHandler.serialize(v, k)
            : encodeURIComponent(k) + '=' + encodeURIComponent(v as string);
          if (value) {
            str.push(value);
          }
        }
      }
    }
    return str.join('&');
  }

  protected buildRequest<D extends Data = Data>(method: Method, url: string, options?: RequestOptions<D>): RequestCore<D> {
    const request: RequestCore<D> = {
      method: method,
      url: url,
    };

    if (this.defaultHeaders) {
      request.headers = this.defaultHeaders;
    }

    if (options) {

      if (options.headers) {
        if (request.headers) {
          request.headers = request.headers.merge(options.headers);
        } else {
          request.headers = options.headers;
        }
      }

      if (options.data) {
        if (method === 'get' || method === 'delete') {
          request.url += '?' + RequestHandler.serialize(options.data);
        } else {
          request.body = options.data;
        }
      }
    }

    return request;
  }

  public abstract async handle<T extends ResponseBase<any> = ResponseBase<any>, D extends Data = Data>(requestCore: RequestCore<D>): Promise<T>;

  public createStream<Results = any, Response extends ResponseBase<Results[]> = ResponseBase<Results[]>>(url: string, options: RequestOptions<any>): RequestStream<Results, Response> {
    return new RequestStream<Results, Response>(this, url, options);
  }

  public async get<T extends ResponseBase<any> = ResponseBase<any>, D extends Data = Data>(url: string, options?: RequestOptions<D>): Promise<T> {
    return this.handle<T, D>(this.buildRequest<D>('get', url, options));
  }

  public async post<T extends ResponseBase<any> = ResponseBase<any>, D extends Data = Data>(url: string, options?: RequestOptions<D>): Promise<T> {
    return this.handle<T, D>(this.buildRequest<D>('post', url, options));
  }

  public async put<T extends ResponseBase<any> = ResponseBase<any>, D extends Data = Data>(url: string, options?: RequestOptions<D>): Promise<T> {
    return this.handle<T, D>(this.buildRequest<D>('put', url, options));
  }

  public async patch<T extends ResponseBase<any> = ResponseBase<any>, D extends Data = Data>(url: string, options?: RequestOptions<D>): Promise<T> {
    return this.handle<T, D>(this.buildRequest<D>('patch', url, options));
  }

  public async delete<T extends ResponseBase<any> = ResponseBase<any>, D extends Data = Data>(url: string, options?: RequestOptions<D>): Promise<T> {
    return this.handle<T, D>(this.buildRequest<D>('delete', url, options));
  }
}

export class RequestStream<T = any, Response extends ResponseBase<T[]> = ResponseBase<T[]>>
{
  protected status: 'ready' | 'pending' | 'complete' | 'firstTime';
  protected _response: Response | undefined;

  constructor(
    protected request: RequestHandler,
    protected url: string,
    protected options: RequestOptions<any>
  ) {
    this.status = 'firstTime';
  }

  public async next(): Promise<T[]> {

    if (this.status === 'complete') {
      return [] as T[];
    }

    if (this.status === 'pending') {
      throw new Error();
    }

    if (this.status === 'ready') {
      try {
        this.options.data.page += 1;
      } catch(Error) {
        throw new Error();
      }
    }

    this.status = 'pending';
    const response = await this.request.get<Response>(this.url, this.options);
    this._response = response;
    if (response.results.length === 0) {
      this.status = 'complete';
    } else {
      this.status = 'ready';
    }

    return response.results;
  }

  public response(): Response | undefined {
    return this._response;
  }
}
