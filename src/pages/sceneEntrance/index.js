import Taro, { Component } from '@tarojs/taro'
export default class sceneEntrance extends Component {

    componentDidMount() {
        const options = this.$router.params
        this.sceneEntrancePages(options)
    }

    componentWillReceiveProps() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    sceneEntrancePages(options) {
        /***
         * redirectType 对象类型 错误页面=0 项目=1 任务=2 会议=3 流程=4 文件=5 每日代办=6
         * contentId 对象id
         * boardId 项目id
         * current_date 每日代办的日期时间
         */
        const { redirectType, contentId, boardId, currentDate } = options
        let pageObject

        if (redirectType === '6') {
            const { globalData: { store: { dispatch } } } = Taro.getApp()
            dispatch({
                type: 'my/changeCurrentOrg',
                payload: {
                    _organization_id: '0',
                    isTodo: 'todoList',
                }
            })

            Taro.getApp().isTodoList = '1572278400000' //currentDate
            Taro.switchTab({ url: `../../pages/calendar/index` })
        } else {
            if (redirectType === '0') {
                pageObject = 'errorPage'
            } else if (redirectType === '1') {
                pageObject = 'boardDetail'
            } else if (redirectType === '2') {
                pageObject = 'taksDetails'
            } else if (redirectType === '3') {

            } else if (redirectType === '4') {

            } else if (redirectType === '5') {

            }

            if (pageObject) {
                Taro.navigateTo({
                    url: `../../pages/${pageObject}/index?contentId=${contentId}&boardId=${boardId}&push=sceneEntrance`
                })
            }
        }
    }
}

