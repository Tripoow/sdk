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
}
