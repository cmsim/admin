import React, { FC } from 'react'
import md5 from 'md5'
import { useDispatch } from 'dva'
import { useAsyncFn } from 'react-use'
import { Input, Button, Form } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import { AuthType } from '@/types'
import { useUserToken } from '@/hooks'

export const Login: FC = () => {
  const [form] = Form.useForm()
  const history = useHistory()
  const dispatch = useDispatch()
  const { saveTokenCall, refreshToken } = useUserToken()

  const [state, onFinish] = useAsyncFn(async (values: AuthType.LoginReq) => {
    const res: any = await dispatch({
      type: 'auth/login',
      params: { username: values.username, password: md5(values.password) }
    })
    console.log(res)
    saveTokenCall(res)
    history.push('/home/overview')
  })

  if (refreshToken) history.push('/home/overview')

  return (
    <div style={{ width: '360px' }}>
      <Form form={form} name='login' onFinish={onFinish}>
        <Form.Item name='username' rules={[{ required: true, message: '请输入用户名' }]}>
          <Input prefix={<UserOutlined />} size='large' placeholder='请输入用户名' />
        </Form.Item>

        <Form.Item name='password' rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password prefix={<LockOutlined />} size='large' placeholder='请输入密码' />
        </Form.Item>

        <Form.Item>
          <Button type='primary' size='large' block htmlType='submit' loading={state.loading}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
