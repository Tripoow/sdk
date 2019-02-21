import { WebRequest } from '../src/index';
import { Headers, HttpError } from '@tripoow/interfaces';

interface WArticle {
  id: number;
  linK: string;
  date: string;
  author: number;
}

describe('WebRequest', () => {
  it('works?', () => {
    const web: WebRequest = new WebRequest();
    expect(web).toBeTruthy();
  });

  it('malissimo', () => {
    const web: WebRequest = new WebRequest();

    web
      .get('http://api.tripoow.com/', {
        headers: new Headers([['User-Agent', 'Request-Promise']])
      })
      .then((response) => {
        if (typeof response === 'string') {
          response = JSON.parse(response);
        }
        /* if (response.status === 200) {
          console.log('body:' + JSON.stringify(response.results));
        } else {
          console.log(response);
        } */
        expect(response).toBeTruthy();
      })
      .catch((error) => {
        expect(error).toBeTruthy();
      });

    web
      .get('http://api.tripoow.com/bookings', {
        headers: new Headers([['User-Agent', 'Request-Promise']])
      })
      .then((response) => {
        expect(response).toBeTruthy();
      })
      .catch((error) => {
        expect(error).toBeInstanceOf(HttpError);
      });
  });

  it('tripoow blog', () => {
    const web: WebRequest = new WebRequest();
    web
      .get<WArticle[]>('https://tripoow.com/wp-json/wp/v2/posts', {
        headers: new Headers([['User-Agent', 'Request-Promise']])
      })
      .then((response) => {
        expect(response).toBeTruthy();
      })
      .catch(() => {
        expect(true).toBe(false);
      });
  });
});
