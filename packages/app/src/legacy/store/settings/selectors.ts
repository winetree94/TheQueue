import { RootState } from '@legacy/store';
import { createSelector } from '@reduxjs/toolkit';
import { ObjectSelectors } from '@legacy/store/object/selectors';
import { QueueDocumentSettings } from './model';
import { EffectSelectors } from '@legacy/store/effect/selectors';
import { QueueObjectType } from '@legacy/model/object';
import {
  OBJECT_EFFECT_TYPE,
  OBJECT_EFFECT_TYPES,
  QueueEffectType,
} from '@legacy/model/effect';
import {
  EFFECT_SUPPORTED_MAP,
  supportFade,
  supportFill,
  supportRect,
  supportRotation,
  supportScale,
  supportStroke,
  supportText,
} from '@legacy/model/support';
import { TimeLineTrack } from '@legacy/model/timeline/timeline';

const selectSelf = (state: RootState): QueueDocumentSettings => state.settings;

const pageId = createSelector(selectSelf, (settings) => settings.pageId);

const queueIndex = createSelector(selectSelf, (state) => state.queueIndex);

const queuePosition = createSelector(
  selectSelf,
  (state) => state.queuePosition,
);

const queueStart = createSelector(selectSelf, (state) => state.queueStart);

const autoPlay = createSelector(selectSelf, (settings) => settings.autoPlay);

const scale = createSelector(selectSelf, (settings) => settings.scale);

const leftPanelOpened = createSelector(
  selectSelf,
  (settings) => settings.leftPanelOpened,
);

const bottomPanelOpened = createSelector(
  selectSelf,
  (settings) => settings.bottomPanelOpened,
);

const selectionMode = createSelector(
  selectSelf,
  (settings) => settings.selectionMode,
);

const presentationMode = createSelector(
  selectSelf,
  (settings) => settings.presentationMode,
);

const selectedObjectIds = createSelector(
  selectSelf,
  (settings) => settings.selectedObjectIds,
);

const selectedObjects = createSelector(
  [selectSelf, ObjectSelectors.entities],
  (settings, objectEntities) =>
    settings.selectedObjectIds.map((id) => objectEntities[id]),
);

const firstSelectedObject = createSelector(
  selectedObjects,
  (objects) => objects[0],
);

const firstSelectedObjectEffects = createSelector(
  [firstSelectedObject, EffectSelectors.effectsByObjectId],
  (object, effects) => {
    return effects[object.id];
  },
);

const firstSelectedObjectEffectTypes = createSelector(
  [firstSelectedObjectEffects],
  (effects) => {
    return effects.map((effect) => effect.type);
  },
);

const firstSelectedObjectId = createSelector(
  selectedObjectIds,
  (selectedObjectIds) => selectedObjectIds[0],
);

const firstSelectedObjectType = createSelector(
  [selectedObjects],
  (selectedObjects) => selectedObjects[0]?.type,
);

const firstSelectedObjectRect = createSelector(
  [selectedObjects],
  (selectedObjects) => selectedObjects[0]?.rect,
);

const firstSelectedObjectText = createSelector(
  [selectedObjects],
  (selectedObjects) => selectedObjects[0]?.text,
);

const firstSelectedObjectFill = createSelector(
  [selectedObjects],
  (selectedObjects) => {
    return supportFill(selectedObjects[0])
      ? selectedObjects[0]?.fill
      : undefined;
  },
);

const firstSelectedObjectScale = createSelector(
  [selectedObjects],
  (selectedObjects) => {
    return supportScale(selectedObjects[0])
      ? selectedObjects[0]?.scale
      : undefined;
  },
);

const firstSelectedObjectRotation = createSelector(
  [selectedObjects],
  (selectedObjects) => {
    return supportRotation(selectedObjects[0])
      ? selectedObjects[0]?.rotate
      : undefined;
  },
);

const firstSelectedObjectStroke = createSelector(
  [selectedObjects],
  (selectedObjects) => {
    return supportStroke(selectedObjects[0])
      ? selectedObjects[0]?.stroke
      : undefined;
  },
);

const firstSelectedObjectFade = createSelector(
  [selectedObjects],
  (selectedObjects) => {
    return supportFade(selectedObjects[0])
      ? selectedObjects[0]?.fade
      : undefined;
  },
);

const hasSelectedObject = createSelector(
  selectedObjectIds,
  (selectedObjectIds) => selectedObjectIds.length > 0,
);

const autoPlayRepeat = createSelector(
  selectSelf,
  (settings) => settings.autoPlayRepeat,
);

