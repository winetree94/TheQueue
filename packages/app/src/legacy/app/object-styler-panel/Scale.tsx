import { QueueSlider } from '@legacy/components/slider/Slider';
import { QueueScale } from '@legacy/model/property';
import { useTranslation } from 'react-i18next';
import { store } from '@legacy/store';
import { HistoryActions } from '@legacy/store/history';
import { useAppDispatch, useAppSelector } from '@legacy/store/hooks';
import { ObjectActions } from '@legacy/store/object';
import { SettingSelectors } from '@legacy/store/settings';

export const ObjectStyleScale = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { scale } = useAppSelector(
    SettingSelectors.firstSelectedObjectScale,
    (prev, next) => {
      return prev.scale === next.scale;
    },
  );

  const updateStroke = (scale: Partial<QueueScale>): void => {
    const selectedObjects = SettingSelectors.selectedObjects(store.getState());
    dispatch(HistoryActions.Capture());
    dispatch(
      ObjectActions.updateObjects(
        selectedObjects.map((object) => ({
          id: object.id,
          changes: {
            scale: {
              ...object.scale,
              ...scale,
            },
          },
        })),
      ),
    );
  };

  return (
    <div className="tw-flex tw-flex-wrap tw-gap-2">
      <div className="tw-flex-1 tw-basis-full">
        <h2 className="tw-text-xs tw-font-medium tw-leading-snug">
          {t('global.scale')}
        </h2>
      </div>

      <div className="tw-flex-1 tw-shrink-0 tw-basis-full">
        <QueueSlider
          min={0}
          max={5}
          value={[scale]}
          step={0.05}
          onValueChange={([e]) =>
            updateStroke({
              scale: e,
            })
          }
        />
      </div>
    </div>
  );
};
