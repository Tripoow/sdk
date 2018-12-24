export interface OriginResult {
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

export interface OriginOptions {
  suggest?: string;
  pos?: {
      lat: string;
      lon: string;
  };
}

export interface DestinationResult {
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
    tag: {
      name_en: string;
      code: string;
      name_it: string;
    }[];
    continents: {
      name_en: string;
      code: string;
      name_it: string;
    }[];
  };
}

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface DestinationOptions {
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

export interface DateOptions {
  budget: number;
  originCode: string;
  destinationCode: string;
  hasHotels?: boolean;
}


export interface DateResult {
  days: number;
  outward: string;
  return: string;
  priceFrom: number;
  isWeekend: boolean;
}

export interface DateResults {
  weekends: DateResult[];
  weeks: DateResult[];
  longs: DateResult[];
}

