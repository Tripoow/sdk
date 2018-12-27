export interface PackOverviewOptions {
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

}
