
const { Menu, app, nativeTheme } = require('electron')
const version = '1.1.0.6'
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
    app.quit()
    return
}
const { exec } = require('child_process');
let windowsVersion = ''
// 使用 PowerShell 命令获取 Windows 版本信息，并设置输出为 UTF-8 编码
exec('chcp 65001 | powershell.exe -Command "(Get-WmiObject -Class Win32_OperatingSystem).Caption"', { encoding: 'utf8' }, (err, stdout, stderr) => {
    if (err) {
        console.error(err);
        return;
    }
    windowsVersion = stdout.trim();
    app.whenReady().then(mainRday)
});


app.setAboutPanelOptions({
    applicationName: 'BiGengPro',
    applicationVersion: version,
    version,
    copyright: '版权所有 © 2023 荼泱 Email:ihanlong@qq.com'
})
app.setName('BiGengPro')
const isdev = app.isPackaged //是否处于正式运行环境
console.log(app.getPath('logs'));
app.on('window-all-closed', () => {
    app.quit()
})
Menu.setApplicationMenu(null) //去除默认菜单
Mainurl = ''

const path = require('path')
async function mainRday() {  //载入窗口！
    if (isdev) {
        startMicroService(err => {
            if (typeof err === 'number') {
                Mainurl = `http://127.0.0.1:${err}/`
                newMainwin()//进入窗口
            } else {
                console.log(err)
            }
        })
    } else {
        // 获取命令行参数
        const args = process.argv.slice(2); // 从第三个元素开始
        if (args[0] === '--my-Url'){
            Mainurl = args[1]
            newMainwin()//进入窗口
        }
    }
}
async function startMicroService(callBack) { //正式环境载入的方法
    const express = require('express')
    const apps = express()
    apps.set('protocol', 'sapp')
    apps.use((req, res, next) => {
        res.set('X-My-Custom-Protocol', 'sapp')
        next()
    })
    const rootDirectory = path.join(__dirname, '..', 'dist') //正式环境载入的路径
    let port = 23256; // 默认端口
    const tryStartServer = () => {
        const server = apps.listen(port, () => {
            callBack(port)
        })
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                // 端口被占用，尝试使用下一个可用端口
                port++
                tryStartServer()
            } else {
                console.log(err)
            }
        });
    }
    console.log(rootDirectory);
    tryStartServer()
    apps.use(express.static(rootDirectory))
    apps.get('*', function (req, res) {
        res.send(`<html><head><meta charset="utf-8">
        <title>SiriusPro</title>
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge"></head>
        <body><div id="root"></div><script src="/umi.js"></script></body>
        </html>`)
    })
}

//创建主窗口
async function newMainwin(isWin11) {
    //const { BrowserWindow } = require('electron')
    //创建云母窗口的临时方案
    const { PARAMS, VALUE, MicaBrowserWindow, IS_WINDOWS_11, WIN10 } = require('mica-electron');
    const image = __dirname + '/logo.ico'
    const preload = __dirname + '/preload.js'
    const MianWinObj = {
        width: 980,
        height: 685,
        minWidth: 770,
        minHeight: 530,
        title: 'BiGengPro',
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            height: 42,
            color: '#ffffff00',
            symbolColor: '#000'
        },
        frame: false,
        alwaysOnTop: true,
        icon: image,
        show: false,
        webPreferences: {
            preload: preload,
            session: 'persist:BiGengPro',
            partition: 'persist:BiGengPro',
            v8CacheOption: 'BiGengPro',
            devTools: true,
            nodeIntegration: true,
            additionalArguments: ['version=' + version, 'windowsVersion=' + windowsVersion],
        }

    }

    const win = new MicaBrowserWindow(MianWinObj)//创建窗口
    nativeTheme.themeSource = 'system'
    win.setAutoTheme();
    if (nativeTheme.shouldUseDarkColors) {
        win.setTitleBarOverlay({
            symbolColor: '#fff',
        })
    }
    else {
        win.setTitleBarOverlay({
            symbolColor: '#000',
        })
    }
    const contents = win.webContents
    contents.loadURL(Mainurl)
    console.log('载入：' + Mainurl);
    contents.on('did-fail-load', () => { //导航页面失败
        setTimeout(() => {
            win.loadURL(Mainurl)
        }, 200)
    })
    contents.openDevTools()
    contents.once('page-title-updated', async (e) => { //导航成功开始导航
        console.log("导航成功", e);
        win.show()
        app.setBadgeCount(0)
        //win.setBackgroundMaterial('acrylic')
        setTimeout(() => {
            win.setAlwaysOnTop(false)
        }, 100)

        // if (IS_WINDOWS_11) win.setMicaAcrylicEffect();
        // win.setBackgroundMaterial('acrylic')
    })

    // 监听窗口大小变化事件，保存窗口大小
    win.on('resize', () => {
        const bounds = win.getBounds();
        const windowState = {
            bounds: bounds
        };
        //     fs.writeFileSync(windowStatePath, JSON.stringify(windowState));
    });
    win.once('ready-to-show', async () => {
        //win.show()
        await Window_on(win, contents)
        await radyft(win, Mainurl, contents)
        webContents_on(contents)
    })

}

