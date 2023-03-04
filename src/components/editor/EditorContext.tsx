import { ContextMenuContentProps } from '@radix-ui/react-context-menu';
import { nanoid } from '@reduxjs/toolkit';
import { QueueContextMenu } from 'components/context-menu/Context';
import { isQueueObjectClipboardModel } from 'model/clipboard/base';
import { forwardRef } from 'react';
import { EffectActions, NormalizedQueueEffect } from 'store/effect';
import { HistoryActions } from 'store/history';
import { HistorySelectors } from 'store/history/selectors';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { NormalizedQueueObjectType, ObjectActions } from 'store/object';
import { SettingsActions, SettingSelectors } from 'store/settings';
import styles from './EditorContext.module.scss';

export const EditorContext: React.ForwardRefExoticComponent<
  ContextMenuContentProps & React.RefAttributes<HTMLDivElement>
> = forwardRef((_, ref) => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(SettingSelectors.settings);
  const history = useAppSelector(HistorySelectors.all);

  const paste = async () => {
    try {
      const raw = await navigator.clipboard.readText();
      const clipboardData = JSON.parse(raw);
      if (isQueueObjectClipboardModel(clipboardData)) {
        const pendingObjects: NormalizedQueueObjectType[] = [];
        const pendingEffects: NormalizedQueueEffect[] = [];
        clipboardData.data.forEach((data) => {
          const objectId = nanoid();
          pendingObjects.push({
            ...data.object,
            id: objectId,
            pageId: settings.pageId,
            rect: {
              ...data.object.rect,
              x: data.object.rect.x + 10,
              y: data.object.rect.y + 10,
            },
          });
          pendingEffects.push(
            ...data.effects.map((effect) => {
              return {
                ...effect,
                id: nanoid(),
                objectId: objectId,
              };
            }),
          );
        });

        if (pendingObjects.length === 0) {
          return;
        }
        dispatch(HistoryActions.Capture());
        dispatch(EffectActions.upsertEffects(pendingEffects));
        dispatch(
          ObjectActions.addMany({
            queueIndex: undefined,
            objects: pendingObjects,
          }),
        );
        dispatch(
          SettingsActions.setSelection({
            selectionMode: 'normal',
            ids: pendingObjects.map((object) => object.id),
          }),
        );
      }
    } catch (error) {
      console.warn('not supported clipboard data');
    }
  };

  return (
    <QueueContextMenu.Content ref={ref}>
      <QueueContextMenu.Item disabled={!history.previous.length} onClick={() => dispatch(HistoryActions.Undo())}>
        실행 취소 <div className={styles.RightSlot}>⌘+Z</div>
      </QueueContextMenu.Item>
      <QueueContextMenu.Item disabled={!history.future.length} onClick={() => dispatch(HistoryActions.Redo())}>
        다시 실행 <div className={styles.RightSlot}>⌘+Shift+Z</div>
      </QueueContextMenu.Item>
      <QueueContextMenu.Separator />
      <QueueContextMenu.Item onClick={() => paste()}>
        붙여넣기 <div className={styles.RightSlot}>⌘+V</div>
      </QueueContextMenu.Item>
    </QueueContextMenu.Content>
  );
});
