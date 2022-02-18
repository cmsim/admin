import { useEffect, useMemo, useRef } from 'react'
import { message, Row, Col, Button } from 'antd'
import type { ProFormInstance } from '@ant-design/pro-form'
import ProForm, { ProFormText, ProFormSelect, ProFormTextArea, ProFormDigit } from '@ant-design/pro-form'
import { PageContainer } from '@ant-design/pro-layout'
import { useModel, useHistory, Link, useParams } from 'umi'
import { sidObj } from '@/utils'
import type { IList } from '@/services/typings'
import { listAdd } from '@/services/list'

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 10 }
}

const TypelistEdit = () => {
  const formRef = useRef<ProFormInstance>()
  const [form] = ProForm.useForm()
  const history = useHistory()
  const { id } = useParams<{ id: string }>()
  const { categoryList, getCategoryList } = useModel('useList')
  const { categoryDetail, getCategoryDetail } = useModel('useListDetail')
  useEffect(() => {
    getCategoryList()
  }, [getCategoryList])

  console.log('categoryDetail', categoryDetail)

  useEffect(() => {
    if (id) {
      getCategoryDetail(id)
    }
  }, [getCategoryDetail, id])

  useEffect(() => {
    form.resetFields()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryDetail])

  const onFinish = (values: IList) => {
    listAdd({ ...values, id }).then(res => {
      if (res.status === 200) {
        if (id) {
          message.success('修改成功')
        } else {
          message.success('添加成功')
        }
        history.push('/config/typelist')
      } else {
        message.error(res.message)
      }
    })
  }

  const getCategoryListFormat = useMemo(() => {
    const obj: { label: string; value: string | number }[] = [{ label: '无', value: 0 }]
    categoryList.forEach(item => {
      obj.push({
        label: item.name!,
        value: item.id!
      })
    })
    return obj
  }, [categoryList])

  return (
    <PageContainer>
      <ProForm<IList>
        form={form}
        title="新建表单"
        formRef={formRef}
        initialValues={{ ...categoryDetail }}
        {...layout}
        submitter={{
          render: props => {
            return [
              <Row>
                <Col span={4} />
                <Col span={20}>
                  <Button type="primary" htmlType="submit" onClick={() => props?.onSubmit?.()}>
                    提交
                  </Button>
                  <Link to="/config/typelist">
                    <Button style={{ marginLeft: 20 }}>返回列表</Button>
                  </Link>
                </Col>
              </Row>
            ]
          }
        }}
        onFinish={async values => {
          console.log(values)
          onFinish(values)
          return true
        }}
        layout="horizontal"
        style={{ backgroundColor: '#fff', padding: 16 }}
      >
        <ProFormText width="md" name="name" label="名称" placeholder="名称" rules={[{ required: true }]} />
        <ProFormSelect name="pid" width="md" label="父类" options={getCategoryListFormat} placeholder="父类" rules={[{ required: true }]} />
        <ProFormSelect name="sid" width="md" label="模型" options={sidObj} placeholder="模型" rules={[{ required: true }]} />
        <ProFormText width="md" name="dir" label="目录" placeholder="目录" />
        <ProFormDigit width="md" name="rank" label="排序" placeholder="排序" />
        <ProFormText width="md" name="seo_title" label="标题" placeholder="标题" />
        <ProFormTextArea width="md" name="seo_keywords" label="关键词" placeholder="关键词" />
        <ProFormTextArea width="md" name="seo_description" label="描述" placeholder="描述" />
      </ProForm>
    </PageContainer>
  )
}

export default TypelistEdit
