import { Dropdown, Space, Button, Typography, Flex, notification, Tabs, Badge } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import QueueAnim from 'rc-queue-anim';
import type { MenuProps, TabsProps } from 'antd';
import MeBookBox from '@/module/BookBox'
import React, { useEffect } from 'react';
import Lottie from 'lottie-react';
import Error from '@/assets/ErrorBook.json'
import BookGrou from './grouping'
const { Title } = Typography;

type Book = {
  title: string;
  author: string;
  readed: number;
  chapter: number;
  date: string;
  state: number;
  intr: string;
  cover: string;
  grouping: string
  id: string
}
type NotificationType = 'success' | 'info' | 'warning' | 'error';
let AllBookQueue: Book[] = []

type TabsProp = TabsProps & {
  items: Array<{
    Badge?: boolean
  }>
};
const items: TabsProp['items'] = [
  {
    key: '1',
    label: '默认',
  },
  {
    key: '2',
    label: '更新',
    Badge: true
  },
  {
    key: '3',
    label: '完结',
  },
  {
    key: '4',
    label: '本地',
  },
  {
    key: '5',
    label: '最近',
  },
];

export default function HomePage() {
  const [api, contextHolder] = notification.useNotification();
  const [SelectType, setSelectType] = React.useState<string>('1')
  const onTypeChange = (e: any) => setSelectType(e.key)
  const openNotification = (config: { type: NotificationType, message: string, description?: string }) => {
    const { type, message, description } = config
    api[type]({
      message: message,
      description: description,
      placement: 'bottomRight',
    });
  };
  document.title = '书架'

  const handleMenuClick: MenuProps['onClick'] = async (err) => {
    await err
    const grouping = err.domEvent.target.innerText
    if (grouping === '全部') {
      setBookQueue(AllBookQueue)
      return
    }
    try {
      const Newdata = AllBookQueue.filter((book) => book.grouping === grouping);
      setBookQueue(Newdata)
    } catch (error) {
      console.error(error);
    }
  };


  const [BookQueue, setBookQueue] = React.useState<Book[] | boolean>(AllBookQueue || false)

  return (
    <div style={{ minHeight: "100%",marginTop:-15 }}>
      {contextHolder}
      <QueueAnim className="queue-simple" type='left' delay={10} duration={780}>
        <div style={{
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          opacity: 1
        }} key="a"
        >
          <div key="a">
            <BookGrou />
            {/* <Dropdown menu={bookGroup}>
              <Button>
                <Space>
                  {dropdown}
                  <DownOutlined style={{ marginLeft: 30 }} />
                </Space>
              </Button>
            </Dropdown> */}
          </div>

          <Flex gap="middle" style={{marginTop:-8}}>
            {items?.map((e) => (
              <Badge dot={e?.Badge} key={e.key}>
                <Button type={(SelectType === e.key) ? "link" : "text"} onClick={() => onTypeChange(e)}>{e.label}</Button>
              </Badge>

            )
            )}
          </Flex>
        </div>
      </QueueAnim >
      <div style={{ marginTop: 12, marginInline: 12 }}>
        {(BookQueue.length > 0) ? (
          <Flex vertical={false} wrap='wrap' gap='8px 16px' >
            <QueueAnim delay={300} type='scale' >
              {BookQueue?.map((book, i) => {
                return (
                  <div key={'book-' + i}>
                    <MeBookBox bookSimpleinfo={book} />
                  </div>
                )
              })
              }
            </QueueAnim>
          </Flex>
        ) : (BookQueue ?
          <QueueAnim delay={0} type='scale' >
            <div
              key='a'

              style={
                {
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignContent: 'center',
                  flexDirection: 'column',
                  height: 'inherit',
                }
              }>
              <Lottie style={{ width: 360 }} animationData={Error} loop={2} />
              <Title level={5}>这里空空如也...</Title>
            </div>
          </QueueAnim> : null
        )
        }

      </div>
    </div >

  );
}
