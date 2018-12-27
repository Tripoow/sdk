export interface PackOptions {
  budget: number;
  outwardDate: string;
  returnDate: string;
  travelers: {
    adults: number;
    children?: number;
    infants?: number;
  };
  originCode: string;
  destinationCode: string;
}

export interface PackResult {

}

export interface PackOverviewOptions extends PackOptions {
  accomodations?: {
    guests: {
      adults: number;
      children?: number;
      infants?: number;
      childAges?: number[];
    }[];
  }
}

export interface PackOverviewResult {
  cheapest: any;
  best: any;
  top: any;
}
