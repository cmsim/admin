import { subjectDetail, subjectList } from '@/services/subject'
import { ISubject } from '@/services/typings'
import { ModalForm, ProCard } from '@ant-design/pro-components'
import { Button, Input, List, Skeleton, Tag } from 'antd'
import { FC, useCallback, useEffect, useState } from 'react'

const { Search } = Input

const Association: FC<ISubject & { visible: boolean; setVisible: (visible: boolean) => void }> = props => {
  const { visible, setVisible, id, name } = props
  const [data, setData] = useState<ISubject[]>()
  const [detail, setDetail] = useState<ISubject>()
  const [initLoading, setInitLoading] = useState(true)
  const [wd, setWd] = useState('')
  const [page, setPage] = useState(1)
  const getList = useCallback(async (params?: { wd: string }, current?: number) => {
    const param = {
      current,
      pageSize: 10,
      filter: JSON.stringify(params)
    }
    const res = await subjectList(param)
    const list = res.data?.list || []
    setInitLoading(false)
    if (current! > 1) {
      setData([...data!, ...list])
      window.dispatchEvent(new Event('resize'))
    } else {
      setData(list)
    }
  }, [])

  const getDetail = useCallback(async () => {
    if (id) {
      const subject = await subjectDetail({ id })
      setDetail(subject.data)
    }
  }, [id])

  useEffect(() => {
    getList()
  }, [])

  useEffect(() => {
    getDetail()
  }, [id])

  const onLoadMore = () => {
    const current = page + 1
    setPage(current)
    getList({ wd }, current)
  }

  const loadMore = !initLoading ? (
    <div
      style={{
        textAlign: 'center',
        marginTop: 12,
        height: 32,
        lineHeight: '32px'
      }}
    >
      <Button onClick={onLoadMore}>loading more</Button>
    </div>
  ) : null

  const onAdd = (item: ISubject) => {}

  const onDel = (item: ISubject) => {}

  return (
    <ModalForm visible={visible} title={name} submitter={false} onVisibleChange={setVisible}>
      <ProCard title="关联" style={{ marginTop: -10 }} size="small" bordered>
        {detail?.associate1?.map(item => (
          <Tag key={item.id} onClose={() => onDel(item)} closable>
            {item.name}
          </Tag>
        ))}
      </ProCard>
      <ProCard title="被关联" style={{ marginTop: 10 }} size="small" bordered>
        {detail?.associate2?.map(item => (
          <Tag key={item.id} onClose={() => onDel(item)} closable>
            {item.name}
          </Tag>
        ))}
      </ProCard>

      <Search
        style={{ marginTop: 10 }}
        placeholder="请输入名称"
        onSearch={wd => {
          getList({ wd })
          setWd(wd)
        }}
        enterButton
      />
      <List
        className="demo-loadmore-list"
        loading={initLoading}
        itemLayout="horizontal"
        loadMore={loadMore}
        dataSource={data}
        renderItem={item => (
          <List.Item actions={[<a key="list-loadmore-edit">关联</a>]}>
            <Skeleton avatar title={false} loading={initLoading} active>
              <List.Item.Meta title={item.name} />
            </Skeleton>
          </List.Item>
        )}
      />
    </ModalForm>
  )
}

export default Association
