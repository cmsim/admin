import { Col, Form, Input, Row, Select } from 'antd'
import { DatePicker } from 'components/AntComps'
import React, { FC } from 'react'
import dayjs from 'dayjs'

const Overview: FC = () => {
  return (
    <Form>
      <Row>
        <Col span={4}>
          <Form.Item label={'时间组件'}>
            <DatePicker defaultValue={dayjs()} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label={'选择框组件'}>
            <Select placeholder={'请选择'} />
          </Form.Item>
        </Col>
        <Col span={4} offset={1}>
          <Form.Item label={'Input组件'}>
            <Input placeholder={'请输入'} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

export default Overview
