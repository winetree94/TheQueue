import { EntityId } from '@reduxjs/toolkit';
import { QueueDocumentRect } from 'model/document/document';
import {
  WithRect,
  WithFade,
  WithFill,
  WithRotation,
  WithScale,
  WithStroke,
  WithText,
} from 'model/property';
import { WithImage } from 'model/property/image';
import { OBJECT_TYPE } from './meta';
import { BaseObject } from './base';

export interface QueueImage
  extends BaseObject,
    WithRect,
    WithFade,
    WithFill,
    WithRotation,
    WithScale,
    WithStroke,
    WithText,
    WithImage {
  type: typeof OBJECT_TYPE.IMAGE;
}

export const createDefaultImage = (
  documentRect: QueueDocumentRect,
  pageId: EntityId,
  objectId: string,
): QueueImage => {
  const width = 300;
  const height = 300;

  return {
    type: OBJECT_TYPE.IMAGE,
    id: objectId,
    pageId: pageId,
    index: 0,
    rect: {
      x: documentRect.width / 2 - width / 2,
      y: documentRect.height / 2 - height / 2,
      width,
      height,
    },
    fill: {
      color: '#ffffff',
      opacity: 1,
    },
    rotate: {
      degree: 0,
    },
    scale: {
      scale: 1,
    },
    fade: {
      opacity: 1,
    },
    text: {
      text: '',
      fontSize: 24,
      fontColor: '#000000',
      fontFamily: 'Arial',
      horizontalAlign: 'center',
      verticalAlign: 'middle',
    },
    stroke: {
      color: '#000000',
      dasharray: '',
      width: 0,
    },
    image: {
      assetId: '',
      src: '',
      alt: '',
    },
  };
};