const pageObjects = createSelector(
  [selectSelf, ObjectSelectors.all],
  (settings, objects) =>
    objects.filter((object) => object.pageId === settings.pageId),
);

const pageObjectIds = createSelector(
  [selectSelf, ObjectSelectors.byPageId],
  (settings, objects) => {
    return objects[settings.pageId]?.map(({ id }) => id) || [];
  },
);

/**
 * @description
 * 현재 Page, 현재 Index 의 오브젝트의 상태(크기, 좌표 등)를 조회
 * 에디터에서 현재 위치의 오브젝트들을 화면에 표시하기 위해 사용
 */
const allEffectedObjects = createSelector(
  [pageId, queueIndex, ObjectSelectors.all, EffectSelectors.effectsByObjectId],
  (pageId, queueIndex, objects, effects) => {
    return objects
      .filter((object) => object.pageId === pageId)
      .reduce<QueueObjectType[]>((result, current) => {
        const object = { ...current };
        (effects[current.id] || [])
          .filter(({ index }) => index <= queueIndex)
          .filter(
            (effect) =>
              effect.type !== OBJECT_EFFECT_TYPE.CREATE &&
              effect.type !== OBJECT_EFFECT_TYPE.REMOVE,
          )
          .forEach((effect) => {
            if (
              effect.type === OBJECT_EFFECT_TYPE.RECT &&
              supportRect(object)
            ) {
              object.rect = effect.prop;
            }
            if (
              effect.type === OBJECT_EFFECT_TYPE.FADE &&
              supportFade(object)
            ) {
              object.fade = effect.prop;
            }
            if (
              effect.type === OBJECT_EFFECT_TYPE.FILL &&
              supportFill(object)
            ) {
              object.fill = effect.prop;
            }
            if (
              effect.type === OBJECT_EFFECT_TYPE.STROKE &&
              supportStroke(object)
            ) {
              object.stroke = effect.prop;
            }
            if (
              effect.type === OBJECT_EFFECT_TYPE.ROTATE &&
              supportRotation(object)
            ) {
              object.rotate = effect.prop;
            }
            if (
              effect.type === OBJECT_EFFECT_TYPE.SCALE &&
              supportScale(object)
            ) {
              object.scale = effect.prop;
            }
            if (
              effect.type === OBJECT_EFFECT_TYPE.TEXT &&
              supportText(object)
            ) {
              object.text = effect.prop;
            }
          });
        result.push(object);
        return result;
      }, []);
  },
);

/**
 * @description
 * allEffectedObjects 를 Map 형태로 변환
 */
const allEffectedObjectsMap = createSelector(
  [allEffectedObjects],
  (objects) => {
    return objects.reduce<Record<string, QueueObjectType>>((result, object) => {
      result[object.id] = object;
      return result;
    }, {});
  },
);

const timelineData = createSelector(
  [
    ObjectSelectors.all,
    EffectSelectors.effectsByObjectId,
    selectedObjectIds,
    pageId,
  ],
  (objects, allEffects, selectedObjectIds, pageId) => {
    return objects
      .filter((value) => value.pageId === pageId)
      .map((object) => {
        const effects = allEffects[object.id];
        const filtered = effects.map((effect) => effect.index);
        const queueList = effects.reduce((acc, effect) => {
          if (!acc.includes(effect.index)) {
            acc.push(effect.index);
          }
          return acc;
        }, [] as number[]);

        return {
          objectId: object.id,
          startQueueIndex: filtered[0],
          endQueueIndex: filtered[filtered.length - 1],
          uniqueColor: object.uniqueColor,
          selectedTrack: selectedObjectIds.includes(object.id),
          queueList,
        } as TimeLineTrack;
      });
  },
);

const currentVisibleObjects = createSelector(
  [queueIndex, pageObjects, EffectSelectors.effectsByObjectId],
  (queueIndex, objects, effects) => {
    return objects.filter((object) => {
      const createEffect = (effects[object.id] || []).find(
        (effect) => effect.type === OBJECT_EFFECT_TYPE.CREATE,
      );
      const removeEffect = (effects[object.id] || []).find(
        (effect) => effect.type === OBJECT_EFFECT_TYPE.REMOVE,
      );
      if (!createEffect) {
        return false;
      }
      if (queueIndex < createEffect.index) {
        return false;
      }
      if (removeEffect && queueIndex > removeEffect.index) {
        return false;
      }
      return true;
    });
  },
);

