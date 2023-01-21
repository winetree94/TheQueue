/* eslint-disable react-hooks/exhaustive-deps */
import {
  QueueRotate,
  QueueSquare,
  RotateEffect,
} from '../../../model/object/rect';

export interface RotateAnimation {
  fromRotate: QueueRotate;
  rotateEffect: RotateEffect;
}

export const getCurrentRotate = (
  object: QueueSquare,
  index: number
): QueueRotate => {
  return object.effects
    .filter((effect) => effect.index <= index)
    .filter((effect): effect is RotateEffect => effect.type === 'rotate')
    .reduce<QueueRotate>((_, effect) => effect.rotate, object.rotate);
};

export const getRotateAnimation = (
  object: QueueSquare,
  index: number,
  position: 'forward' | 'backward' | 'pause'
): RotateAnimation | null => {
  if (position === 'pause') {
    return null;
  }

  const fromRotate = getCurrentRotate(
    object,
    position === 'forward' ? index - 1 : index + 1
  );

  const rotateEffect = object.effects.find((effect): effect is RotateEffect => {
    const targetIndex = position === 'forward' ? index : index + 1;
    return effect.index === targetIndex && effect.type === 'rotate';
  });

  if (!rotateEffect) {
    return null;
  }

  const slicedEffect: RotateEffect =
    position === 'backward'
      ? {
          ...rotateEffect,
          rotate: {
            ...getCurrentRotate(object, index),
          },
        }
      : rotateEffect;

  return {
    fromRotate: fromRotate,
    rotateEffect: slicedEffect,
  };
};

export const getAnimatableRotate = (
  progress: number,
  targetScale: QueueRotate,
  fromScale?: QueueRotate,
): QueueRotate => {
  if (progress < 0 || !fromScale) {
    return targetScale;
  }
  return {
    x: fromScale.x + (targetScale.x - fromScale.x) * progress,
    y: fromScale.y + (targetScale.y - fromScale.y) * progress,
    degree: fromScale.degree + (targetScale.degree - fromScale.degree) * progress,
    position: 'forward',
  };
};