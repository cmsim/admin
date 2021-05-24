declare module '*.css'
declare module '*.scss'
declare module 'dva-loading'
declare module 'dva-immer'

declare module '*.less' {
  const classes: { [className: string]: any | undefined }
  export default classes
}
