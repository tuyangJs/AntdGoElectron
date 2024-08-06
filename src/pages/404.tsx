import React from 'react';
import { Button, Result } from 'antd';
import { history } from 'umi';
const App: React.FC = () => (
    <Result
        //className='drag'
        style={{height:'100%'}}
        status="404"
        title="404"
        subTitle={<p>很抱歉，您访问的页面不存在。<br />Sorry, the page you visited does not exist.</p>}
        extra={<Button className='no-drag' type="primary" onClick={() => history.back()}>返回</Button>}
    />
);

export default App;