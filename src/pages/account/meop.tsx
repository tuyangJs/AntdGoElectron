import CardBox from "@/pages/setweb/CardBox";

function App() {

    return CardBox([
        {
            key: 'sync',
            label: '同步',
            children: [
                {
                    label: '设置数据同步'
                },
                {
                    label: '书库分组同步'
                }
            ]
        }
    ])
}

export default App