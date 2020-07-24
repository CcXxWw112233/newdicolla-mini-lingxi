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
    constructor(props) {
        super(props);
    }
    config = {
        navigationStyle: 'custom',
        navigationBarTitleText: '流程详情'
    }
    state = {
        content_Id: '',
        backIcon: '',
        type_flag: '',
        is_change_open: '', //是否展开流程步骤详情
        current_step_id: '', //当前选中id
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

    //展开流程步骤
    onChangeOpen(isTrue) {
        const { isOpenStep, currentStepId } = isTrue
        this.setState({
            is_change_open: isOpenStep,
            current_step_id: currentStepId,
        })
    }

    render() {
        const SystemInfo = Taro.getSystemInfoSync()
        const statusBar_Height = SystemInfo.statusBarHeight
        const navBar_Height = SystemInfo.platform == 'ios' ? 44 : 48

        const { backIcon, is_change_open, current_step_id } = this.state

        const { workflowDatas, } = this.props
        console.log('workflowDatas====', workflowDatas);

        const { name, create_time, nodes = [], board_id, } = workflowDatas

        return (
            <View >
                <CustomNavigation backIcon={backIcon} />
                <View style={{ marginTop: `${statusBar_Height + navBar_Height}` + 'px', left: 0 }}>
                    <View className={indexStyles.interval}></View>
                    {name ? (<TitileRow name={name} create_time={create_time} />) : (<View></View>)}


                    {nodes && nodes.map((value, key) => {
                        const { id, node_type, sort, runtime_type, recipients, assignees, last_complete_time, forms, description, approve_type, status, score_items, } = value

                        return (
                            <View key={id}>
                                <View className={indexStyles.interval}></View>
                                <StepRow sort={sort} name={value.name} runtime_type={runtime_type} step_id={value.id} onClicked={this.onChangeOpen.bind(this)} />
                                {
                                    current_step_id == id && is_change_open ? (
                                        <View>
                                            {node_type === '1' && (
                                                <DataCollection recipients={recipients} assignees={assignees} last_complete_time={last_complete_time} forms={forms} description={description} board_id={board_id} />
                                            )}
                                            {node_type === '2' && (
                                                <Approval recipients={recipients} assignees={assignees} last_complete_time={last_complete_time} description={description} approve_type={approve_type} flow_instance_id={workflowDatas.id} flow_node_instance_id={value.id} status={status} />
                                            )}
                                            {node_type === '3' && (
                                                <Score recipients={recipients} assignees={assignees} last_complete_time={last_complete_time} description={description} score_items={score_items} status={status} flow_instance_id={workflowDatas.id} flow_node_instance_id={value.id} />
                                            )}
                                        </View>
                                    ) : (<View></View>)
                                }
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