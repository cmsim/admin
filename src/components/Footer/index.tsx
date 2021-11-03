import { DefaultFooter } from '@ant-design/pro-layout';
export default () => {
  const defaultMessage = 'cms.im';
  const currentYear = new Date().getFullYear();
  return <DefaultFooter copyright={`${currentYear} ${defaultMessage}`} links={[]} />;
};
