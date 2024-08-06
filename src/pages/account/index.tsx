import React, { useEffect, useState } from 'react';
import { CaretRightOutlined, EditOutlined, EllipsisOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { Image, Card, Upload, Collapse, Flex } from 'antd';
import { HttpInitialize, ApiUrl, userType } from '@/Serve'
import { useLocalStorageState } from 'ahooks';
import meop from './meop'
const { Meta } = Card;

const App: React.FC = () => {
    const [User, SetUser] = useState<userType>();
    const { HttpApi } = HttpInitialize()
    const [exPosition, setexPosition] = useLocalStorageState('accountSet', {
        defaultValue: ['sync']
    })
    useEffect(() => {
        HttpApi({
            route: 'users/me?populate=avatar',
            isToken: true
        }).then(response => {
            SetUser({
                email: response.data.email,
                username: response.data.username,
                id: response.data.id,
                avatar: ApiUrl + response.data?.avatar?.url
            })
        }).catch((error) => {
            console.log(error);
        });
    }, [])
    return (
        <Flex vertical gap={16}>
            <Card
                style={{ width: '100%' }}
                actions={[
                    <SettingOutlined key="setting" />,
                    <EditOutlined key="edit" />,
                    <EllipsisOutlined key="ellipsis" />,
                ]}
            >
                <Meta
                    avatar={<>
                        <Image
                            wrapperStyle={{ borderRadius: '50%' }}
                            style={{ height: 64, borderRadius: '50%' }}
                            src={User?.avatar} />
                    </>}
                    title={User?.username}
                    description={User?.email} />
            </Card>
            <Collapse
                bordered={false}
                expandIconPosition='end'
                defaultActiveKey={exPosition}
                onChange={e => setexPosition(e as string[])}
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                style={{ background: '#00000000', 'maxWidth': 1280, width: '100%' }}
                items={meop()} />
                </Flex>
    );
}

export default App;