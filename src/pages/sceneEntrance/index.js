import Taro, { Component } from '@tarojs/taro'
import { isApiResponseOk } from '../../utils/request'
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
         * currentDate 每日代办的日期时间
         */
        const { redirectType, contentId, boardId, currentDate } = options
        const { globalData: { store: { dispatch } } } = Taro.getApp()
        let pageObject

        if (redirectType === '6') {
            Taro.setStorageSync('isTodoList', currentDate)
            Promise.resolve(
                dispatch({
                    type: 'my/changeCurrentOrg',
                    payload: {
                        _organization_id: '0',
                        isTodo: 'todoList',
                    }
                })
            ).then(res => {
                if (isApiResponseOk(res)) {
                    Taro.switchTab({ url: `../../pages/calendar/index` })
                }
            })
        } else {
            if (redirectType === '0') {
                pageObject = 'errorPage'
            } else if (redirectType === '1') {
                Taro.setStorageSync('sceneEntrance_Goto_Other', 'boardDetail')
                Taro.setStorageSync('board_Id', boardId)

                Promise.resolve(
                    dispatch({
                        type: 'board/getBoardDetail',
                        payload: {
                            id: boardId,
                        }
                    })
                ).then(res => {

                    /***
          * 注入 IM
          */
                    dispatch({
                        type: 'my/getOrgList',
                        payload: {}
                    })
                    dispatch({
                        type: 'im/fetchAllIMTeamList',
                        payload: {}
                    })

                    if (isApiResponseOk(res)) {
                        pageObject = 'boardDetail'
                        Taro.navigateTo({
                            url: `../../pages/${pageObject}/index?contentId=${contentId}&boardId=${boardId}&push=sceneEntrance`
                        })
                    }
                    return
                })

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

