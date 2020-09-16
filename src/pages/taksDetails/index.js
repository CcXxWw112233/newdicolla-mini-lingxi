import Taro, { Component } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import TasksTime from '../../components/tasksRelevant/TasksTime/index'
import ProjectNameCell from '../../components/tasksRelevant/ProjectNameCell/index'
import SonTasksCell from './components/SonTasksCell/index'
import RelationContentCell from './components/RelationContentCell/index'
import TagCell from './components/TagCell/index'
import AddFunctionCell from '../../components/tasksRelevant/AddFunctionCell/index'
import NewBuilders from './components/NewBuilders/index'
import CommentCell from './components/CommentCell/index'
import CommentBox from './components/CommentBox/index'
import CustomNavigation from '../acceptInvitation/components/CustomNavigation.js'
import { connect } from '@tarojs/redux'

@connect(({ tasks: { tasksDetailDatas = {}, }, calendar: { isOtherPageBack = {} } }) => ({
    tasksDetailDatas, isOtherPageBack
}))
export default class taksDetails extends Component {
    config = {
        navigationStyle: 'custom',
        navigationBarTitleText: '任务详情'
    }
    state = {
        content_Id: '',
        backIcon: '',
        type_flag: '',
        board_id: '',
        milestone_show: false,
    }

    onShareAppMessage() {
        return {
            title: '任务详情',
            path: `/pages/taksDetails/index`,
        }
    }

    componentDidMount() {

        const { flag, boardId, contentId, back_icon } = this.$router.params

        if (boardId || contentId) {
            Taro.setStorageSync('tasks_detail_boardId', boardId)
            Taro.setStorageSync('tasks_detail_contentId', contentId)
        }

        this.setState({
            content_Id: contentId,
            backIcon: back_icon,
            type_flag: flag,
            board_id: boardId,
        })

        this.loadTasksDetail(contentId, boardId)
    }

    loadTasksDetail(content_id, board_id) {
        let contentId
        let boardId
        if (content_id || board_id) {
            contentId = content_id
            boardId = board_id
        } else {
            contentId = Taro.getStorageSync('tasks_detail_contentId')
            boardId = Taro.getStorageSync('tasks_detail_boardId')
        }
        const { dispatch } = this.props
        dispatch({
            type: 'tasks/getTasksDetail',
            payload: {
                id: contentId,
                boardId: boardId,
            }
        })
    }

    componentDidShow() {
        const { dispatch } = this.props
        dispatch({
            type: 'calendar/updateDatas',
            payload: {
                isOtherPageBack: true
            }
        })
    }

    componentWillUnmount() {
        const { sourcePage } = this.state
        if (sourcePage === 'auccessJoin' || sourcePage === 'sceneEntrance') {
            const switchTabCurrentPage = 'currentPage_BoardDetail_or_Login'
            Taro.setStorageSync('switchTabCurrentPage', switchTabCurrentPage);
            Taro.switchTab({
                url: `../../pages/calendar/index`
            })
        }
    }

    tasksDetailsRealizeStatus = (timeInfo) => {

        let isRealize
        if (timeInfo.isRealize === '1') {
            this.modifyRealize({ is_realize: '0' })
            isRealize = 0

        } else {
            this.modifyRealize({ is_realize: '1' })
            isRealize = 1
        }

        const { dispatch } = this.props
        dispatch({
            type: 'tasks/setTasksRealize',
            payload: {
                card_id: timeInfo.cardId,
                is_realize: isRealize,
            }
        })
    }

    ejectTimePicks = () => {

        console.log('ejectTimePicks========');
    }

