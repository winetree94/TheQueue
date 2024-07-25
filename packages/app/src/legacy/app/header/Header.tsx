import { memo, ReactNode, useState } from 'react';
import styles from '@legacy/app/header/Header.module.scss';
import clsx from 'clsx';
import { QueueMenubar } from '@legacy/components/menu-bar/Menubar';
import { useAlertDialog } from '@legacy/components/alert-dialog/AlertDialog';
import { NewDocumentDialog } from '@legacy/app/new-document-dialog/NewDocumentDialog';
import { useAppDispatch, useAppSelector } from '@legacy/store/hooks';
import { DocumentSelectors } from '@legacy/store/document/selectors';
import { DocumentActions } from '../../store/document';
import { HistorySelectors } from '@legacy/store/history/selectors';
import { HistoryActions } from '@legacy/store/history';
import { SettingsActions } from '@legacy/store/settings';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { PreferencesSelectors } from '@legacy/store/preferences/selectors';
import { PreferencesActions } from '@legacy/store/preferences/actions';
import { SUPPORTED_LANGUAGES } from '@legacy/store/preferences/model';
import { QUEUE_UI_SIZE } from '@legacy/styles/ui/Size';
import { QUEUE_UI_COLOR } from '@legacy/styles/ui/Color';
import { useRootRenderer } from '@legacy/cdk/root-renderer/root-renderer';
import { RootState, store } from '@legacy/store';
import { QueueDropdown } from '@legacy/components/dropdown/Dropdown';
import { QueueButton } from '@legacy/components/buttons/button/Button';
import { RiPlayLine } from '@remixicon/react';

export interface ToolbarModel {
  key: string;
  label: ReactNode;
  onClick?: () => void;
  children: ToolbarModel[];
}

