import { QueueEffectType } from '@legacy/model/effect';
import { QueueObjectType } from '@legacy/model/object';
import { QUEUE_CLIPBOARD_UNIQUE_ID } from './constants';

export interface QueueClipboardModel<T> {
  type: string;
  identity: typeof QUEUE_CLIPBOARD_UNIQUE_ID;
  data: T;
}

export interface QueueObjectClipboardModel
  extends QueueClipboardModel<
    {
      object: QueueObjectType;
      effects: QueueEffectType[];
    }[]
  > {
  type: 'objects';
  identity: typeof QUEUE_CLIPBOARD_UNIQUE_ID;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isQueueObjectClipboardModel = (
  model: any,
): model is QueueObjectClipboardModel => {
  return (
    model?.type === 'objects' && model?.identity === QUEUE_CLIPBOARD_UNIQUE_ID
  );
};
