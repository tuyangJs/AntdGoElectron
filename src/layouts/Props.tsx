import {
  InfoCircleOutlined,
  SettingOutlined,
  UserOutlined,
  createFromIconfontCN,
} from '@ant-design/icons';
const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_4599363_5gfwt2xtcrk.js', // 在 iconfont.cn 上生成
});

export default {
  route: {
    path: '/uers/',
    routes: [
      {
        path: '/uers/',
        name: '阅读',
        icon: <MyIcon type="icon-yuedu" />,
        routes: [
          {
            path: '/uers/read/',
            name: '书库',
            icon: <MyIcon type="icon-shujia" />,
          },
        ],
      },
      {
        path: '/uers/set/',
        name: '设置',
        icon: <SettingOutlined />,
      },
      {
        path: '/uers/me/',
        name: '账户',
        icon: <UserOutlined />,
      },
      {
        path: '/uers/about/',
        name: '关于',
        icon: <InfoCircleOutlined />,
      },
    ],
  },
  location: {
    pathname: '/uers/read/',
  },
  appList: [
  ],
};