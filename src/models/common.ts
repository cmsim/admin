import { mcatList } from '@/services/mcat';
import type { IMcat } from '@/services/typings';
import type { DvaModel } from '@/typings/index';

export interface CommonModelState {
  mcatList: IMcat[];
}

const CommonModel: DvaModel<CommonModelState> = {
  namespace: 'common',

  state: {
    mcatList: [],
  },

  effects: {
    *mcatList({ payload }, { call, put }) {
      console.log(payload, call, put);
      yield put(call(mcatList));
    },
  },
  reducers: {
    // 启用 immer 之后
    save(state, action) {
      state.name = action.payload;
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/') {
          dispatch({
            type: 'query',
          });
        }
      });
    },
  },
};

export default CommonModel;
