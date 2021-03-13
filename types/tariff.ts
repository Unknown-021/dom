export enum DEVICE_BUY_METHOD {
  UNDEFINED,
  INCLUDED,
  RENT,
  CREDIT,
  BUY
}

export enum TARIFF_CHECKED_ADDRESS {
  UNCHECKED,
  AVALILABLE,
  NOT_AVALIABLE,
  OTHER_AVALIABLE
}

export interface IServiceType {
  id: number;
  description: string;
  code: string;
  name: string;
  short_name: string|null;
}

export interface IDevicePaymentMethod {
  id: number;
  name: string;
  description: string|null;
}

export interface IDeviceType {
  id: number;
  services: IServiceType['id'][];
  name: string;
  description: string|null;
}

export interface TariffCategory {
  id: string;
  name: string;
}
