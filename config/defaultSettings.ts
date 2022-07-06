import { Settings as LayoutSettings } from '@ant-design/pro-components'

const Settings: LayoutSettings & {
  pwa?: boolean
  logo?: string
} = {
  navTheme: 'light',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixSiderbar: true,
  headerHeight: 56,
  primaryColor: '#1677FF',
  splitMenus: true,
  fixedHeader: true,
  colorWeak: false,
  title: 'Cang Wang Ge',
  pwa: false,
  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  iconfontUrl: ''
}

export default Settings
