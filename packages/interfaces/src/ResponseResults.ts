export namespace ResponseResults {

  export interface AuthLogin {
    access_token: string;
    expires_in: number;
    user_id: number;
  }

  export interface Authorization {
    bearer: string;
    expiresIn: number;
  }

  export interface Tag {
    code: string;
    name_it: string;
    name_en: string;
  }

  export interface Origin {
    id: string;
    name: string;
    summary: string;
    place: string;
    country: string;
    cit_id: string;
    cit_code: string;
    type: string;
    code: string;
  }

  export interface Destination {
    id: string;
    code: string;
    name: string;
    latitude: string;
    longitude: string;
    country: string;
    continent: string;
    iataCode: string;
    thumbnail: string;
    originCode: string;
    description: string;
    flexindex: number;
    priceFrom: number;
    meta: {
      tag: Tag[];
      continents: Tag[];
    };
  }

  export interface DestinationWiki {
    title: string;
    description: string;
    contributors: string;
    article_link: string;
  }

  export interface DestinationImage {
    src: string;
  }

  export interface DestinationTag {
    code: string;
    name_en: string;
    name_it: string;
  }

  export interface Dates {
    days: number;
    outward: string;
    return: string;
    priceFrom: number;
    isWeekend: boolean;
  }

  export interface DatesOverview {
    weekends: Dates[];
    weeks: Dates[];
    longs: Dates[];
  }

  export interface Price {
    sale?: number; // Int
    regular: number; // Int
  }

  export interface PriceDetail {
    id: string;
    type: 'routes' | 'activities';
    price: Price;
  }

  export interface Travelers {
    adults: number; // Int
    children: number; // Int
    infants?: number; // Int
  }

  export interface AbstractBaseModel {
    id: string;
    code?: string;
    name: string;
    latitude?: string;
    longitude?: string;
  }

  export interface Waypoint<T extends AbstractBaseModel> {
    id: string;
    type: string; // Airport, City, Bus-Station, Hotel etc...
    estimateTouch: number; // Timestamp
    model: T;
  }

  export interface Carrier { // Company
    type: string; // FlightCompany | BusCompany | TrainCompany.... Public or Private?
    logo?: string;
    code: string;
    name: string;
  }

  export interface Segment {
    id: string;
    origin: Waypoint<any>;
    destination: Waypoint<any>;
    duration: number; // Int
    // A seguire si potrebbe wrappare dentro un oggetto Travel
    type: string; // i.e. Flight, Bus, Train, Walking
    carrier?: Carrier;
    travelCode?: string; // i.e. Flight Code
    price?: Price;
  }

  export interface Route {
    id: string;
    origin: Waypoint<any>;
    segments: Segment[];
    destination: Waypoint<any>;
    duration: number; // Int
    carriers?: Carrier[];
    price?: Price;
  }

  export interface Itinerary {
    id: string;
    route: Route;
    activities?: Waypoint<any>[]; // Hotel, Escursione, Ristorante, etc..
    price?: Price;
  }

  export interface Pack {
    id: string;
    itineraries: Itinerary[];
    price: Price;
    prices: PriceDetail[];
    token: string;
    travelers: Travelers;
  }

  export interface PackOverview {
    cheapest?: Pack;
    best?: Pack;
    top?: Pack;
  }

  export interface Accomodation {

  }

  export interface Bag {
    width: number; // cm
    height: number; // cm
    length: number; // cm
    weight: number; // kg
    max: number;
    name: string;
    includePriorityBoarding: true;
    prices: Price[];
    total?: number;
    type?: string;
  }

  export interface Insurance {
    price: number;
    name: string;
    type: 'basic' | 'plus';
  }

  export interface PackCheck {
    status: 'ok' | 'invalid' | 'changed';
    priceDeal?: number;
    pack?: Pack;
    bags?: {
      hand: Bag;
      hold: Bag;
      personal: Bag;
    };
    priorityBoarding: {
      available: boolean;
      flightsAvailable: string[];
      partialPriority: boolean;
      price: Price;
      currency: 'EUR' | string;
    };
    insurances?: Insurance[];
    discount?: {
      coupons: any[];
      credit: number;
    }
  }

  export interface Booking {
    id: number;
    departureDate: string;
    returnDate: string;
    code: string;
    status: 'pending' | 'failed' | string;
    price: Price;
    contact: {
      firstname: string;
      lastname: string;
      email: string;
      phone: string;
    };
    user: {[key: string]: string};
    services: {[key: string]: any} | null;
    servicesCount?: {[key: string]: any};
    city: Destination;
  }

  export interface Bookings {
    active: Booking[];
    expired: Booking[];
  }
}
