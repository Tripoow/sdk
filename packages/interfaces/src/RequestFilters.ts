import { Month } from './standard';

export namespace RequestFilters {

  export interface AgesRange {
    adults: number;
    children?: number;
    infants?: number;
  }

  export interface QuerySort {
    key: string;
    direction?: string;
  }

  export interface AgesRangeDetail extends AgesRange {
    childAges?: number[];
  }

  export interface Origin {
    suggest?: string;
    countries?: 'all';
    pos?: {
      lat: string;
      lon: string;
    };
  }

  export interface Destination {
    originCode: string;
    budgetFrom?: number;
    budget: number;
    months?: Month[];
    datesFrom?: string;
    datesTo?: string;
    daysMin?: number;
    daysMax?: number;
    hasHotels?: boolean;
    suggest?: string;
    tagsCode?: string[];
    continentsCode?: string[];
  }

  export interface Dates {
    budget: number;
    originCode: string;
    destinationCode: string;
    type?: 'weekends' | 'weeks' | 'longs';
    hasHotels?: boolean;
    months?: Month[];
    sort?: QuerySort;
  }

  export interface Routes {
    segmentsMax: number;
    carriersCode: string[];
    stopoverDurationMax: number;
    durationMax: number;
  }

  export interface ItineraryOrigin {
    code: string;
    departureDate?: string; // YYYY-MM-DD
    departureHoursRange?: string; // "00:00-00:00"
  }

  export interface ItineraryDestination {
    code: string;
    arrivalDate?: string; // YYYY-MM-DD
    arrivalHoursRange?: string; // "00:00-00:00"
  }

  export interface Itinerary {
    origin: ItineraryOrigin; // Potrebbero diventare array
    destination: ItineraryDestination; // Potrebbero diventare array
    travelers?: AgesRange;
    accomodations?: Accomodation;
    routes?: Routes;
  }

  export interface Pack {
    budget?: number;
    outwardDate: string; // YYYY-MM-DD
    returnDate: string; // YYYY-MM-DD
    travelers: AgesRange;
    itineraries: Itinerary[];
    accomodations?: Accomodation;
    routes?: Routes;
    sort?: QuerySort;
  }

  export interface PackCrossover {
    packOldToken: string;
    packNewToken?: string;
    hotel?: {
      productId?: string;
      boardBaseId?: string;
      token?: string;
      delete?: true;
    };
  }

  export interface PackOverview extends Pack {
    guests: AgesRangeDetail[];
  }

  export namespace Booking {

    export interface Payment {
      firstname: string;
      lastname: string;
      email: string;
      cardType: string;
      cardExpiration: string; // YYYY-MM
      cardNumber: string;
      cardCVC: string;
    }

    export interface Room {
      id: string;
      guests: {
        firstname: string;
        lastname: string;
        note?: string;
      }[];
    }

    export interface Hotel {
      productId: string;
      productBoardBaseId: string;
      rooms: Room[];
    }

    export interface Bag {
      type: 'hand' | 'hold' | 'personal';
      total: number;
    }

    export interface Passenger {
      firstname: string;
      lastname: string;
      nationality: string; // ISO 3166-1
      gender: 'male' | 'female'; // Mr and Ms
      birthdate: string; // YYYY-MM-DD
      cardNo: string;
      cardExpiration: string; // YYYY-MM
      priorityBoarding?: boolean;
      bags: Bag[];
      insurance: 'none' | 'basic' | 'plus';
    }

    export interface Flight {
      passengers: Passenger[];
    }

    export interface Contact {
      firstname: string;
      lastname: string;
      email: string;
      phone: string;
    }

    export interface Item {
      ids: string[];
      type: 'hotel' | 'flight';
      hotel?: Hotel;
      flight?: Flight;
    }

    export interface Pack {
      token: string;
      segments: Item[];
      activities: Item[];
      contact: Contact;
      payment: Payment;
      discountCode?: string;
      useCredit: boolean;
    }
  }

  export interface Accomodation {
    checkin: string;
    checkout: string;
    destinationCode: string;
    types?: string[];
    guests: AgesRangeDetail[];
    priceNightMin?: number;
    priceNightMax?: number;
    ratingMin?: number;
    stars?: string[]; // ['1', '3']
    metersFromCenterMin?: number;
    metersFromCenterMax?: number;
    facilities?: string[];
    sort?: QuerySort;
  }

  export interface HotelDetails {
    id: string;
    checkin: string;
    checkout: string;
    destinationCode: string;
    guests: AgesRangeDetail[];
  }
}
