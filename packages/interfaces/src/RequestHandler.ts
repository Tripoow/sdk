export interface RequestHandler {
  get<T = any>(uri: string, options?: any | undefined): Promise<T>;
  post<T = any>(uri: string, options?: any | undefined): Promise<T>;
  put<T = any>(uri: string, options?: any | undefined): Promise<T>;
  patch<T = any>(uri: string, options?: any | undefined): Promise<T>;
  delete<T = any>(uri: string, options?: any | undefined): Promise<T>;
}
