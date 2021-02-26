export default [
    {
        type: '里程碑',
        submenu: [
            {
                value: '全部',
                id: 'all',
            }, {
                value: '我创建',
                id: 'create_by',

            }, {
                value: '未完成',
                id: 'process',

            }, {
                value: '已完成',
                id: 'finish',

            }, {
                value: '未排期',
                id: 'no_time',

            }, {
                value: '已排期',
                id: 'time',

            }]
    },
    {
        type: '任务',
        submenu: [
            {
                value: '全部',
                id: 'all',

            }, {
                value: '我创建',
                id: 'create_by',

            }, {
                value: '未完成',
                id: 'process',

            }, {
                value: '已完成',
                id: 'finish',

            }, {
                value: '未排期',
                id: 'no_time',

            }, {
                value: '已排期',
                id: 'time',
            }]
    },
    {
        type: '流程',
        submenu: [
            {
                value: '全部',
                id: 'all',

            }, {
                value: '我发起',
                id: 'create_by',

            }, {
                value: '待处理',
                id: 'process',

            }, {
                value: '已处理',
                id: 'processed',

            }, {
                value: '已完成',
                id: 'finish',

            }, {
                value: '抄送我',
                id: 'cc',

            }]
    },
    {
        type: '会议',
        submenu: [
            {
                value: '全部',
                id: 'all',

            }, {
                value: '我发起',
                id: 'create_by',

            }, {
                value: '未开始',
                id: 'not_start',

            }, {
                value: '进行中',
                id: 'process',

            }, {
                value: '已结束',
                id: 'finish',

            }]
    }
]



