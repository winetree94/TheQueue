import { useContext } from 'react';
import { QueueObjectContainerContext } from './Container';
import { Circle } from './rect/Circle';
import { Icon } from './rect/Icon';
import { Line } from './rect/Line';
import { Square } from './rect/Square';
import { Image } from './rect/Image';

export interface RectProps {
  onRectMousedown?(): void;
}

export const Rect = (props: RectProps) => {
  const containerContext = useContext(QueueObjectContainerContext);

  switch (containerContext.object.type) {
    case 'circle':
      return <Circle {...props}></Circle>;
    case 'rect':
      return <Square {...props}></Square>;
    case 'line':
      return <Line {...props}></Line>;
    case 'icon':
      return <Icon {...props}></Icon>;
    case 'image':
      return <Image {...props}></Image>;
    default:
      return <></>;
  }
};
