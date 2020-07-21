import { connect } from '@tarojs/redux'
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import indexStyles from './index.scss'
import CustomNavigation from '../acceptInvitation/components/CustomNavigation.js'
import TitileRow from './components/TitileRow/index'
import StepRow from './components/StepRow/index'
import DataCollection from './components/DataCollection/index'
import Approval from './components/Approval/index'
import Score from './components/Score/index'

@connect(({ workflow: { workflowDatas = {}, }, },) => ({
    workflowDatas,
}))
export default class templateDetails extends Component {
    config = {
        navigationStyle: 'custom',
        navigationBarTitleText: '流程详情'
    }
    state = {
        content_Id: '',
        backIcon: '',
        type_flag: '',
    }

    onShareAppMessage() {
        return {
            title: '流程详情',
            path: `/pages/templateDetails/index`,
        }
    }

    componentDidMount() {

        const { flag, boardId, contentId, back_icon } = this.$router.params

        if (boardId || contentId) {
            Taro.setStorageSync('workflow_detail_boardId', boardId)
            Taro.setStorageSync('workflow_detail_contentId', contentId)
        }

        this.setState({
            content_Id: contentId,
            backIcon: back_icon,
            type_flag: flag,
        })

        this.loadTemplateDetails(contentId, boardId)
    }

    loadTemplateDetails(content_id, board_id) {
        let contentId
        let boardId
        if (content_id || board_id) {
            contentId = content_id
            boardId = board_id
        }
        else {
            contentId = Taro.getStorageSync('workflow_detail_contentId')
            boardId = Taro.getStorageSync('workflow_detail_contentId')
        }
        const { dispatch } = this.props
        dispatch({
            type: 'workflow/getTemplateDetails',
            payload: {
                id: contentId,
                boardId: boardId,
            }
        })
    }

    componentWillReceiveProps() { }

    // componentDidShow() {
    //     const { dispatch } = this.props
    //     dispatch({
    //         type: 'calendar/updateDatas',
    //         payload: {
    //             isOtherPageBack: true
    //         }
    //     })
    // }

    componentDidHide() { }

    // componentWillUnmount() {
    //     const { sourcePage } = this.state
    //     if (sourcePage === 'auccessJoin' || sourcePage === 'sceneEntrance') {
    //         const switchTabCurrentPage = 'currentPage_BoardDetail_or_Login'
    //         Taro.setStorageSync('switchTabCurrentPage', switchTabCurrentPage);
    //         Taro.switchTab({
    //             url: `../../pages/calendar/index`
    //         })
    //     }
    // }

    render() {
        const SystemInfo = Taro.getSystemInfoSync()
        const statusBar_Height = SystemInfo.statusBarHeight
        const navBar_Height = SystemInfo.platform == 'ios' ? 44 : 48

        const { content_Id, backIcon } = this.state

        const { workflowDatas, } = this.props
        console.log('workflowDatas====', workflowDatas);

        const { name, create_time, nodes = [], } = workflowDatas

        return (
            <View >
                <CustomNavigation backIcon={backIcon} />
                <View style={{ marginTop: `${statusBar_Height + navBar_Height}` + 'px', left: 0 }}>
                    <View className={indexStyles.interval}></View>
                    <TitileRow name={name} create_time={create_time} />

                    {nodes.map((value, key) => {
                        const { id, node_type, sort, runtime_type, recipients, assignees, last_complete_time, } = value
                        return (
                            <View key={id}>
                                {node_type === '1' && (
                                    <View>
                                        <View className={indexStyles.interval}></View>
                                        <StepRow sort={sort} name={value.name} runtime_type={runtime_type} />
                                        <DataCollection recipients={recipients} assignees={assignees} last_complete_time={last_complete_time} />
                                    </View>
                                )}

                                {node_type === '2' && (
                                    <View>
                                        <View className={indexStyles.interval}></View>
                                        <StepRow sort={sort} name={value.name} runtime_type={runtime_type} />                                        <Approval recipients={recipients} assignees={assignees} last_complete_time={last_complete_time} />
                                    </View>
                                )}

                                {node_type === '3' && (
                                    <View>
                                        <View className={indexStyles.interval}></View>
                                        <StepRow sort={sort} name={value.name} runtime_type={runtime_type} />
                                        <Score recipients={recipients} assignees={assignees} last_complete_time={last_complete_time} />
                                    </View>
                                )}
                            </View>
                        )
                    })}
                </View>
            </View>
        )
    }
}

templateDetails.defaultProps = {
    board_id: '', //项目 Id
    content_id: '', //流程Id
    back_icon: '',//显示返回箭头图标还是小房子图标
    flag: '',  //对象类型(任务, 日程...)
    backIcon: '', //自定义导航栏里面的返回图标样式标识
};