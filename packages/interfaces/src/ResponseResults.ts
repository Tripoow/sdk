export namespace ResponseResults {
  export interface AuthLogin {
    access_token: string;
    expires_in: number;
    user_id: number;
  }

  export interface MediaImages {
    small?: string[];
    medium?: string[];
    large?: string[];
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

  export interface City {
    name: string;
    code: string;
    country?: string;
    continent?: string;
    iataCode?: string;
    thumbnail?: string;
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

  export interface Carrier {
    // Company
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

  export namespace Hotel {
    export interface Poi {
      id: string;
      name: string;
      latitude: string;
      longitude: string;
      scorePercent: number; // Int
      reviews: string[];
      metersFrom: number; // Int
    }

    export interface Policy {
      type: string;
      typology: number; // Int
      nights: number; // Int
      percentage: number; // Int
      timeLimit: number; // Int
      price: Price; // Int
      description: string;
      descriptionShort: string;
    }

    export interface Facility {
      type: string;
      label: string;
      value: string;
    }

    export interface BoardBase {
      id: string;
      code: string;
      name: string;
      price: Price;
      policies?: Policy[];
    }

    export interface Room {
      id: string;
      name: string;
      maxGuests: {
        adults: number;
        children?: number;
        infants?: number;
      };
      categoryCode: string;
      bedding?: string;
      quantity: number; // Int
      priceTotal: Price;
      priceNight: Price;
      boardBases: BoardBase[];
    }

    export interface Product {
      id: string;
      rooms: Room[];
      priceTotal: Price;
      priceNight: Price;
      boardBases: BoardBase[];
    }

    export interface Badge {
      id: string;
      title: string;
      text: string;
      type: string;
      scorePercent: number; // Int
    }

    export interface Score {
      scorePercent: number; // Int
      reviewCount: number; // Int
      reviewCouplePercent: number; // Int
      reviewSoloPercent: number; // Int
      reviewFamilyPercent: number; // Int
      reviewBusinessPercent: number; // Int
      text: string;
      star1Count: number; // Int
      star2Count: number; // Int
      star3Count: number; // Int
      star4Count: number; // Int
      star5Count: number; // Int
    }

    export interface Review {
      id: string;
      category: string;
      reviewCount: number; // Int
      scorePercent: number; // Int
      title: string;
      description: string;
    }

    export interface ReviewSocial {
      id: string;
      text: string;
      date: number; // Timestamp
      author: string;
      social: string;
      score: number;
      lang: string;
    }
  }

  export interface Accomodation {
    id: string;
    name: string;
    latitude?: string;
    longitude?: string;
    descriptions?: {
      type: string;
      text: string;
    }[];
    chain?: string;
    stars: number; // Int
    address: string;
    postalCode?: string;
    metersFromCenter: number; // Int
    city: City;
    facilities?: Hotel.Facility[];
    roomFacilities?: Hotel.Facility[];
    email?: string;
    website?: string;
    nights: number; // Int
    totalAdults: number; // Int
    totalChildren: number; // Int
    checkin: string; // YYYY-MM-DD
    checkout: string; // YYYY-MM-DD
    thumbnail: string;
    media: MediaImages;
    productIndex?: number; // Int
    productBoardBaseIndex?: number; // Int
    products: Hotel.Product[];
    badges?: Hotel.Badge[];
    score?: Hotel.Score;
    reviews?: Hotel.Review[];
    reviewPosts?: Hotel.ReviewSocial[];
    pois?: Hotel.Poi[];
    provider: string;
    roomPriceMin: number; // ??????????????
    productPriceMin: number;
    token?: string;
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
    };
  }

  export interface Payment {
    pay_amount: number;
    price_deal: number | null;
  }

  export interface BookingServiceFlight {
    bkf_id: number;
    bookingId: string | null;
    bookingStatus: 'pending' | 'failed' | string;
    id: string;
    itineraries: Itinerary[];
    pack_service_id: number;
    price: Price;
    prices: PriceDetail[];
    travelers: Travelers;
  }

  export interface BookingServiceHotel {
    bkg_id: number;
    pack_service_id: number;
    bookingCode: string;
    bookingStatus: 'pending' | 'failed' | string;
  }

  export interface Booking {
    id: number;
    departureDate: string;
    returnDate: string;
    code: string;
    status: 'pending' | 'failed' | string;
    price: Price;
    contact: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
    pack: Pack | null;
    user: {
      email: string;
      [key: string]: string;
    };
    services: {
      flights?: BookingServiceFlight;
      hotels?: BookingServiceHotel;
    } | null;
    servicesCount: {
      flights: number;
      hotels: number;
    };
    city: City;
    payment: Payment;
  }

  export interface Bookings {
    active: Booking[];
    expired: Booking[];
  }
}
