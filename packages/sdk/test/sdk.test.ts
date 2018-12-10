import { TripoowSDK } from '../src/index';
import { WebRequest } from '@tripoow/webrequest';

describe('Tripoow SDK test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy();
  });

  it('TripoowSDK is instantiable', () => {
    expect(new TripoowSDK(new WebRequest())).toBeInstanceOf(TripoowSDK);
  });

  it('TripoowSDK test request', () => {
    const test = new TripoowSDK(new WebRequest());
    test
      .getCities()
      .then((cities) => {
        expect(cities).toBeTruthy();
      })
      .catch((error) => {
        console.log(error);
        expect(error).toBeTruthy();
      });
  });
});
