import type { ThemeConfig } from 'antd';
import { PageContainer, ProLayout } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { MacScrollbar } from 'mac-scrollbar';
import defaultProps from './Props';
import { Outlet, history } from 'umi';
import { ConfigProvider, Flex, Spin, theme } from 'antd';
import './index.less'
import Upbook from './mod/upbook'
import 'mac-scrollbar/dist/mac-scrollbar.css';
import { ReactComponent as LogoSvg } from '@/assets/logo.svg'
import QueueAnim from 'rc-queue-anim';
import { Datainitial, TypeSetopData } from '@/module/SetopData';
import { useLocalStorageState } from 'ahooks';
import Head from './head';
const sdack = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')
export default () => {
  const [locale, setLocale] = useState(undefined);
  const [themeDack, setthemeDack] = useState<boolean>(sdack.matches);//是否为深色主题
  const [Setdata, setSetdata] = useState<TypeSetopData>(Datainitial().setData);//获取持久化设置数据
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [pathname, setPathname] = useLocalStorageState('Pathname', {  //持久保存页面路由
    defaultValue: defaultProps.location.pathname
  })
  useEffect(() => { //主题深浅自适应
    let matchMedia = window.matchMedia('(prefers-color-scheme: light)')
    matchMedia.addEventListener('change', function () {
      setthemeDack(!this.matches)
    })
    Hive.windowTheme(Setdata.NativeTheme)
  }, [])
  useEffect(() => {//更新程序语言
    const userLocale = Setdata.Languages?.value || 'zh_CN'
    const importedLocale = import('antd/locale/' + userLocale)
    importedLocale.then(e => {
      setLocale(e.default)
    })
  }, [Setdata.Languages])
  useEffect(() => {
    Hive.windowBgTheme(Setdata.WindowBg)
  }, [Setdata.WindowBg])
  const config: ThemeConfig = { //配置主题
    cssVar: true,
    algorithm: themeDack ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      fontFamily: Setdata.fontFamily ? `${Setdata.fontFamily} , ${theme.getDesignToken().fontFamily}` : theme.getDesignToken().fontFamily,
      fontSize: Setdata.fontSize,
      colorBgContainer: themeDack ? '#2b2b2b' : '#ffffff',
      colorPrimary: Setdata.recentColors ? Setdata.recentColors[0] : '#FA8C16',
      colorBgLayout: themeDack ? '#000000' : '#f5f5f5'
    },
  };
  const antdToken = theme.getDesignToken(config) //用户主题token

  const bgLayout = () => {  //生成窗口背景材料
    let backEv = ` ${antdToken.colorBgLayout}a6`
    switch (Setdata.WindowBg) {
      case 'aotu':
        backEv = `linear-gradient(155deg ,${antdToken.colorPrimaryBg}, ${antdToken.colorPrimaryBgHover} 95%)` //青春
        break;
      case 'default':
        backEv = `linear-gradient(145deg ,${themeDack ? '#282828' : '#d9d9d9'}, ${antdToken.colorPrimaryBg} 90%)`  //淡雅
        break;
      case 'Mica Effect':
        backEv = `none`
        break;
      case 'Mica Tabbed':
        backEv = `none`
    }
    return backEv
  }
  const context = { setSetdata }
  return (
    <QueueAnim
      component='div'
      delay={10}
      forcedReplay
      onEnd={() => setTimeout(() => {
        setLoading(false);
      }, 200)}
      type='scaleBig' >
      <div
        key='a'
        id="test-pro-layout"
        style={{
          height: '100vh',
          transform: loading ? '' : 'none'
        }}
      >
        <ConfigProvider
          theme={config}
          locale={locale}
        >
          <ProLayout
            title='笔耕写作'
            collapsed={collapsed}
            onCollapse={setCollapsed}
            collapsedButtonRender={false}
            logo={<LogoSvg width={28} height={28} />}
            token={{ //页面主题配置
              bgLayout: bgLayout(),
              sider: {
                colorBgMenuItemSelected: antdToken.colorPrimaryTextActive + '40',
                colorTextMenuSelected: antdToken.colorPrimaryTextActive,
                colorTextMenuItemHover: 'none',
                colorMenuItemDivider: 'none',
              },
              pageContainer: {
                paddingInlinePageContainerContent: 0
              }
            }}
            menu={{
              type: 'group',
              loading
            }}
            siderWidth={216}
            fixSiderbar
            {...defaultProps}
            location={{ pathname }}

            actionsRender={(props) => {
              if (props.isMobile) return [];
              return <Upbook collapsed={collapsed} />;
            }}
            menuItemRender={(item, dom) => (
              <div
                onClick={(e) => {
                  setPathname(item.path || '/uers/');
                  history.push(item.path || '/uers/')
                }}
              >
                {dom}
              </div>
            )}
          >
            <PageContainer
              header={{
                title: null,
                breadcrumb: {},
                style: { padding: 0, position: 'sticky' }
              }}
              breadcrumbRender={e =>  //重渲染头标题
              (
                <Head e={e} themeDack={themeDack} collapsed={collapsed} setCollapsed={setCollapsed} />
              )
              }
            >
              <MacScrollbar
                className='pagBody'
                style={{
                  backgroundColor: `${antdToken.colorBgLayout}b3`,
                  borderColor: `${antdToken.colorBorder}c2`
                }}
                skin={themeDack ? 'dark' : 'light'}
                minThumbSize={10}
                trackStyle={() => {
                  return {
                    background: 'transparent',
                    borderLeft: 'none'
                  }
                }}
              >
                {loading ? //保证首次进入时的流畅
                  <Flex style={{ height: '100%' }} justify='center' align='center'>
                    <Spin size="large" />
                  </Flex>
                  : <Outlet context={context} />}
              </MacScrollbar>
            </PageContainer>
          </ProLayout>
        </ConfigProvider>
      </div>
    </QueueAnim >
  );
};