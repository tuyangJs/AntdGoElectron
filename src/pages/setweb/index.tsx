import { FC } from 'react';
import { Collapse, Flex } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { useLocalStorageState, useUpdateEffect } from 'ahooks';
import { useOutletContext } from 'umi';
import setop from './setop'
import { Datainitial, TypeSetopData } from '@/module/SetopData';
import QueueAnim from 'rc-queue-anim';
const Set: FC = () => {
  // 使用自定义 Hook 获取全局状态和更新函数

  const layoutContext: any = useOutletContext();
  const MainsetSetdata = layoutContext.setSetdata;
  const { setData, SetsetData } = Datainitial()

  const [exPosition, setexPosition] = useLocalStorageState('SetexPosition', {
    defaultValue: ['theme']
  })
  useUpdateEffect(() => { //监听数据
    MainsetSetdata(setData)
  }, [setData])
  return (
    <QueueAnim component='div' delay={1} duration={800} type='left'>
    <Flex vertical align='center' key='a'>
      <Collapse
        bordered={false}
        expandIconPosition='end'
        defaultActiveKey={exPosition}
        onChange={e => setexPosition(e as string[])}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        style={{ background: '#00000000', 'maxWidth': 1280, width: '100%' }}
        items={setop(layoutContext, setData as TypeSetopData, SetsetData)} />
    </Flex>
</QueueAnim>
  );
};

export default Set;