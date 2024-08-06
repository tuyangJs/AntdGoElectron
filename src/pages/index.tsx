import {
  AlipayOutlined,
  LockOutlined,
  MailOutlined,
  MobileOutlined,
  TaobaoOutlined,
  UserOutlined,
  WeiboOutlined,
} from '@ant-design/icons';
import Logo from '@/assets/logo.svg'
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import { useLocalStorageState } from 'ahooks';
import { history } from 'umi';
import { Button, Divider, Space, Tabs, message, theme } from 'antd';
import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import { HttpInitialize } from '@/Serve';
import { SetState } from 'ahooks/lib/createUseStorageState';
type LoginType = 'register' | 'account';

const iconStyles: CSSProperties = {
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '18px',
  verticalAlign: 'middle',
  cursor: 'pointer',
};

const Page = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { HttpApi, SetCookis, isCookis } = HttpInitialize()
  const [loginType, setLoginType] = useState<LoginType>('account');
  const [loading, setLoading] = useState<boolean>(false);
  const formRef = useRef<ProFormInstance>();
  const [pathname] = useLocalStorageState('Pathname', {  //持久保存页面路由
    defaultValue: ''
  })
  const [User, SetUser] = useLocalStorageState('User', {  //持久保存账号信息
    defaultValue: {
      autoLogin: false,
      identifier: '',
      password: ''
    }
  })
  useEffect(() => { //初始化登录数据
    if (User?.autoLogin && isCookis) {
      history.push(pathname || '/uers/read/')
    } else {
      formRef.current?.setFieldsValue(User)
    }
  }, [])
  const Loginon = async (values: SetState<{}> | undefined) => {
    setLoading(true)
    const route = (loginType === 'account') ? 'auth/local' : 'auth/local/register'
    if (loginType === 'register') delete values?.confirm
    await HttpApi({
      route: route,
      method: 'post',
      data: values
    }).then(response => {
      SetCookis(response.data.jwt)
      SetUser(values)
      history.push(pathname || '/uers/read/')
    })
      .catch((error) => {
        setLoading(false)
        console.log(error);
        if (error.response.data.error.status === 400) {
          messageApi.open({
            type: 'error',
            content: `请求失败！${error.response.data.error.message || error.message} `,
            duration: 6
          });
          return
        }
        messageApi.open({
          type: 'error',
          content: `请求异常！错误代码：${error.code} `,
          duration: 6
        });
      });

  }


  const { token } = theme.useToken();
  return (
    <><style>
      {`
          body {
            margin: 0;
            overflow:hidden;
              -webkit-app-region: drag;}
          .ant-pro-form-login-page-container{
           -webkit-app-region: no-drag;
          }
           .ant-pro-form-login-container {
           height: 100vh;
           }
        `}
    </style>
      {contextHolder}
      <div
        style={{
          backgroundColor: 'white',
          height: '100vh',
        }}
      >

        <LoginFormPage
          formRef={formRef}
          backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
          logo={Logo}
          backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
          title="笔耕阅读"
          containerStyle={{
            backgroundColor: 'rgba(0, 0, 0,0.65)',
            backdropFilter: 'blur(4px)',
          }}
          subTitle="现代化的阅读与写作程序"
          submitter={{
            render: () => {
              return [
                <Button loading={loading} style={{ width: '100%' }} type="primary" size='large' htmlType="submit">
                  {(loginType === 'account') ? '登录' : '注册'}
                </Button>
              ];
            },
          }}
          onFinish={Loginon}
          activityConfig={{
            style: {
              boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)',
              color: token.colorTextHeading,
              borderRadius: 8,
              backgroundColor: 'rgba(255,255,255,0.25)',
              backdropFilter: 'blur(4px)',
            },
            title: '活动标题，可配置图片',
            subTitle: '活动介绍说明文字',
            action: (
              <Button
                size="large"
                style={{
                  borderRadius: 20,
                  background: token.colorBgElevated,
                  color: token.colorPrimary,
                  width: 120,
                }}
              >
                去看看
              </Button>
            ),
          }}
          actions={<div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}

          >
            <Divider plain>
              <span
                style={{
                  color: token.colorTextPlaceholder,
                  fontWeight: 'normal',
                  fontSize: 14,
                }}
              >
                其他登录方式
              </span>
            </Divider>
            <Space align="center" size={24}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  height: 40,
                  width: 40,
                  border: '1px solid ' + token.colorPrimaryBorder,
                  borderRadius: '50%',
                }}
              >
                <AlipayOutlined style={{ ...iconStyles, color: '#1677FF' }} />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  height: 40,
                  width: 40,
                  border: '1px solid ' + token.colorPrimaryBorder,
                  borderRadius: '50%',
                }}
              >
                <TaobaoOutlined style={{ ...iconStyles, color: '#FF6A10' }} />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  height: 40,
                  width: 40,
                  border: '1px solid ' + token.colorPrimaryBorder,
                  borderRadius: '50%',
                }}
              >
                <WeiboOutlined style={{ ...iconStyles, color: '#1890ff' }} />
              </div>
            </Space>
          </div>}
        >
          <Tabs
            centered
            activeKey={loginType}
            onChange={(activeKey) => setLoginType(activeKey as LoginType)}
          >
            <Tabs.TabPane key={'register'} tab={'注册账号'} />
            <Tabs.TabPane key={'account'} tab={'账号密码登录'} />

          </Tabs>
          {loginType === 'account' && (
            <>
              <ProFormText
                name="identifier"
                fieldProps={{
                  size: 'large',
                  prefix: (
                    <UserOutlined
                      style={{
                        color: token.colorText,
                      }}
                      className={'prefixIcon'} />
                  ),
                }}
                placeholder={'用户名: admin or user'}
                rules={[
                  {
                    required: true,
                    message: '请输入用户名!',
                  },
                ]} />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: (
                    <LockOutlined
                      style={{
                        color: token.colorText,
                      }}
                      className={'prefixIcon'} />
                  ),
                }}
                placeholder={'密码: ant.design'}
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                ]} />
              <div
                style={{
                  marginBlockEnd: 24,
                }}
              >
                <ProFormCheckbox noStyle name="autoLogin">
                  自动登录
                </ProFormCheckbox>
                <a
                  style={{
                    float: 'right',
                  }}
                >
                  忘记密码
                </a>
              </div>
            </>
          )}
          {loginType === 'register' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: (
                    <MailOutlined
                      style={{
                        color: token.colorText,
                      }}
                      className={'prefixIcon'} />
                  ),
                }}
                name="email"
                placeholder={'电子邮箱'}
                rules={[
                  {
                    required: true,
                    message: '请输入电子邮箱！',
                  },
                  {
                    pattern: /[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}/,
                    message: '电子邮箱格式错误！',
                  }
                ]} />
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: (
                    <UserOutlined
                      style={{
                        color: token.colorText,
                      }}
                      className={'prefixIcon'} />
                  ),
                }}
                name="username"
                placeholder={'用户名称'}
                rules={[
                  {
                    required: true,
                    message: '请输入用户名称！',
                  },
                  {
                    max: 8,
                    min: 3,
                    message: '用户应该由3-8个字符组成',
                  }
                ]} />
              <ProFormText.Password
                fieldProps={{
                  size: 'large',
                  prefix: (
                    <LockOutlined
                      style={{
                        color: token.colorText,
                      }}
                      className={'prefixIcon'} />
                  ),
                }}
                name="password"
                placeholder={'账号密码'}
                rules={[
                  {
                    min: 8,
                    message: '密码最需要8位',
                  },
                  {
                    pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/,
                    message: '密码中需包含字母和数字'
                  },
                  {
                    pattern: /^[^\s]+$/,
                    message: '密码中不能包含空白字符'
                  },
                  {
                    required: true,
                    message: '设置您的密码！',
                  },

                ]} />
              <ProFormText.Password
                fieldProps={{
                  size: 'large',
                  prefix: (
                    <LockOutlined
                      style={{
                        color: token.colorText,
                      }}
                      className={'prefixIcon'} />
                  ),
                }}
                name="confirm"
                placeholder={'确认密码'}
                rules={[
                  {
                    required: true,
                    message: '再次输入账号密码！',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('密码不匹配'));
                    },
                  }),
                ]} />
            </>
          )}

        </LoginFormPage>
      </div></>
  );
};

export default () => {
  return (
    <ProConfigProvider dark>
      <Page />
    </ProConfigProvider>
  );
};