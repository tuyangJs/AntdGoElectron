
import { Tooltip } from 'antd'
import './menuBut.less'
const App = (e: { collapsed: boolean, setCollapsed: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const { collapsed, setCollapsed } = e
    return (
        <Tooltip title={collapsed ? '展开导航栏' : '折叠导航栏'}>
            <div className="menu back menu--4 no-drag">
                <label>
                    <input type="checkbox" checked={!collapsed} onChange={() => { setCollapsed(!collapsed) }} />
                    <svg viewBox="0 0 100 100" width='36px' height='36px' xmlns="https://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="30" />
                        <path className="line--1" d="M0 55l14-10c4.7-3.3 9-5 13-5h72" />
                        <path className="line--2" d="M0 50h99" />
                        <path className="line--3" d="M0 45l14 10c4.7 3.3 9 5 13 5h72" />
                    </svg>
                </label>
            </div>
        </Tooltip>
    )
}
export default App;