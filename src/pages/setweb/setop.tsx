import { Avatar, Button, ColorPicker, InputNumber, Segmented, Select, Tooltip, Typography, theme } from 'antd'
import CardBox from './CardBox'
import type { TypeSetopData } from '@/module/SetopData';
import { isWin11 } from '@/module/SetopData';
import locale from '@/module/languages'

const { Paragraph, Link } = Typography;
const localeOp = () => {
  let localeOp: any[] = []
  for (let key in locale) {
    localeOp.push({
      value: locale[key],
      label: key
    })
  }
  return localeOp
}
const LocaleOp = localeOp()
//console.log(LocaleOp);
const fontFamilyOP = [
  {
    value: '',
    label: '程序默认'
  },
  {
    value: 'HarmonyOS_Sans',
    label: 'HarmonyOS Sans'
  },
  {
    value: 'STHeiti_IOS8',
    label: '思源柔黑 IOS8'
  },
  {
    value: "Microsoft YaHei, 微软雅黑",
    label: '微软雅黑'
  },
  {
    value: "MiSans-Regular, MiSansLatin-Regular",
    label: 'MiSans'
  }
]
const SetPrevColors = (prevColors: string[] | any, hexString: string) => {

  if (!prevColors) prevColors = []
  // 移除新颜色在最近使用中的位置
  const updatedColors = prevColors.filter((color: any) => color !== hexString);

  // 将新颜色添加到最前面
  updatedColors.unshift(hexString);

  // 保持最近使用的颜色数组长度不超过20个
  if (updatedColors.length > 20) {
    updatedColors.pop();
  }

  return updatedColors;
}
const colorPrimary = ['colorPrimaryBg',
  'colorPrimaryBgHover',
  'colorPrimaryBorder',
  'colorPrimaryBorderHover',
  'colorPrimaryHover',
  'colorPrimaryText',
  'colorPrimaryTextActive',
]
const getItems = (layoutContext: { isWindowsVersion: string[]; }, setData: TypeSetopData, SetsetData: (data: TypeSetopData) => void) => {

  const { token } = theme.useToken();

  const Themecolors = async (e: any) => { //修改主题色
    const hexString = '#' + e.toHex()
    const PrevColors = SetPrevColors(setData.recentColors, hexString)
    SetsetData({
      recentColors: PrevColors
    })
  };
  //颜色预设
  const colors = [{
    label: '推荐颜色',
    colors: [
      '#8E5E19',
      '#FA8C16',
      '#930452',
      '#1677FF',
      '#2F54EB',
      '#117C7C',
      '#722ED1',
      '#FADB14',
      '#8BBB11',
      '#84B700',
      '#A0D468',
      '#48CFAD',
      '#A0CECB',
      '#FC6E51',
      '#ED5565',
      '#8067B7',
      '#537895',
      '#c43a30',
      '#eacda3',
      '#c1c161'
    ],
  },
  ...(setData.recentColors && setData.recentColors.length > 0
    ? [{
      label: '最近使用',
      colors: setData.recentColors
    }]
    : [])
  ]
  const Themeon = async (e: any) => { //修改程序主题
    SetsetData({
      NativeTheme: e
    })
    Hive.windowTheme(e)
  }
  const onBookshelf = async (e: any) => {
    console.log(e);
    Hive.Bookshelf().then((result: string[]) => {
      if (!result) return
      SetsetData({
        Bookshelf: result[0]
      })
    })
  }
  const WindowBg = [
    {
      label: '智能材料',
      options: [
        { label: '淡雅', value: 'default' },
        { label: '青春', value: 'aotu' },
      ],
    },
    {
      label: '高级材料',
      options: [
        {
          label: '云母', value: 'Mica Effect',
          disabled: !isWin11
        },
        {
          label: '云母 Alt', value: 'Mica Tabbed',
          disabled: !isWin11
        },
        {
          label: '亚克力', value: 'Acrylic',
          disabled: !isWin11
        },
      ],
    },
  ]
  const Themeoptions = [
    { label: '跟随系统', value: 'system', title: '跟随系统' },
    { label: '深色', value: 'dark', title: '深色' },
    { label: '浅色', value: 'light', title: '浅色' },
  ];
  function getLabelByValue(value: any) {
    for (const group of WindowBg) {
      const option = group.options.find(option => option.value === value);
      if (option) {
        return option.label;
      }
    }
    return null; // 如果未找到匹配的值，则返回null
  }
  const windowBg = setData.WindowBg
  return CardBox([  //设置菜单
    {
      key: 'theme',
      label: '个性化',
      icon: 'icon-huihua',
      children: [{
        label: '主题色',
        operation: (<ColorPicker
          defaultValue={setData?.recentColors ? setData?.recentColors[0] : ''}
          showText
          presets={colors}
          disabledAlpha
          onChangeComplete={Themecolors}
        />),
        describe: (
          <Avatar.Group size='small'>
            主色梯度演示：
            {colorPrimary.map((e: string) => (
              <Tooltip title={token[e]} placement="top">
                <Avatar style={{ background: token[e] }} />
              </Tooltip>

            )
            )
            }
          </Avatar.Group>
        )
      }, {
        label: '背景材料',
        describe: <> 智能材料会根据梯度色智能生成；亚克力说明
          <Link href='https://learn.microsoft.com/zh-cn/windows/apps/design/style/acrylic'> 点击查看</Link>
          、云母说明<Link href='https://learn.microsoft.com/zh-cn/windows/apps/design/style/mica'> 点击查看</Link>
        </>,
        operation: (<Select
          variant='filled'
          defaultValue={windowBg}
          style={{ width: 100 }}
          onChange={e => SetsetData({ WindowBg: e })}
          options={WindowBg}
        />),
      }, {
        label: '程序主题',
        operation: (<Segmented options={Themeoptions} onChange={Themeon} value={setData.NativeTheme} />),
      },
      ],
      extra: `背景材料: ${getLabelByValue(windowBg)}`,
    },
    {
      key: 'font',
      label: '字体',
      icon: 'icon-yingyu',
      children: [{
        label: '字体选项',
        operation: (
          <Select
            showSearch
            defaultValue={setData.fontFamily}
            optionFilterProp="label"
            style={{ width: 165 }}
            onChange={(e) => {
              SetsetData({
                fontFamily: e
              })
            }
            }
            // onSearch={onSearch}
            options={fontFamilyOP}
          />
        )
      },
      {
        label: '字体大小',
        operation: (
          <InputNumber
            min={9} max={28}
            defaultValue={setData.fontSize}
            onChange={e => SetsetData({ fontSize: e as number })}
            changeOnWheel />
        )
      },
      {
        label: '程序语言',
        operation: (
          <Select
            showSearch
            defaultValue={setData.Languages?.value}
            optionFilterProp="label"
            style={{ width: 200 }}
            onChange={(e, data) => {
              SetsetData({
                Languages: data
              })
            }
            }
            // onSearch={onSearch}
            options={LocaleOp}
          />
        )
      }
      ],
      extra: '副标题',
    },
    {
      key: 'data',
      label: '书架',
      icon: 'icon-wenjianjia',
      children: [{
        label: '书库数据目录',
        describe: setData.Bookshelf ? <Paragraph copyable>{setData.Bookshelf}</Paragraph> : '请设置书库数据目录',
        operation: (<Button onClick={onBookshelf}>{setData.Bookshelf ? '更改位置' : '设置目录位置'}</Button>)
      }],
      extra: '副标题',
    },
  ])
}
export default getItems;