import { ContextMenuContentProps } from '@radix-ui/react-context-menu';
import { forwardRef } from 'react';
import styles from './Context.module.scss';
import { useAppDispatch, useAppSelector } from '@legacy/store/hooks';
import { SettingSelectors } from '@legacy/store/settings/selectors';
import { ObjectActions } from '../../store/object';
import { HistoryActions } from '@legacy/store/history';
import { EffectActions, EffectSelectors } from '@legacy/store/effect';
import { QUEUE_CLIPBOARD_UNIQUE_ID } from '@legacy/model/clipboard/constants';
import { useTranslation } from 'react-i18next';
import { deviceMetaKey } from '@legacy/cdk/device/meta';
import { store } from '@legacy/store';
import { ContextMenu } from '@radix-ui/themes';

export const QueueObjectContextContent = forwardRef<
  HTMLDivElement,
  ContextMenuContentProps
>(function QueueObjectContextContent(_, ref) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const selectedObjectIds = useAppSelector(SettingSelectors.selectedObjectIds);
  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);

  /**
   * @description
   * 현재 큐에서 오브젝트를 제거, 생성된 큐에서 제거를 시도한 경우 영구히 제거한다.
   */
  const onRemoveObject = (): void => {
    dispatch(HistoryActions.Capture());
    dispatch(
      EffectActions.removeObjectOnQueue({
        ids: selectedObjectIds,
      }),
    );
  };

  /**
   * @description
   * 오브젝트를 영구히 제거
   */
  const onCompletelyRemoveClick = (): void => {
    dispatch(HistoryActions.Capture());
    dispatch(ObjectActions.removeMany(selectedObjectIds));
  };

  /**
   * @description
   * 오브젝트를 복제
   */
  const duplicate = (): void => {
    dispatch(HistoryActions.Capture());
    dispatch(ObjectActions.duplicate({ ids: selectedObjectIds }));
  };

  /**
   * @description
   * 오브젝트를 클립보드에 복사
   */
  const copyToClipboard = async () => {
    const effects = EffectSelectors.effectsByObjectId(store.getState());
    const models = selectedObjects.map((object) => ({
      object: object,
      effects: effects[object.id],
    }));
    await navigator.clipboard.writeText(
      JSON.stringify({
        identity: QUEUE_CLIPBOARD_UNIQUE_ID,
        type: 'objects',
        data: models,
      }),
    );
  };

  return (
    <ContextMenu.Content
      onMouseDown={(e): void => e.stopPropagation()}
      ref={ref}>
      <ContextMenu.Item onClick={onRemoveObject}>
        {t('object-context.delete-from-current-queue')}{' '}
        <div className={styles.RightSlot}>Backspace</div>
      </ContextMenu.Item>
      <ContextMenu.Item onClick={onCompletelyRemoveClick}>
        {t('object-context.delete-permanently')}{' '}
        <div className={styles.RightSlot}>{deviceMetaKey}+Backspace</div>
      </ContextMenu.Item>
      <ContextMenu.Separator />
      <ContextMenu.Item onClick={copyToClipboard}>
        {t('global.copy')}{' '}
        <div className={styles.RightSlot}>{deviceMetaKey}+C</div>
      </ContextMenu.Item>
      <ContextMenu.Item onClick={duplicate}>
        {t('global.duplicate')}
      </ContextMenu.Item>
      {selectedObjectIds.length === 1 && (
        <>
          <ContextMenu.Separator />
          <ContextMenu.Item
            onClick={() => {
              dispatch(HistoryActions.Capture());
              dispatch(
                ObjectActions.toFront({
                  id: selectedObjectIds[0],
                }),
              );
            }}>
            {t('object-context.to-front')}
          </ContextMenu.Item>
          <ContextMenu.Item
            onClick={() => {
              dispatch(HistoryActions.Capture());
              dispatch(
                ObjectActions.toBack({
                  id: selectedObjectIds[0],
                }),
              );
            }}>
            {t('object-context.to-back')}
          </ContextMenu.Item>
          <ContextMenu.Item
            onClick={() => {
              dispatch(HistoryActions.Capture());
              dispatch(
                ObjectActions.BringForward({
                  id: selectedObjectIds[0],
                }),
              );
            }}>
            {t('object-context.bring-forward')}
          </ContextMenu.Item>
          <ContextMenu.Item
            onClick={() => {
              dispatch(HistoryActions.Capture());
              dispatch(
                ObjectActions.SendBackward({
                  id: selectedObjectIds[0],
                }),
              );
            }}>
            {t('object-context.send-backward')}
          </ContextMenu.Item>
        </>
      )}
      <ContextMenu.Item
        onClick={() => {
          dispatch(HistoryActions.Capture());
          dispatch(
            ObjectActions.Group({
              ids: selectedObjectIds,
            }),
          );
        }}>
        {t('object-context.group')}
      </ContextMenu.Item>
      <ContextMenu.Item
        onClick={() => {
          dispatch(HistoryActions.Capture());
          dispatch(
            ObjectActions.Ungroup({
              ids: selectedObjectIds,
            }),
          );
        }}>
        {t('object-context.ungroup')}
      </ContextMenu.Item>
    </ContextMenu.Content>
  );
});
