import { OBJECT_PROPERTY_META } from 'model/property/meta';

export type QueueStroke = {
  dasharray: string;
  width: number;
  color: string;
};

export interface WithStroke {
  [OBJECT_PROPERTY_META.STROKE]: QueueStroke;
}
