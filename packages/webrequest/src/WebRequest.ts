import { RequestHandler, Data, RequestCore, HttpError } from '@tripoow/interfaces';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export class WebRequest extends RequestHandler {

  public async handle<T = any, D extends Data = Data>(requestCore: RequestCore<D>): Promise<T> {
    const r: AxiosRequestConfig = {
      url: requestCore.url,
      method: requestCore.method,
      data: requestCore.body,
      headers: (!requestCore.headers) ? {} : requestCore.headers.toObject(),
      responseType: 'json'
    };

    try {
      const response: AxiosResponse<T> = await axios.request<T>(r);
      return response.data;
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new HttpError<T>({
          results: error.response.data,
          status: error.response.status,
          url: error.config.url
        });
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        // console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        // console.log('Error', error.message);
      }
      console.log(error.config);
      throw error;
    }
  }
}