const currentPageEffects = createSelector(
  [EffectSelectors.all, pageId],
  (effects, pageId) => {
    return effects.filter((effect) => effect.pageId === pageId);
  },
);

const currentPageQueueIndexEffects = createSelector(
  [currentPageEffects, queueIndex],
  (effects, queueIndex) => {
    return effects.filter((effect) => effect.index === queueIndex);
  },
);

const currentPageQueueIndexEffectsByObjectId = createSelector(
  [currentPageQueueIndexEffects],
  (effects) => {
    return effects.reduce<Record<string, QueueEffectType[]>>(
      (result, effect) => {
        if (!result[effect.objectId]) {
          result[effect.objectId] = [];
        }
        result[effect.objectId].push(effect);
        return result;
      },
      {},
    );
  },
);

const currentPageQueueIndexMaxDuration = createSelector(
  [currentPageQueueIndexEffects, queuePosition],
  (effects) => {
    return effects.reduce((acc, effect) => {
      if (acc < effect.duration + effect.delay) {
        acc = effect.duration + effect.delay;
      }
      return acc;
    }, 0);
  },
);

const currentPageMaxEffectIndex = createSelector(
  [currentPageEffects],
  (effects) => {
    return effects.reduce((acc, effect) => {
      if (acc < effect.index) {
        acc = effect.index;
      }
      return acc;
    }, 0);
  },
);

const currentPageNextQueueIndexMaxDuration = createSelector(
  [currentPageEffects, queueIndex, queuePosition],
  (effects, queueIndex, queuePosition) => {
    const effectsMap = effects.reduce<Record<string, QueueEffectType[]>>(
      (result, effect) => {
        if (!result[effect.index]) {
          result[effect.index] = [];
        }
        result[effect.index].push(effect);
        return result;
      },
      {},
    );

    const targetIndex =
      queuePosition === 'forward' ? queueIndex : queueIndex + 1;

    return (effectsMap[targetIndex] || []).reduce((acc, effect) => {
      if (acc < effect.duration + effect.delay) {
        acc = effect.duration + effect.delay;
      }
      return acc;
    }, 0);
  },
);

/**
 * @description
 * 선택된 오브젝트들에서 공통적으로 지원하는 이펙트 목록을 조회
 */
const selectedObjectsSupportedEffectTypes = createSelector(
  [selectedObjects],
  (objects) => {
    return Object.values(OBJECT_EFFECT_TYPE).reduce<{
      [key in OBJECT_EFFECT_TYPES]: boolean;
    }>(
      (result, effectType) => {
        const supported = objects.every(
          (object) => !!EFFECT_SUPPORTED_MAP[effectType][object.type],
        );
        result[effectType] = supported;
        return result;
      },
      {
        [OBJECT_EFFECT_TYPE.CREATE]: false,
        [OBJECT_EFFECT_TYPE.REMOVE]: false,
        [OBJECT_EFFECT_TYPE.RECT]: false,
        [OBJECT_EFFECT_TYPE.FADE]: false,
        [OBJECT_EFFECT_TYPE.FILL]: false,
        [OBJECT_EFFECT_TYPE.STROKE]: false,
        [OBJECT_EFFECT_TYPE.ROTATE]: false,
        [OBJECT_EFFECT_TYPE.SCALE]: false,
        [OBJECT_EFFECT_TYPE.TEXT]: false,
      },
    );
  },
);

export const SettingSelectors = {
  pageId,
  queueIndex,
  autoPlayRepeat,
  pageObjects,
  pageObjectIds,
  hasSelectedObject,
  firstSelectedObject,
  firstSelectedObjectEffects,
  firstSelectedObjectEffectTypes,
  firstSelectedObjectId,
  firstSelectedObjectType,
  firstSelectedObjectRect,
  firstSelectedObjectText,
  firstSelectedObjectFill,
  firstSelectedObjectScale,
  firstSelectedObjectRotation,
  firstSelectedObjectStroke,
  firstSelectedObjectFade,
  selectedObjects,
  selectedObjectIds,
  selectionMode,
  scale,
  queuePosition,
  presentationMode,
  queueStart,
  autoPlay,
  leftPanelOpened,
  bottomPanelOpened,
  allEffectedObjects,
  allEffectedObjectsMap,
  timelineData,
  currentVisibleObjects,
  currentPageEffects,
  currentPageMaxEffectIndex,
  currentPageQueueIndexEffects,
  currentPageQueueIndexEffectsByObjectId,
  currentPageNextQueueIndexMaxDuration,
  currentPageQueueIndexMaxDuration,
  selectedObjectsSupportedEffectTypes,
};
