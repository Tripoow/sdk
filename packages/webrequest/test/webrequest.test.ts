import { WebRequest } from '../src/index';
import { Headers } from '@tripoow/interfaces';

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
        headers: new Headers([
          [ 'User-Agent', 'Request-Promise' ]
        ])
      })
      .then(response => {
        if (typeof response === 'string') {
          response = JSON.parse(response);
        }
        if (response.status === 200) {
          console.log('body:' + JSON.stringify(response.results));
        } else {
          console.log(response);
        }
        expect(response).toBeTruthy();
      })
      .catch(error => {
        console.log(error);
        expect(error).toBeTruthy();
      });
  });

  it('tripoow blog', () => {
    const web: WebRequest = new WebRequest();
    web.get<any>('https://tripoow.com/wp-json/wp/v2/posts', {
      headers: new Headers([
        [ 'User-Agent', 'Request-Promise']
      ])
    })
    .then((response) => {
      expect(response).toBeTruthy();
    })
    .catch(() => {
      expect(true).toBe(false);
    });
  });
});
