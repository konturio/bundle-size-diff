export interface Asset {
  name: string;
  size: number;
}

export interface Include {
  assets?: Array<Asset>;
}

export interface Assets {
  base: Array<Asset>;
  pr: Array<Asset>;
}

export interface Stats {
  total: {
    oldSize: number,
    newSize: number,
    diff: number,
    diffPercentage: number
  }
}