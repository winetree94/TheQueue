import { OBJECT_PROPERTY_META } from 'model/property/meta';

export type QueueRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export interface WithRect {
  [OBJECT_PROPERTY_META.RECT]: QueueRect;
}
