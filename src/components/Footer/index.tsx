import { DefaultFooter } from '@ant-design/pro-layout';
export default () => {
  const currentYear = new Date().getFullYear();
  return <DefaultFooter copyright={`${currentYear} CWG`} links={[]} />;
};
