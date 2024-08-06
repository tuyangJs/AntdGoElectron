
const { contextBridge, ipcRenderer } = require('electron')

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
    ipcRenderer.send('uncaughtException', error)
});


let versions = {}
for (let i = 0; i < process.argv.length; i++) {
    const result = process.argv[i].split('=')
    if (result.length > 0) {
        versions[result[0]] = result[1]
    }
}

contextBridge.exposeInMainWorld(
    'Hive',
    {
        windowTheme: err => { //切换窗口主题true为深色
            return ipcRenderer.send('windowTheme', err)
        },
        windowBgTheme: err => { //切换窗口背景材料
            return ipcRenderer.send('windowBgTheme', err)
        },
        opendev: () => ipcRenderer.send('opendev'),
        version: versions,
        Show_dialog: (...e) => {
            return ipcRenderer.invoke('Show_dialog', ...e)
        },
        Bookshelf: (e) => {
            return ipcRenderer.invoke('Show_dialog', 'showOpenDialogSync', {
                title: '选择书库目录',
                properties: ['openDirectory']
            })
        },
        versions: () => {
            return { ...process.versions}
        },
    }
)