import { OBJECT_EFFECT_TYPES, OBJECT_EFFECT_TYPE } from 'model/effect';

// TODO as const 붙여야함
export const OBJECT_TYPE = {
  GROUP: 'group',
  RECT: 'rect',
  CIRCLE: 'circle',
  ICON: 'icon',
  LINE: 'line',
  IMAGE: 'image',
} as const;

export type OBJECT_TYPES = (typeof OBJECT_TYPE)[keyof typeof OBJECT_TYPE];

export const OBJECT_ADDABLE_EFFECTS: {
  [key in OBJECT_TYPES]: readonly OBJECT_EFFECT_TYPES[];
} = {
  [OBJECT_TYPE.RECT]: [
    OBJECT_EFFECT_TYPE.FADE,
    OBJECT_EFFECT_TYPE.FILL,
    OBJECT_EFFECT_TYPE.STROKE,
    OBJECT_EFFECT_TYPE.ROTATE,
    OBJECT_EFFECT_TYPE.SCALE,
    OBJECT_EFFECT_TYPE.RECT,
  ],
  [OBJECT_TYPE.CIRCLE]: [
    OBJECT_EFFECT_TYPE.FADE,
    OBJECT_EFFECT_TYPE.FILL,
    OBJECT_EFFECT_TYPE.STROKE,
    OBJECT_EFFECT_TYPE.ROTATE,
    OBJECT_EFFECT_TYPE.SCALE,
    OBJECT_EFFECT_TYPE.RECT,
  ],
  [OBJECT_TYPE.ICON]: [
    OBJECT_EFFECT_TYPE.FADE,
    OBJECT_EFFECT_TYPE.FILL,
    OBJECT_EFFECT_TYPE.ROTATE,
    OBJECT_EFFECT_TYPE.SCALE,
    OBJECT_EFFECT_TYPE.RECT,
  ],
  [OBJECT_TYPE.LINE]: [
    OBJECT_EFFECT_TYPE.FADE,
    OBJECT_EFFECT_TYPE.STROKE,
    OBJECT_EFFECT_TYPE.ROTATE,
    OBJECT_EFFECT_TYPE.SCALE,
    OBJECT_EFFECT_TYPE.RECT,
  ],
  [OBJECT_TYPE.IMAGE]: [
    OBJECT_EFFECT_TYPE.FADE,
    OBJECT_EFFECT_TYPE.STROKE,
    OBJECT_EFFECT_TYPE.ROTATE,
    OBJECT_EFFECT_TYPE.SCALE,
    OBJECT_EFFECT_TYPE.RECT,
  ],
  [OBJECT_TYPE.GROUP]: [
    OBJECT_EFFECT_TYPE.FADE,
    OBJECT_EFFECT_TYPE.FILL,
    OBJECT_EFFECT_TYPE.STROKE,
    OBJECT_EFFECT_TYPE.ROTATE,
    OBJECT_EFFECT_TYPE.SCALE,
    OBJECT_EFFECT_TYPE.RECT,
  ],
} as const;
