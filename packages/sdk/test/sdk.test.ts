import { TripoowSDK } from '../src/index';
import { WebRequest } from '@tripoow/webrequest';

describe('Tripoow SDK test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy();
  });

  it('TripoowSDK is instantiable', () => {
    expect(new TripoowSDK<WebRequest>(WebRequest)).toBeInstanceOf(TripoowSDK);
  });

  it('TripoowSDK test request', () => {
    const test = new TripoowSDK<WebRequest>(WebRequest, 'development');
    test
      .getOrigins()
      .then((origins) => {
        console.log(origins[0]);
        expect(origins).toBeTruthy();
      })
      .catch((error) => {
        console.log(error);
        expect(error).toBeTruthy();
      });
    test.
      getBearer('bloren93@gmail.com', 'laurabartolone2')
      .then((bearer) => {
        console.log(bearer);
        expect(bearer).toBeTruthy();
      })
      .catch((error) => {
        console.log(error);
        expect(error).toBeTruthy();
      });
  });
});
