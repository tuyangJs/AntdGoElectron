import { FC } from 'react';
import { Tooltip } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import Dragger from 'antd/es/upload/Dragger';
interface props {
    collapsed: boolean
}
const Set: FC<props> = ({ collapsed }) => {
    console.log(collapsed);

    return (
        <Tooltip title="由此导入本地书籍">
            <div >
                <Dragger className='dragger'  >
                    <p className="ant-upload-drag-icon" style={{ margin: 0 }}>
                        <InboxOutlined style={{ fontSize: collapsed ? 32 : 'revert-layer' }} />
                    </p>
                    {collapsed ? null : <><p className="ant-upload-text">将文件拖到此处进行导入</p>
                        <p className="ant-upload-hint">
                            支持单个或多个文件
                        </p>
                    </>}


                </Dragger>
            </div>

        </Tooltip>
    );
};

export default Set;