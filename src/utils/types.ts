import { Model, ReducerEnhancer } from 'dva'
import { ReducersMapObject } from 'redux'

export interface DvaModel extends Model {
  reducers?: ReducersMapObject<any, any> | [ReducersMapObject, ReducerEnhancer]
}
