import { TripoowSDK, ResponseSDKBase } from '../src/index';
import { WebRequest } from '@tripoow/webrequest';
import { ResponseResults, RequestStream } from '@tripoow/interfaces';

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

    const responseBookings: ResponseSDKBase<ResponseResults.Bookings> = await test.getBookings();
    // console.log('BOOKINGS', responseBookings.results.expired[0]);

    const budget: number = 500;
    const travelerAdults: number = 2;
    const suggest: string = 'cata';
    const hasHotels: boolean = true;

    const streamOrigin: RequestStream<ResponseResults.Origin, ResponseSDKBase<ResponseResults.Origin[]>> = test.streamOrigins({suggest: suggest});
    const origins: ResponseResults.Origin[] = await streamOrigin.next();
    expect(origins[0]).toBeTruthy();
    // console.log('ORIGINS', origins[0]);

    const streamDestinations: RequestStream<ResponseResults.Destination, ResponseSDKBase<ResponseResults.Destination[]>> = test.streamDestinations({
      budget: budget,
      originCode: origins[0].code,
      hasHotels: hasHotels
    });
    const destinations: ResponseResults.Destination[] = await streamDestinations.next();
    expect(destinations[0]).toBeTruthy();
    // console.log('DESTINATIONS', destinations[0]);

    const wiki: ResponseResults.DestinationWiki = await test.getDestinationWiki(destinations[0].code);
    // console.log('WIKI', wiki);
    const tags: ResponseResults.DestinationTag[] = await test.getDestinationTags(destinations[0].code);
    // console.log('TAGS', tags);
    const images: ResponseResults.DestinationImage[] = await test.getDestinationImages(destinations[0].code);
    // console.log('IMAGES', images);

    const streamDates: RequestStream<ResponseResults.Dates, ResponseSDKBase<ResponseResults.Dates[]>> = test.streamDates({
      budget: budget,
      type: 'weeks',
      originCode: origins[0].code,
      destinationCode: destinations[0].code,
      hasHotels: hasHotels
    });
    const dates: ResponseResults.Dates[] = await streamDates.next();
    expect(dates[0]).toBeTruthy();
    const date: ResponseResults.Dates = dates[0];
    // console.log('DATES', date);

    const packsOverview: ResponseSDKBase<ResponseResults.PackOverview> = await test.getPacksOverview({
      budget: budget,
      outwardDate: date.outward,
      returnDate: date.return,
      travelers: {
        adults: travelerAdults
      },
      itineraries: [
        {
          origin: {
            code: origins[0].code,
          },
          destination: {
            code: destinations[0].code
          }
        },
        {
          origin: {
            code: destinations[0].code
          },
          destination: {
            code: origins[0].code
          }
        }
      ],
      guests: [
        {
          adults: travelerAdults
        }
      ]
    });
    expect(packsOverview.results.cheapest).toBeTruthy();
    // console.log('PACKOVERVIEW', packsOverview.results.cheapest);

    const streamPacks: RequestStream<ResponseResults.Pack, ResponseSDKBase<ResponseResults.Pack[]>> = test.streamPacks({
      budget: budget,
      outwardDate: date.outward,
      returnDate: date.return,
      itineraries: [
        {
          origin: {
            code: origins[0].code,
          },
          destination: {
            code: destinations[0].code
          }
        },
        {
          origin: {
            code: destinations[0].code
          },
          destination: {
            code: origins[0].code
          }
        }
      ],
      travelers: {
        adults: travelerAdults
      }
    });
    const packs: ResponseResults.Pack[] = await streamPacks.next();
    expect(packs).toBeTruthy();
    // console.log('PACKS', packs[0]);

    const streamAccomodations: RequestStream<ResponseResults.Accomodation, ResponseSDKBase<ResponseResults.Accomodation[]>> = test.streamAccomodations({
      priceNightMax: budget,
      destinationCode: destinations[0].code,
      checkin: date.outward,
      checkout: date.return,
      guests: [
        {
          adults: travelerAdults
        }
      ]
    });
    const accomodations: ResponseResults.Accomodation[] = await streamAccomodations.next();
    expect(accomodations).toBeTruthy();
    // console.log('ACCOMODATIONS', accomodations[0]);

    const responsePackCheck: ResponseSDKBase<ResponseResults.PackCheck> = await test.getPackCheck(packs[0].token);
    // console.log('PACKCHECK', responsePackCheck.results);
  });
});
