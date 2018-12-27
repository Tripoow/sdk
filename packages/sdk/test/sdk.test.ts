import { TripoowSDK } from '../src/index';
import { WebRequest } from '@tripoow/webrequest';
import { ResponseResults } from '@tripoow/interfaces';

describe('Tripoow SDK test', () => {
  beforeEach(() => {
    jest.setTimeout(100000);
  });

  it('works if true is truthy', () => {
    expect(true).toBeTruthy();
  });

  it('TripoowSDK is instantiable', () => {
    expect(new TripoowSDK<WebRequest>(WebRequest)).toBeInstanceOf(TripoowSDK);
  });

  it('TripoowSDK test request', async () => {
    const test = new TripoowSDK<WebRequest>(WebRequest, 'development');

    const auth: ResponseResults.Authorization = await test.getBearer('bloren93@gmail.com', 'laurabartolone2');
    expect(auth.bearer).toBeTruthy();
    /* HEADERS */
    test.setAuthorization(auth.bearer);
    test.setLocale('it');

    const budget: number = 500;
    const travelerAdults: number = 2;
    const suggest: string = 'cata';
    const hasHotels: boolean = true;

    const origins: ResponseResults.Origin[] = await test.getOrigins({suggest: suggest});
    expect(origins[0]).toBeTruthy();
    console.log(origins[0]);

    const destinations: ResponseResults.Destination[] = await test.getDestinations({
      budget: budget,
      originCode: origins[0].code,
      hasHotels: hasHotels
    });
    expect(destinations[0]).toBeTruthy();
    console.log(destinations[0]);

    const dates: ResponseResults.DatesOverview = await test.getDates({
      budget: budget,
      originCode: origins[0].code,
      destinationCode: destinations[0].code,
      hasHotels: hasHotels
    });
    expect(dates.weekends).toBeTruthy();
    console.log(dates.weekends[0]);

    const packsOverview: ResponseResults.PackOverview = await test.getPacksOverview({
      budget: budget,
      originCode: origins[0].code,
      destinationCode: destinations[0].code,
      outwardDate: dates.weekends[0].outward,
      returnDate: dates.weekends[0].return,
      travelers: {
        adults: travelerAdults
      },
      accomodations: {
        guests: [
          {
            adults: travelerAdults
          }
        ]
      }
    });
    expect(packsOverview.cheapest).toBeTruthy();
    console.log(packsOverview.cheapest);

    const packs: ResponseResults.Pack[] = await test.getPacks({
      budget: budget,
      originCode: origins[0].code,
      destinationCode: destinations[0].code,
      outwardDate: dates.weekends[0].outward,
      returnDate: dates.weekends[0].return,
      travelers: {
        adults: travelerAdults
      }
    });
    expect(packs).toBeTruthy();
    console.log(packs[0]);

    const accomodations: ResponseResults.Accomodation[] = await test.getAccomodations({
      priceNightMax: budget,
      destinationCode: destinations[0].code,
      checkin: dates.weekends[0].outward,
      checkout: dates.weekends[0].return,
      guests: [
        {
          adults: 2
        }
      ]
    });
    expect(accomodations).toBeTruthy();
    console.log(accomodations[0]);
  });
});
