import type { DvaModel } from '@/typings/index';

export interface SubjectModelState {
  name: string;
}

const SubjectModel: DvaModel<SubjectModelState> = {
  namespace: 'subject',

  state: {
    name: '',
  },

  effects: {
    *query({ payload }, { call, put }) {
      console.log(payload, call, put);
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

export default SubjectModel;
