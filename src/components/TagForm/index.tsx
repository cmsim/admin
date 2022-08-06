import { ModalForm } from '@ant-design/pro-components'
import { Button, List, Tag } from 'antd'
import { FC, useEffect } from 'react'

type ValueType = { id: number; name: string }

interface ITagFormProps {
  value?: ValueType[]
  onChange?: (value: ValueType) => void
  list?: any[]
}

const TagForm: FC<ITagFormProps> = props => {
  const { value, onChange, list } = props
  useEffect(() => {
    console.log(value, 'tag')
  }, [value])

  return (
    <>
      {value?.map(item => (
        <Tag closable key={item.id}>
          {item.name}
        </Tag>
      ))}
      <ModalForm title="关联剧集" trigger={<Button type="link">添加</Button>} submitter={false}>
        <List
          itemLayout="horizontal"
          dataSource={list}
          renderItem={item => (
            <List.Item actions={[<a key="list-loadmore-edit">关联</a>]}>
              <List.Item.Meta title={item.name} />
            </List.Item>
          )}
        />
      </ModalForm>
    </>
  )
}

export default TagForm
