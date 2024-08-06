import { Avatar, Button, Dropdown, Flex, MenuProps, theme, Typography } from "antd";
import MenuBut from "./mod/menuBut";
import { MoonOutlined, RightOutlined, SunOutlined } from "@ant-design/icons";
import QueueAnim from "rc-queue-anim";
import { HttpInitialize, ApiUrl, userType } from '@/Serve'
import { history } from 'umi';
import { useEffect, useState } from "react";
import React from "react";
interface Config {
    e: any;
    themeDack: boolean;
    collapsed: boolean;
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}
const option: MenuProps['items'] = [
    {
        key: '1',
        label: 'openDevTools',
        onClick: () => Hive.opendev()
    },
];

const { Title } = Typography;
const Avataron = (e) => {
    console.log(e);

}
function Head({ e, themeDack, collapsed, setCollapsed }: Config) {
    const { HttpApi, SetCookis } = HttpInitialize()
    const [User, SetUser] = useState<userType>();
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

            SetCookis('')
            history.push('/')
        });
    }, [])
    const Avataritems: MenuProps['items'] = [
        {
            key: 0,
            label: '账户设置',
            onClick: () => {
                history.push('/uers/me/')
            }
        }, {
            type: 'divider'
        },
        {
            key: 1,
            label: '退出登录',
            danger: true,
            onClick: () => {
                SetCookis('')
                history.push('/')
            }
        },
    ]
    return (
        <Flex
            gap="middle"
            align='center'
            justify='space-between'
            style={{
                paddingBlock: 8,
            }}>
            <MenuBut collapsed={collapsed} setCollapsed={setCollapsed} />
            <Title level={5} style={{ margin: 0, marginInline: 25, marginInlineStart: 38 }}>
                {// @ts-ignore
                    e.matchMenuKeys.map((hurl: string, i: number) => {// @ts-ignore
                        const isLastItem = i === e.matchMenuKeys.length - 1;
                        return (
                            <span
                                key={hurl}
                            >
                                {// @ts-ignore
                                    e.matchMenus[i].name}
                                {!isLastItem && <RightOutlined className='RightOutlinedTX' />}
                            </span>
                        );
                    })
                }
            </Title>
            <div className='hmsg' >
                <Dropdown key='a' menu={{ items: option }} placement="bottom" arrow={true}>
                    <Button type="text" className='no-drag' >选项</Button>
                </Dropdown>
                <QueueAnim delay={300} appear={false} component='span' ease={['easeOutQuart', 'easeInOutQuart']} style={{ display: 'flex', width: 14 }}>
                    {
                        themeDack ? <MoonOutlined key='a' /> : <SunOutlined key='b' />
                    }
                </QueueAnim>
                <Dropdown
                    menu={{ items: Avataritems }}
                    arrow>
                    <Avatar className="no-drag" style={{ marginInlineStart: 8 }} src={User?.avatar}>
                        {User?.username}
                    </Avatar>
                </Dropdown>
                <div className='mainBut' />
            </div>
        </Flex>
    )
}

export default Head