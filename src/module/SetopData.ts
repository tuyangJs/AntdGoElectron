import { useLocalStorageState } from "ahooks";

interface TypeSetopData {
    ColorValue?: string;
    NativeTheme?: 'system' | 'dark' | 'light'; // 支持系统主题、暗黑模式和亮色模式
    TopWindow?: boolean;
    mainDev?: boolean;
    animation?: boolean;
    Bookshelf?: string | null;
    WindowBg?: 'default' | 'aotu' | 'acrylic' | 'Mica Tabbed' | 'Mica Effect' | null;
    Languages?: { value: string, label: string };
    fontFamily?: string;
    recentColors?: string[];
    fontSize?: number;
}

let isWindowsVersion = [];
{
    const text = Hive.version.windowsVersion;
    const regex = /Microsoft Windows (\d+) (.+)/;
    isWindowsVersion = text.match(regex);
}
const isWin11 = isWindowsVersion[1] === '11'; //是否为windows11

const defSetdata: TypeSetopData = { //默认设置数据
    ColorValue: '#E47600',
    NativeTheme: 'system',
    TopWindow: false,
    mainDev: false,
    animation: true,
    Bookshelf: null,
    WindowBg: isWin11 ? 'Mica Effect' : 'default',
    Languages: { value: 'zh_CN', label: '🇨🇳 简体中文' },
    fontFamily: '',
    recentColors: ['#FA8C16'],
    fontSize: 14
};

const Datainitial = () => {
    const [setData, setCdata] = useLocalStorageState<TypeSetopData>('SetopData', {
        defaultValue: defSetdata
    });

    const SetsetData = (data: TypeSetopData) => {
        setCdata({
            ...setData,
            ...data
        } as TypeSetopData);
    };

    return { 
        setData: setData ?? defSetdata,  // 确保返回的 setData 不为 undefined
        SetsetData 
    };
};

export { defSetdata, isWin11, isWindowsVersion, Datainitial, TypeSetopData };