function webContents_on(contents) {//处理contents事件
    const contentsLs = {
        'undo': {
            label: '撤销',
            accelerator: 'Ctrl+Z',
        },
        'redo': {
            label: '恢复',
            accelerator: 'Ctrl+Y',
        },
        'cut': {
            label: '剪切',
            accelerator: 'Ctrl+X',
        },
        'copy': {
            label: '复制',
            accelerator: 'Ctrl+C',
        },
        'paste': {
            label: '粘贴',
            accelerator: 'Ctrl+V',
        },
        'delete': {
            label: '删除',
            accelerator: 'Del',
        },
        'selectAll': {
            label: '全选',
            accelerator: 'Ctrl+A',
        },
    };
    contents.on('context-menu', (e, params) => {
        if (params.mediaType !== 'none') return;
        let MenuItem = [];
        if (params.isEditable) {
            MenuItem = Object.keys(params.editFlags)
                .map(key => {
                    const role = key.replace('can', '').replace(/^[A-Z]/, match => match.toLowerCase());
                    return contentsLs[role] ? {
                        role: role,
                        enabled: params.editFlags[key],
                        visible: params.editFlags[key],
                        ...contentsLs[role],
                    } : null;
                })
                .filter(Boolean);
        } else if (params.editFlags.canCopy) {
            MenuItem.push(contentsLs.copy);
        }
        if (MenuItem.length > 0) {
            const contextMenu = Menu.buildFromTemplate(MenuItem);
            contextMenu.popup();
        }
    });

}
async function radyft(win, Mainurl, contents) {
    const Mainurls = new URL(Mainurl)
    contents.on('will-navigate', (event) => { //阻止页面跳转
        const url = new URL(event.url);
        console.log(event);
        if (url.hostname !== Mainurls.hostname) {
            event.preventDefault();
            const errBack = dialog.showMessageBoxSync(win, {
                message: '您正在访问：' + url.hostname,
                title: '访问确认',
                detail: '程序试图打开：\n' + event.url + '\n是否继续？',
                buttons: ['取消', '继续'],
                defaultId: 1,
                icon: __dirname + '/urlicon.png',
                type: 'question',
                noLink: true
            })

            if (errBack === 1) {
                shell.openExternal(event.url);
            }

        }
        //
    });
    const { shell, dialog } = require('electron');
}
app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 当应用程序已经在运行时尝试启动第二个实例
    // 在这里可以执行其他逻辑，比如将第二个实例的参数传递给第一个实例
})

function Window_on(win, contents) {
    const { Tray } = require('electron')
    const { ipcMain, session } = require('electron')
    const { dialog } = require('electron');
    ipcMain.handle('session', (e, err, data) => {
        return contents.session[err](data)
    })
    ipcMain.on('opendev', () => { //设置窗口主题
        console.log('opendev');
        contents.openDevTools({
            activate: true,
            undocked: 'undocked',
            title: '控制台'
        })
    })
    ipcMain.handle('Show_dialog', async (event, err, obj) => {

        return dialog[err](win, obj)
    })
    ipcMain.on('windowTheme', (e, err) => { //设置窗口主题
        if (err) {
            nativeTheme.themeSource = err
            switch (err) {
                case 'system':
                    win.setAutoTheme();
                    break;
                case 'dark':
                    win.setDarkTheme();
                    break;
                case 'light':
                    win.setLightTheme();
                    break;
                default:

                    break;
            }
        }

    })
    ipcMain.on('windowBgTheme', (e, err) => { //设置窗口主题
        switch (err) {
            case 'Mica Effect':
                win.setMicaEffect();
                break;
            case 'Mica Tabbed':
                win.setMicaTabbedEffect();
                break;
            case 'Acrylic':
                win.setMicaAcrylicEffect();
                break
            default:
                win.setMicaEffect();
                break
        }

    })

    nativeTheme.on('updated', async () => { //窗口主题更新事件
        console.log('updated', nativeTheme.shouldUseDarkColors);
        if (nativeTheme.shouldUseDarkColors) {
            win.setTitleBarOverlay({
                symbolColor: '#fff',
            })
        }
        else {
            win.setTitleBarOverlay({
                symbolColor: '#000',
            })
        }
    })

}

