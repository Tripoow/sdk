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
