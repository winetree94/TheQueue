import { createAction } from '@reduxjs/toolkit';
import { QueueDocument } from 'model/document';

/**
 * @description
 * 이 액션 발생 시 모든 스토어가 초기화됨, 최초 문서 로딩시에만 사용되어야 함
 * 문서 로딩 이후의 동작은 각각의 독립적인 액션을 사용할 것
 */
export const loadDocument = createAction<QueueDocument | null>('Document/setDocument');