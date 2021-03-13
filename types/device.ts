import { IImage } from '~/types/blog'
import { IProvider } from '~/types/providers'

export enum DeviceKind {
  UNDEFINED,
  ROUTER,
  TV_BOX,
  VIDEO_CAMERA
}

export interface DeviceDetail {
  id: number;
  text: string;
  techs: string[];
  name: string;
  description: string | null;
  Provider: number | null;
  kind: number;
  // Убрать надо
  image: [{
    url: string
  }]
}
export interface CmsDeviceDetail {
  id: number,
  Title: string,
  SourceID: number,
  Provider: IProvider,
  description: string,
  characteristics: string,
  image: IImage[],
  kind: number;
}
