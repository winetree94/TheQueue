import { forwardRef } from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import styles from './Slider.module.scss';
import { clsx } from 'clsx';

export interface QueueSliderProps extends SliderPrimitive.SliderProps {
  className?: string;
  disableRange?: boolean;
}

export const QueueSlider = forwardRef<HTMLScriptElement, QueueSliderProps>(
  ({ className, disableRange = false, ...props }, forwardedRef) => {
    const value = props.value || props.defaultValue || [];
    const key = props.id || 'SliderThumb';

    return (
      <SliderPrimitive.Slider
        {...props}
        className={clsx(styles.SliderRoot, className)}
        ref={forwardedRef}>
        <SliderPrimitive.Track className={styles.SliderTrack}>
          {!disableRange && (
            <SliderPrimitive.Range className={clsx(styles.SliderRange)} />
          )}
        </SliderPrimitive.Track>
        {value.map((_, i) => (
          <SliderPrimitive.Thumb
            key={`${key}-${i}`}
            className={styles.SliderThumb}
          />
        ))}
      </SliderPrimitive.Slider>
    );
  },
);
