import { Headers } from './Headers';

export type Data = { [key: string]: any };
export type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface RequestBaseData {
  page: number;
  limit: number;
  filter_groups?: {
    or?: boolean;
    filters: {
      key: string;
      value: string;
      operator: string;
    }[];
  }[];
}

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
        const v: object | string | null | undefined = obj[p];
        if (typeof obj[p] !== 'undefined') {
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

  public abstract async handle<T = any, D extends Data = Data>(request: RequestCore<D>): Promise<T>;

  public async get<T = any, D extends Data = Data>(url: string, options?: RequestOptions<D>): Promise<T> {
    return this.handle<T, D>(this.buildRequest<D>('get', url, options));
  }

  public async post<T = any, D extends Data = Data>(url: string, options?: RequestOptions<D>): Promise<T> {
    return this.handle<T, D>(this.buildRequest<D>('post', url, options));
  }

  public async put<T = any, D extends Data = Data>(url: string, options?: RequestOptions<D>): Promise<T> {
    return this.handle<T, D>(this.buildRequest<D>('put', url, options));
  }

  public async patch<T = any, D extends Data = Data>(url: string, options?: RequestOptions<D>): Promise<T> {
    return this.handle<T, D>(this.buildRequest<D>('patch', url, options));
  }

  public async delete<T = any, D extends Data = Data>(url: string, options?: RequestOptions<D>): Promise<T> {
    return this.handle<T, D>(this.buildRequest<D>('delete', url, options));
  }
}
