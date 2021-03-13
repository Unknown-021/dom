import { DealDevice } from '~/types/deals'

export interface DealOptionsState {
  devices: Record<DealDevice['device'], DealSelectedDevice>;
  tv_package: number;
  additional_tv_packages: number[];
}

export interface DealSelectedDevice {
  id: DealDevice['device'];
  count: number;
}
