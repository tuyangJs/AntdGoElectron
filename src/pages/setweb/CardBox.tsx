import { createFromIconfontCN } from "@ant-design/icons";
import { CollapseProps, Divider, Flex, Switch, theme, Typography } from "antd";
type PanelItemBase = Exclude<CollapseProps['items'], undefined>[number];
const { Text, Title, Paragraph } = Typography;
const MyIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4612952_m5z02j7ngqd.js', // 在 iconfont.cn 上生成
});

const SetBox = (e: {    //设置选项结构
    intr?: any; label: any, children: any
}) =>
(
    <Flex style={{ marginBlock: 0 }} align='center' gap="middle" justify='space-between' >
        <Text> {e.label}
            {
                e.intr ? (<Paragraph style={{ marginBottom: 0 }}>
                    <blockquote style={{ marginBottom: 0 }}>{e.intr}</blockquote>
                </Paragraph>) : null
            }

        </Text>
        {e.children}
    </Flex>
)
type pschildren = {
    label: string,
    describe?: any,
    operation?: any
    onChange?: (...args: any[]) => any;
}
interface Props extends Omit<PanelItemBase, 'children'> { //覆盖类型
    children: pschildren[]
    icon?: string
}

const mian = (items: Props[]): PanelItemBase[] => {
    const { token } = theme.useToken();
    const panelStyle: React.CSSProperties = {
        marginBottom: 24,
        background: token.colorBgContainer + 'ba',
        borderRadius: token.borderRadiusLG,
        border: 'none',
      }
    return items.map((item) => ({
        key: item.key, // 确保 key 是字符串类型
        label: <Title style={{ marginBlock: 0 }} level={5}>{item.icon ? <MyIcon type={item.icon} style={{ marginInlineEnd: 5,fontSize:'1.2em' }} /> : null}  {item.label}</Title >,
        extra: <Text>{item.extra}</Text>,
        style: panelStyle,
        children: item.children.map((child, childIndex) => (
            <>
                {(childIndex > 0) ?
                    <Divider style={{ marginBlock: 12 }} />
                    : null
                }
                <Flex key={childIndex} gap="middle" vertical>
                    <SetBox intr={child.describe} label={child.label}>
                        {child.operation || <Switch onChange={child.onChange} />}
                    </SetBox>
                </Flex>
            </>
        )),
    }));
}


export default mian;