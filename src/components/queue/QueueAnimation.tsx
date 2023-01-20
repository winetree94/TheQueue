import { Animatable, AnimatableContext } from 'cdk/animation/UseAnimate';
import { QueueFade, QueueRect, QueueSquare } from 'model/object/rect';
import { createContext, FunctionComponent, ReactElement } from 'react';
import { getAnimatableFade, getCurrentFade, getFadeAnimation } from './animate/fade';
import { getAnimatableRect, getCurrentRect, getRectAnimation } from './animate/rect';

export const a = 3;

export interface QueueAnimatableContextType {
  rect: QueueRect;
  fade: QueueFade;
}


export const QueueAnimatableContext = createContext<QueueAnimatableContextType>({
  rect: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
  fade: {
    opacity: 0,
  },
});

export interface ObjectAnimatableProps {
  queueStart: number;
  queueIndex: number;
  queuePosition: 'forward' | 'backward' | 'pause';
  object: QueueSquare;
  children: React.ReactNode;
}

export const ObjectAnimatable: FunctionComponent<ObjectAnimatableProps> = ({
  children,
  object,
  queueIndex,
  queuePosition,
  queueStart,
}) => {
  const currentFade = getCurrentFade(object, queueIndex);
  const animatableFade = queueStart > 0 ? getFadeAnimation(object, queueIndex, queuePosition) : undefined;
  const currentRect = getCurrentRect(object, queueIndex);
  const animatableRect = queueStart > 0 ? getRectAnimation(object, queueIndex, queuePosition) : undefined;

  return (
    <Animatable
      duration={animatableRect?.moveEffect.duration || 0}
      start={queueStart}>
      <AnimatableContext.Consumer>
        {(rectProgress): ReactElement => {
          return (
            <Animatable
              duration={animatableFade?.fadeEffect.duration || 0}
              start={queueStart}>
              <AnimatableContext.Consumer>
                {(fadeProgress): ReactElement => {
                  return (
                    <QueueAnimatableContext.Provider value={{
                      rect: getAnimatableRect(rectProgress, currentRect, animatableRect?.fromRect),
                      fade: getAnimatableFade(fadeProgress, currentFade, animatableFade?.fromFade),
                    }}>
                      {children}
                    </QueueAnimatableContext.Provider>
                  );
                }}
              </AnimatableContext.Consumer>
            </Animatable>
          );
        }}
      </AnimatableContext.Consumer>
    </Animatable>
  );
};