import { TripoowSDK } from '../src/index';
import { WebRequest } from '@tripoow/webrequest';
import { OriginResult, DestinationResult, DateResult, DateResults, PackOverviewResult, PackResult } from '@tripoow/interfaces';

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

    const budget: number = 500;
    const travelerAdults: number = 2;
    const suggest: string = 'cata';
    const hasHotels: boolean = true;

    const origins: OriginResult[] = await test.getOrigins({suggest: suggest});
    expect(origins[0]).toBeTruthy();
    console.log(origins[0]);

    const destinations: DestinationResult[] = await test.getDestinations({
      budget: budget,
      originCode: origins[0].code,
      hasHotels: hasHotels
    });
    expect(destinations[0]).toBeTruthy();
    console.log(destinations[0]);

    const dates: DateResults = await test.getDates({
      budget: budget,
      originCode: origins[0].code,
      destinationCode: destinations[0].code,
      hasHotels: hasHotels
    });
    expect(dates.weekends).toBeTruthy();
    console.log(dates.weekends[0]);

    const packsOverview: PackOverviewResult = await test.getPacksOverview({
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

    const packs: PackResult[] = await test.getPacks({
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
