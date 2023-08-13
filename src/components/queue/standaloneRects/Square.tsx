import { EntityId } from '@reduxjs/toolkit';
import { convertHexWithOpacity } from 'components/queue/color/convertHex';
import {
  QueueFade,
  QueueFill,
  QueueRect,
  QueueRotate,
  QueueScale,
  QueueStroke,
} from 'model/property';

export interface StandaloneSquareProps {
  objectId: EntityId;
  rect: QueueRect;
  stroke: QueueStroke;
  rotate: QueueRotate;
  fade: QueueFade;
  scale: QueueScale;
  fill: QueueFill;
}

export const StandaloneSquare = ({
  objectId,
  rect,
  stroke,
  rotate,
  fade,
  scale,
  fill,
}: StandaloneSquareProps) => {
  const strokeClipPathID = `st-stroke-alignment-inner-for-rect-${objectId}`;
  const calculatedFill = convertHexWithOpacity(
    fill.color,
    fill.opacity * fade.opacity * fill.opacity,
  );

  return (
    <svg
      className="tw-absolute"
      width={rect.width}
      height={rect.height}
      style={{
        top: `${rect.height > 0 ? rect.y : rect.y + rect.height}px`,
        left: `${rect.width > 0 ? rect.x : rect.x + rect.width}px`,
        transformOrigin: 'center center',
        transform: `rotate(${rotate.degree}deg) scale(${scale.scale})`,
      }}
      viewBox={`0 0 ${rect.width} ${rect.height}`}
      opacity={fade.opacity}>
      <defs>
        <clipPath id={strokeClipPathID}>
          <rect
            rx={0}
            ry={0}
            width={rect.width}
            height={rect.height}
            stroke={stroke.color}
            strokeWidth={stroke.width * 2}
          />
        </clipPath>
      </defs>
      <g>
        <rect
          width={rect.width}
          height={rect.height}
          fill={calculatedFill}
          stroke={stroke.color}
          strokeWidth={stroke.width * 2}
          strokeDasharray={stroke.dasharray}
          clipPath={`url(#${strokeClipPathID})`}></rect>
      </g>
    </svg>
  );
};
