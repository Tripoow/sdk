import * as request_ from 'request-promise-native';
import { RequestHandler, Data, RequestCore, RequestStream, ResponseBase, HttpError } from '@tripoow/interfaces';
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

export class WebRequest extends RequestHandler {

  public async handle<T extends ResponseBase<any> = ResponseBase<any>, D extends Data = Data>(requestCore: RequestCore<D>): Promise<T> {
    const r: RequestOptionsWithUrl = {
      url: requestCore.url,
      method: requestCore.method,
      body: requestCore.body,
      headers: (!requestCore.headers) ? {} : requestCore.headers.toObject(),
      json: true
    };

    try {
      const response: T = await request(r);
      if (response.status < 200 || response.status >= 300) {
        throw new HttpError(response);
      }
      return response;
    } catch (error) {
      throw error;
    }
  }
}