    modifyRealize = (new_data = {}) => {

        const { tasksDetailDatas = {}, dispatch } = this.props
        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                tasksDetailDatas: {
                    ...tasksDetailDatas,
                    ...new_data
                }
            }
        })
    }

    clickTagCell = () => {

        const { dispatch } = this.props

        let boardId = Taro.getStorageSync('tasks_detail_boardId')
        let contentId = Taro.getStorageSync('tasks_detail_contentId')

        Promise.resolve(
            dispatch({
                type: 'tasks/getLabelList',
                payload: {
                    board_id: boardId,
                },
            })
        ).then(res => {

            Taro.navigateTo({
                url: `../../pages/labelSelection/index?contentId=${contentId}`
            })
        })
    }

    // clickProjectNameCell = () => {
    //     this.setState({
    //         milestone_show: true,
    //     })
    // }

    render() {
        const { tasksDetailDatas } = this.props
        const card_id = tasksDetailDatas['card_id'] || ''
        const card_name = tasksDetailDatas['card_name'] || ''
        const due_time = tasksDetailDatas['due_time'] || ''
        const start_time = tasksDetailDatas['start_time']
        const is_realize = tasksDetailDatas['is_realize'] || ''

        const timeInfo = {
            eTime: due_time,
            sTime: start_time,
            cardDefinition: card_name,
            isRealize: is_realize,
            cardId: card_id
        }
        const board_name = tasksDetailDatas['board_name'] || ''
        const list_name = tasksDetailDatas['list_name'] || '未分组'
        const description = tasksDetailDatas['description'] || ''
        const { content_Id, backIcon } = this.state
        const executors = tasksDetailDatas['executors'] || []
        const milestone_data = tasksDetailDatas['milestone_data'] || ''
        const label_data = tasksDetailDatas['label_data']
        const child_data = tasksDetailDatas['child_data']
        const is_Function = {
            isExecutors: executors,
            isMilestone: milestone_data.name,
            isDescription: description,
        }

        const SystemInfo = Taro.getSystemInfoSync()
        const statusBar_Height = SystemInfo.statusBarHeight
        const navBar_Height = SystemInfo.platform == 'ios' ? 44 : 48

        const { type_flag } = this.props

        let board_id = Taro.getStorageSync('tasks_detail_boardId')

        return (
            <View >
                <CustomNavigation backIcon={backIcon} />

                <View style={{ marginTop: `${statusBar_Height + navBar_Height}` + 'px', left: 0 }}>
                    <View className={indexStyles.tasks_time_style}>
                        <TasksTime
                            cellInfo={timeInfo}
                            tasksDetailsRealizeStatus={(timeInfo) => this.tasksDetailsRealizeStatus(timeInfo)}
                            flag={type_flag}
                            ejectTimePicks={() => this.ejectTimePicks()}
                        />
                    </View>
                    <ProjectNameCell title='项目' name={board_name} boardId={board_id} />
                    <View className={indexStyles.tasks_name_style}>
                        {/* <ProjectNameCell title='任务分组' name={list_name} clickProjectNameCell={() => this.clickProjectNameCell()} /> */}
                        <ProjectNameCell title='任务分组' name={list_name} boardId={board_id} />
                    </View>
                    <View>
                        {
                            executors ? <ProjectNameCell title='执行人' name='' executors={executors} boardId={board_id} /> : ''
                        }
                        {
                            milestone_data.name ? <ProjectNameCell title='里程碑' name={milestone_data.name} boardId={board_id} /> : ''
                        }
                        {
                            description ? <ProjectNameCell title='描述' name={description} boardId={board_id} /> : ''
                        }
                        {
                            child_data.length > 0 ? <SonTasksCell child_data={child_data} /> : ''
                        }
                        <RelationContentCell />
                        {
                            label_data && label_data.length > 0 ? <TagCell
                                label_data={label_data}
                                clickTagCell={() => this.clickTagCell()}
                            /> : ''
                        }
                    </View>
                    {
                        <View className={indexStyles.add_function_style}> {
                            executors && description && milestone_data ? '' : <AddFunctionCell isFunction={is_Function} />
                        }
                        </View>
                    }
                    {/* <NewBuilders />
                <CommentCell />
                <CommentBox content={content_Id} /> */}
                </View>
            </View>
        )
    }
}

taksDetails.defaultProps = {
    board_id: '', //项目 Id
    content_id: '', //任务Id
    back_icon: '',//显示返回箭头图标还是小房子图标
    flag: '',  //对象类型(任务, 日程...)
    backIcon: '', //自定义导航栏里面的返回图标样式标识
};