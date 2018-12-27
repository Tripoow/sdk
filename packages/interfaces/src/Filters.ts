import { Month } from "./standard";

export namespace Filters {

  export interface AgesRange {
    adults: number;
    children?: number;
    infants?: number;
  }

  export interface AgesRangeDetail extends AgesRange {
    childAges?: number[];
  }

  export interface Origin {
    suggest?: string;
    pos?: {
      lat: string;
      lon: string;
    };
  }

  export interface Destination {
    originCode: string;
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
    hasHotels?: boolean;
  }

  export interface Pack {
    budget: number;
    outwardDate: string;
    returnDate: string;
    travelers: AgesRange;
    originCode: string;
    destinationCode: string;
  }

  export interface PackOverview extends Pack {
    accomodations?: {
      guests: AgesRangeDetail[];
    }
  }

}
