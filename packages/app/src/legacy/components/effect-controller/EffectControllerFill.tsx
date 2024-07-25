import { QueueSlider } from '@legacy/components/slider/Slider';
import { FillEffect, OBJECT_EFFECT_TYPE } from '@legacy/model/effect';
import { ChangeEvent, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import {
  EffectActions,
  EffectSelectors,
  getEffectEntityKey,
} from '@legacy/store/effect';
import { HistoryActions } from '@legacy/store/history';
import { useAppDispatch, useAppSelector } from '@legacy/store/hooks';
import { SettingSelectors } from '@legacy/store/settings';

export const EffectControllerFill = (): ReactElement => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const currentQueueIndex = useAppSelector(SettingSelectors.queueIndex);
  const selectedObjects = useAppSelector(SettingSelectors.selectedObjects);
  // need remove type assertion (?)
  const effectsOfSelectedObjects = useAppSelector((state) =>
    EffectSelectors.byIds(
      state,
      selectedObjects.map((object) =>
        getEffectEntityKey({
          index: currentQueueIndex,
          objectId: object.id,
          type: OBJECT_EFFECT_TYPE.FILL,
        }),
      ),
    ),
  ) as FillEffect[];

  const [firstFillEffect] = effectsOfSelectedObjects;

  const updateSelectedObjectsEffect = (
    nextFillEffectProp: Partial<FillEffect['prop']>,
  ): void => {
    dispatch(HistoryActions.Capture());
    dispatch(
      EffectActions.upsertEffects(
        effectsOfSelectedObjects.map((effect) => ({
          ...effect,
          prop: {
            ...effect.prop,
            ...nextFillEffectProp,
          },
        })),
      ),
    );
  };

  const handleCurrentColorChange = (e: ChangeEvent<HTMLInputElement>): void => {
    updateSelectedObjectsEffect({
      color: e.target.value,
    });
  };

  const handleCurrentOpacityChange = (
    opacityValue: number | number[] | string,
  ): void => {
    let opacity = 1;

    if (typeof opacityValue === 'number') {
      opacity = opacityValue;
    }

    if (Array.isArray(opacityValue)) {
      opacity = opacityValue[0];
    }

    if (typeof opacityValue === 'string') {
      opacity = parseFloat(opacityValue);
    }

    updateSelectedObjectsEffect({ opacity });
  };

  return (
    <div>
      <p className="text-sm">{t('effect.fill')}</p>
      <div>
        <input
          type="color"
          value={firstFillEffect.prop.color}
          onChange={handleCurrentColorChange}
        />
      </div>
      <p className="tw-text-sm">{t('global.opacity')}</p>
      <div className="tw-flex tw-items-center tw-gap-2">
        <div className="tw-w-5/12">
          <input
            className="tw-w-full"
            type="number"
            step={0.1}
            value={firstFillEffect.prop.opacity}
            onChange={(e): void => {
              handleCurrentOpacityChange(e.target.value);
            }}
          />
        </div>
        <div className="tw-flex tw-items-center tw-w-full">
          <QueueSlider
            min={0}
            max={1}
            step={0.1}
            value={[firstFillEffect.prop.opacity]}
            onValueChange={(value): void => {
              handleCurrentOpacityChange(value);
            }}
          />
        </div>
      </div>
    </div>
  );
};
