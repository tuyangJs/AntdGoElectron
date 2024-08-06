import React, { useEffect, useState } from 'react';
import { Anchor, Button, Card, version, Flex, Skeleton, Typography, Descriptions } from 'antd';
const { Text } = Typography;
import { ReactComponent as Logo } from '@/assets/logo.svg'
import QueueAnim from 'rc-queue-anim';
import Icon from '@ant-design/icons/lib/components/Icon';
import { AntDesignOutlined, ChromeOutlined } from '@ant-design/icons';
const { Meta } = Card
const { chrome, node, electron } = Hive.versions()
const { version: mainVrsion, windowsVersion } = Hive.version
const App: React.FC = () => {
  const [CarLet, setCarLet] = useState('')
  const [NewV, setNewV] = useState('1.1.0.6')
  const [NewUrl, setNewUrl] = useState('')
  const [isNew, setisNew] = useState(true)
  useEffect(() => {
    rqV()
  }, [])
  useEffect(() => {
    setisNew(NewV === mainVrsion)
  }, [NewV])
  function rqV(e?: any) {
    if (!isNew && e) {
      open(NewUrl)
    } else {
      setNewV('');
      setTimeout(() => setNewV('1.1.0.6'), 2000)
    }
  }

  const vitems = [
    {
      key: '1',
      label: (<><ChromeOutlined /> Chrome </>),
      children: chrome,
    },
    {
      key: '2',
      label: 'Nodejs',
      children: node,
    },
    {
      key: '3',
      label: 'React',
      children: React.version,
    },
    {
      key: '4',
      label: (<><AntDesignOutlined /> Ant Design </>) ,
      children: version,
    },
    {
      key: '5',
      label: 'Electron',
      children: electron,
    },
  ]
  return (
    <QueueAnim component='div' delay={1} duration={800} type='left'>
      <Card bordered={false} style={{ width: '100%' }} key='a'>
        <Flex gap="middle" flex='row' justify='space-between'>
          <Meta
            style={{ width: 260, alignItems: 'center' }}
            avatar={<Logo style={{ width: 62 }} />}
            title="笔耕写作"
            description={<> 程序版本：{mainVrsion} </>}
          />
          <>
            <Flex gap="middle" vertical>
              <Button
                loading={NewV ? false : true}
                danger={!isNew}
                onClick={rqV}
              >{!NewV ? '正在检测' : isNew ? '检测更新' : '下载更新'}</Button>
              <Text type={isNew ? 'default' : 'warning'}>
                SiriusPro {isNew ? '已是最新' : NewV ? '需要更新' : '正在检查更新...'}
              </Text>
            </Flex>
          </>
        </Flex>
      </Card>
      <Typography style={{ marginTop: 10, padding: 8 }} key='b'>
        <Descriptions title="技术栈版本" bordered items={vitems} />

      </Typography>
    </QueueAnim>
  )
}

export default App;