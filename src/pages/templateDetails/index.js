import { connect } from '@tarojs/redux'
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import CustomNavigation from '../acceptInvitation/components/CustomNavigation.js'
import TitileRow from './components/TitileRow/index'
import StepRow from './components/StepRow/index'
import DataCollection from './components/DataCollection/index'
import Approval from './components/Approval/index'
import Score from './components/Score/index'
import globalStyle from "../../gloalSet/styles/globalStyles.scss";
import { PROJECT_FLOWS_FLOW_CREATE, PROJECT_FLOWS_FLOW_DELETE, PROJECT_FLOWS_FLOW_ABORT } from "../../gloalSet/js/constant";
import { judgeJurisdictionProject } from "../../utils/basicFunction";

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
        const { workflowDatas } = this.props;
        var that = this;
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

        Taro.getSystemInfo({
            success(res) {
                console.log(res);
                if (res.system.split(" ")[0] == "iOS" && res.screenHeight > 736) {
                    that.setState({
                        screenHeight: res.screenHeight,
                        isIphoneX: true,
                    });
                }
            }
        })
    }

    loadTemplateDetails(content_id, board_id) {
        var that = this;
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
        Promise.resolve(
            dispatch({
                type: 'workflow/getTemplateDetails',
                payload: {
                    id: contentId,
                    boardId: boardId,
                }
            })
        ).then((res) => {
            console.log(res)
            var nodes = res.nodes;
            nodes.map(item => {
                if (item.status == '1') {
                    that.setState({
                        current_step_id: item.id,
                        is_change_open: true,
                    })
                }
            })
        })

    }

    //展开流程步骤
    onChangeOpen(isTrue) {
        const { isOpenStep, currentStepId } = isTrue;
        const { current_step_id } = this.state;
        this.setState({
            is_change_open: isOpenStep,
            current_step_id: currentStepId,
        })
    }
    // flowCreateAuth: false,//新增流程权限
    // flowDeleteAuth: false,//删除流程权限
    // flowAbort: false,//中止流程权限
    // 底部更多   进行中 :中止 删除    ; 中止之后: 重新发起 继续执行 删除
    moreAction() {
        const { workflowDatas } = this.props;
        var that = this;
        if (workflowDatas.status == '2') {
            Taro.showActionSheet({
                itemList: ['继续执行', '删除'], //'重新发起',
                success: function (res) {
                    console.log(res.tapIndex)
                    // if (res.tapIndex == 0) {
                    // that.flowRenew();
                    // } else 
                    if (res.tapIndex == 0) {
                        that.flowContinue()
                    } else if (res.tapIndex == 1) {
                        that.flowDelete()
                    }
                },
                fail: function (res) {
                }
            })
        } else if (workflowDatas.status == '3') {
            Taro.showActionSheet({
                itemList: ['删除'],
                success: function (res) {
                    if (res.tapIndex == 0) {
                        that.flowDelete()
                    }
                },
                fail: function (res) {
                }
            })
        } else {
            Taro.showActionSheet({
                itemList: ['中止', '删除'],
                success: function (res) {
                    console.log(res.tapIndex)
                    if (res.tapIndex == 0) {
                        that.flowAbort();
                    } else if (res.tapIndex == 1) {
                        that.flowDelete()
                    }
                },
                fail: function (res) {
                }
            })
        }
    }
    // 中止流程
    flowAbort() {
        const { dispatch, workflowDatas } = this.props
        console.log(judgeJurisdictionProject(workflowDatas.board_id, PROJECT_FLOWS_FLOW_ABORT))
        if (judgeJurisdictionProject(workflowDatas.board_id, PROJECT_FLOWS_FLOW_ABORT)) {
            dispatch({
                type: 'workflow/flowAbort',
                payload: {
                    id: workflowDatas.id,
                    board_id: workflowDatas.board_id
                }
            })
        } else {
            Taro.showToast({
                title: '您没有权限中止此流程',
                icon: 'none',
                duration: 2000
            })
        }
    }
    // 删除流程
    flowDelete() {
        const { dispatch, workflowDatas } = this.props
        if (judgeJurisdictionProject(workflowDatas.board_id, PROJECT_FLOWS_FLOW_DELETE)) {
            dispatch({
                type: 'workflow/flowDelete',
                payload: {
                    id: workflowDatas.id,
                    board_id: workflowDatas.board_id

                }
            })
        } else {
            Taro.showToast({
                title: '您没有权限删除此流程',
                icon: 'none',
                duration: 2000
            })
        }
    }
    // 重新发起 (没有模板界面 暂时不做)
    flowRenew() {
        const { dispatch, workflowDatas } = this.props
        if (judgeJurisdictionProject(workflowDatas.board_id, PROJECT_FLOWS_FLOW_CREATE)) {
            dispatch({
                type: 'workflow/flowRenew',
                payload: {
                    id: workflowDatas.flow_template_id,
                    board_id: workflowDatas.board_id

                }
            })
        } else {
            Taro.showToast({
                title: '您没有权限重新发起此流程',
                icon: 'none',
                duration: 2000
            })
        }
    }
    // 继续执行
    flowContinue() {
        const { dispatch, workflowDatas } = this.props
        if (judgeJurisdictionProject(workflowDatas.board_id, PROJECT_FLOWS_FLOW_ABORT)) {
            dispatch({
                type: 'workflow/flowContinue',
                payload: {
                    id: workflowDatas.id,
                    board_id: workflowDatas.board_id
                }
            })
        } else {
            Taro.showToast({
                title: '您没有权限继续执行此流程',
                icon: 'none',
                duration: 2000
            })
        }
    }

    render() {
        const SystemInfo = Taro.getSystemInfoSync()
        const statusBar_Height = SystemInfo.statusBarHeight
        const navBar_Height = SystemInfo.platform == 'ios' ? 44 : 48

        const { backIcon, is_change_open, current_step_id, isIphoneX } = this.state

        const { workflowDatas, } = this.props

        const { name, create_time, nodes = [], board_id, status } = workflowDatas
        return (
            <View className={indexStyles.index}>
                <CustomNavigation backIcon={backIcon} pop='previous' />
                <View style={{ marginTop: `${statusBar_Height + navBar_Height}` + 'px', left: 0 }}>
                    <View className={indexStyles.interval}></View>
                    {name ? (<TitileRow name={name} create_time={create_time} />) : (<View></View>)}


                    {nodes && nodes.map((value, key) => {
                        const { id, node_type, sort, runtime_type, recipients, assignees, last_complete_time, forms, description, approve_type, status, score_items, deadline_time_type, deadline_value, deadline_type, his_comments = [], cc_type, is_urge } = value

                        return (
                            <View key={id} >
                                <View className={indexStyles.interval}></View>
                                <StepRow sort={sort} name={value.name} runtime_type={runtime_type} step_id={value.id} current_step_id={current_step_id} is_change_open={current_step_id == id ? true : false} status={status} is_urge={is_urge} onClicked={this.onChangeOpen.bind(this)} />
                                {
                                    current_step_id == value.id ? (
                                        <View>
                                            {node_type === '1' && (
                                                <DataCollection
                                                    recipients={recipients}
                                                    assignees={assignees}
                                                    last_complete_time={last_complete_time}
                                                    forms={forms}
                                                    description={description}
                                                    board_id={board_id}
                                                    status={status}
                                                    deadline_time_type={deadline_time_type}
                                                    deadline_value={deadline_value}
                                                    deadline_type={deadline_type}
                                                    cc_type={cc_type}
                                                />
                                            )}
                                            {node_type === '2' && (
                                                <Approval
                                                    recipients={recipients}
                                                    assignees={assignees}
                                                    last_complete_time={last_complete_time}
                                                    description={description}
                                                    approve_type={approve_type}
                                                    flow_instance_id={workflowDatas.id}
                                                    flow_node_instance_id={value.id}
                                                    status={status}
                                                    deadline_time_type={deadline_time_type}
                                                    deadline_value={deadline_value}
                                                    deadline_type={deadline_type}
                                                    his_comments={his_comments}
                                                />
                                            )}
                                            {node_type === '3' && (
                                                <Score
                                                    recipients={recipients}
                                                    assignees={assignees}
                                                    last_complete_time={last_complete_time}
                                                    description={description}
                                                    score_items={score_items}
                                                    status={status}
                                                    flow_instance_id={workflowDatas.id} flow_node_instance_id={value.id}
                                                    deadline_time_type={deadline_time_type}
                                                    deadline_value={deadline_value}
                                                    deadline_type={deadline_type}
                                                    his_comments={his_comments}
                                                />
                                            )}
                                        </View>
                                    ) : (<View></View>)
                                }
                            </View>
                        )
                    })}
                </View>
                <View className={`${indexStyles.placeholder_View} ${isIphoneX ? indexStyles.isIphoneX : ''}`}></View>
                <View className={`${indexStyles.moreBtnView} ${isIphoneX ? indexStyles.isIphoneX : ''}`} onClick={this.moreAction} >
                    {status == '2' ? '已中止' : ''}
                    {status == '3' ? '已完成' : ''}
                    <Text className={`${globalStyle.global_iconfont} ${indexStyles.more_iconfont}`}>&#xe63f;</Text>
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
