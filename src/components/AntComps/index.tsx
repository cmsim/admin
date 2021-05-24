/**
 * 引入DatePicker等组件会报SyntaxError: Cannot use import statement outside a module错误
 * antd日期选择等控件使用import { DatePicker } from '@/components/AntComps'方式引入
 * 暂时使用该方式，后期再研究修复
 */
export { default as Calendar } from './Calendar'
export { default as DatePicker } from './DatePicker'
export { default as TimePicker } from './TimePicker'