export const QueueHeader = memo(() => {
  const { t, i18n } = useTranslation();
  // 불필요한 리렌더링을 막기 위해 useAppSelector로 셀렉한 값들을 사용할 때 구조분해 할당으로 가져온다. (나머지 상태는 업데이트 자체가 여러번 되는지 확인이 필요)
  const { previous, future } = useAppSelector(HistorySelectors.all);
  const dispatch = useAppDispatch();
  const alertDialog = useAlertDialog();
  const preferences = useAppSelector(PreferencesSelectors.all);
  const rootRenderer = useRootRenderer();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const docId = useAppSelector(DocumentSelectors.documentId);
  const docName = useAppSelector(DocumentSelectors.documentName);

  const openNewDocumentDialog = () => {
    rootRenderer.render(
      <NewDocumentDialog
        onSubmit={(document) =>
          dispatch(DocumentActions.loadDocument(document))
        }
      />,
    );
  };

  const onNewDocumentClick = (): void => {
    const docs = DocumentSelectors.document(store.getState());
    if (docs) {
      alertDialog.open({
        title: t('global.data-loss-warning-title'),
        description: t('global.data-loss-warning'),
        buttons: [
          {
            label: t('global.cancel'),
            size: QUEUE_UI_SIZE.MEDIUM,
            color: QUEUE_UI_COLOR.RED,
          },
          {
            label: t('global.confirm'),
            size: QUEUE_UI_SIZE.MEDIUM,
            color: QUEUE_UI_COLOR.BLUE,
            onClick: openNewDocumentDialog,
          },
        ],
      });
      return;
    }
    openNewDocumentDialog();
  };

  const startFileChooser = (): void => {
    const input = document.createElement('input');
    input.type = 'file';
    input.click();
    const onFileSelected = (): void => {
      try {
        if (!input.files) {
          return;
        }
        const file = input.files[0];
        if (!file) {
          return;
        }
        // parseTheQueueFile(file);
        const fileReader = new FileReader();
        fileReader.onload = (e): void => {
          const result = e.target?.result as string;
          const document = JSON.parse(result) as RootState;
          dispatch(DocumentActions.loadDocument(document));
        };
        fileReader.readAsText(file);
      } catch (e) {
        console.warn(e);
      }
    };
    input.addEventListener('change', onFileSelected, { once: true });
  };

  const onOpenDocumentClick = (): void => {
    const docs = DocumentSelectors.document(store.getState());
    if (docs) {
      alertDialog.open({
        title: t('global.data-loss-warning-title'),
        description: t('global.data-loss-warning'),
        buttons: [
          {
            label: t('global.cancel'),
            size: QUEUE_UI_SIZE.MEDIUM,
            color: QUEUE_UI_COLOR.RED,
          },
          {
            label: t('global.confirm'),
            size: QUEUE_UI_SIZE.MEDIUM,
            color: QUEUE_UI_COLOR.BLUE,
            onClick: startFileChooser,
          },
        ],
      });
      return;
    }
    startFileChooser();
  };

  const onPresentationStartClick = (): void => {
    dispatch(SettingsActions.setPresentationMode(true));
  };

  const onSaveDocumentClick = (): void => {
    const docs = DocumentSelectors.document(store.getState());
    if (!docs) return;
    const serializedDocumentModel = DocumentSelectors.serialized(
      store.getState(),
    );
    const stringified = JSON.stringify(serializedDocumentModel);
    const blob = new Blob([stringified], { type: 'octet/stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${serializedDocumentModel.document.documentName}.que`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearDocument = (): void => {
    dispatch(DocumentActions.loadDocument(null));
  };

  const onCloseDocumentClick = (): void => {
    const docs = DocumentSelectors.document(store.getState());
    if (docs) {
      alertDialog.open({
        title: t('global.data-loss-warning-title'),
        description: t('global.data-loss-warning'),
        buttons: [
          {
            label: t('global.cancel'),
            size: QUEUE_UI_SIZE.MEDIUM,
            color: QUEUE_UI_COLOR.RED,
          },
          {
            label: t('global.confirm'),
            size: QUEUE_UI_SIZE.MEDIUM,
            color: QUEUE_UI_COLOR.BLUE,
            onClick: clearDocument,
          },
        ],
      });
      return;
    }
    clearDocument();
  };

  return (
    <div className={clsx(styles.Container)}>
      <QueueDropdown open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <QueueDropdown.Trigger className="tw-flex tw-items-center tw-p-3 tw-gap-1">
          <div className={clsx(styles.LogoContainer)}>.Qdocs</div>
          <ChevronDownIcon
            className={clsx(
              'tw-w-5',
              'tw-h-5',
              'tw-transition-all',
              'tw-duration-300',
              {
                'tw-scale-y-[1]': !isDropdownOpen,
                'tw-scale-y-[-1]': isDropdownOpen,
              },
            )}
          />
        </QueueDropdown.Trigger>

        <QueueDropdown.Content align="center">
          <QueueDropdown.Sub>
            <QueueDropdown.SubTrigger className="tw-py-2 tw-px-6">
              {t('toolbar.file')}
            </QueueDropdown.SubTrigger>
            <QueueDropdown.SubContent>
              <QueueDropdown.Item onClick={onNewDocumentClick}>
                {t('toolbar.file.new-document')}
              </QueueDropdown.Item>
              <QueueMenubar.Separator />
              <QueueDropdown.Item onClick={onOpenDocumentClick}>
                {t('toolbar.file.open-document')}
              </QueueDropdown.Item>
              <QueueDropdown.Item
                onClick={onSaveDocumentClick}
                disabled={!docId}>
                {t('toolbar.file.save-document')}
              </QueueDropdown.Item>
              <QueueDropdown.Separator />
              <QueueDropdown.Item
                onClick={onCloseDocumentClick}
                disabled={!docId}>
                {t('toolbar.file.close-document')}
              </QueueDropdown.Item>
            </QueueDropdown.SubContent>
          </QueueDropdown.Sub>

          <QueueDropdown.Sub>
            <QueueDropdown.SubTrigger className="tw-py-2 tw-px-6">
              {t('toolbar.edit')}
            </QueueDropdown.SubTrigger>
            <QueueDropdown.SubContent>
              <QueueDropdown.Item
                disabled={!docId || previous.length === 0}
                onClick={() => dispatch(HistoryActions.Undo())}>
                {t('global.undo')}
              </QueueDropdown.Item>
              <QueueDropdown.Item
                disabled={!docId || future.length === 0}
                onClick={() => dispatch(HistoryActions.Redo())}>
                {t('global.redo')}
              </QueueDropdown.Item>
              <QueueDropdown.Separator />
              <QueueDropdown.Item disabled={!docId || true}>
                {t('toolbar.edit.edit-title')}
              </QueueDropdown.Item>
              <QueueDropdown.Item disabled={!docId || true}>
                {t('toolbar.edit.page-settings')}
              </QueueDropdown.Item>
            </QueueDropdown.SubContent>
          </QueueDropdown.Sub>

          <QueueDropdown.Sub>
            <QueueDropdown.SubTrigger className="tw-py-2 tw-px-6">
              {t('toolbar.view')}
            </QueueDropdown.SubTrigger>
            <QueueDropdown.SubContent>
              <QueueDropdown.Item
                disabled={!docId}
                onClick={() =>
                  dispatch(SettingsActions.setPresentationMode(true))
                }>
                {t('toolbar.view.start-presentation-mode')}
              </QueueDropdown.Item>
              <QueueDropdown.Separator />
              <QueueDropdown.Item disabled>
                {t('toolbar.view.full-screen')}
              </QueueDropdown.Item>
            </QueueDropdown.SubContent>
          </QueueDropdown.Sub>

          <QueueDropdown.Sub>
            <QueueDropdown.SubTrigger className="tw-py-2 tw-px-6">
              {t('toolbar.extra')}
            </QueueDropdown.SubTrigger>
            <QueueDropdown.SubContent>
              <QueueDropdown.Sub>
                <QueueDropdown.SubTrigger className="tw-flex tw-items-center tw-gap-1 tw-py-2 tw-px-6">
                  {t('toolbar.extra.language')}
                  <ChevronRightIcon />
                </QueueDropdown.SubTrigger>
                <QueueDropdown.SubContent alignOffset={-5}>
                  <QueueDropdown.RadioGroup
                    value={preferences.language}
                    onValueChange={(rawValue) => {
                      const value = rawValue as SUPPORTED_LANGUAGES;
                      dispatch(
                        PreferencesActions.changeLanguage({
                          language: value,
                        }),
                      );
                    }}>
                    <QueueDropdown.RadioItem value="auto">
                      {t('toolbar.extra.language-auth')}
                      <QueueDropdown.ItemIndicator />
                    </QueueDropdown.RadioItem>
                    <QueueDropdown.RadioItem value="ko">
                      한국어
                      <QueueDropdown.ItemIndicator />
                    </QueueDropdown.RadioItem>
                    <QueueDropdown.RadioItem value="en">
                      English
                      <QueueDropdown.ItemIndicator />
                    </QueueDropdown.RadioItem>
                  </QueueDropdown.RadioGroup>
                </QueueDropdown.SubContent>
              </QueueDropdown.Sub>
            </QueueDropdown.SubContent>
          </QueueDropdown.Sub>

          <QueueDropdown.Sub>
            <QueueDropdown.SubTrigger className="tw-py-2 tw-px-6">
              {t('toolbar.help')}
            </QueueDropdown.SubTrigger>
            <QueueDropdown.SubContent>
              <QueueDropdown.Item disabled>
                {t('toolbar.help.keyboard-shortcut')}
              </QueueDropdown.Item>
              <QueueDropdown.Item disabled>
                {t('toolbar.help.web-site')}
              </QueueDropdown.Item>
              <QueueDropdown.Separator />
              <QueueDropdown.Item disabled>
                {t('toolbar.help.check-update')}
              </QueueDropdown.Item>
              <QueueDropdown.Separator />
              <QueueDropdown.Item disabled>
                {t('toolbar.help.about')}
              </QueueDropdown.Item>
            </QueueDropdown.SubContent>
          </QueueDropdown.Sub>
        </QueueDropdown.Content>
      </QueueDropdown>
      <div className={clsx(styles['title-container'])}>{docName}</div>

      {/* presentation mode */}
      {docId && (
        <QueueButton
          className={clsx(
            styles['slide-button'],
            'tw-flex tw-items-center tw-gap-1',
          )}
          onClick={onPresentationStartClick}>
          <RiPlayLine size={16} />
          <span className="tw-text-sm tw-font-medium">Present</span>
        </QueueButton>
      )}
    </div>
  );
});
