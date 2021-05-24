import React, { FC } from 'react'
import md5 from 'md5'
import { useDispatch } from 'dva'
import { useAsyncFn } from 'react-use'
import { Input, Button, Form, message } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { AuthType } from '@/types'

export const Init: FC = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()

  const [state, onFinish] = useAsyncFn(async (values: AuthType.InitReq) => {
    const res = await dispatch({
      type: 'auth/init',
      params: {
        username: values.username,
        password: md5(values.password),
        email: values.email,
        isAdmin: 1
      }
    })

    if (res) {
      window.location.reload()
    }
    message.success('初始化用户成功，请登录')
  })
  return (
    <div style={{ width: '360px' }}>
      <Form form={form} name='login' onFinish={onFinish}>
        <Form.Item name='email' rules={[{ required: true, message: '请输入邮箱' }]}>
          <Input prefix={<MailOutlined />} size='large' placeholder='请输入邮箱' />
        </Form.Item>

        <Form.Item name='username' rules={[{ required: true, message: '请输入用户名' }]}>
          <Input prefix={<UserOutlined />} size='large' placeholder='请输入用户名' />
        </Form.Item>

        <Form.Item name='password' rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password prefix={<LockOutlined />} size='large' placeholder='请输入密码' />
        </Form.Item>

        <Form.Item>
          <Button type='primary' size='large' block htmlType='submit' loading={state.loading}>
            初始化
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
