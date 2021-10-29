import type { Effect, ImmerReducer, Subscription } from 'umi';
import type { Model, ReducerEnhancer } from 'dva';
import type { ReducersMapObject } from 'redux';

export interface DvaModelType<T> {
  namespace: string;
  state: T;
  effects: {
    query: Effect;
  };
  reducers: {
    // save: Reducer<IndexModelState>;
    // 启用 immer 之后
    save: ImmerReducer<T>;
  };
  subscriptions: { setup: Subscription };
}

export interface DvaModel<T> extends Model {
  state?: T;
  reducers?: ReducersMapObject<any, any> | [ReducersMapObject, ReducerEnhancer];
}
