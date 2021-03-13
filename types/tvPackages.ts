export interface TvPackage {
  id: number;
  name: string;
  channels_count: number;
  hd_channels_count: number;
  surcharge: null;
  default: boolean;
  additional: boolean;
  provider: number;
  channels: TvChannel['id'][]; // TOBACKEND
}

export interface TvChannel { // TOBACKEND
  id: number;
  name: string;
  isHD: boolean;
  logo?: string;
}
