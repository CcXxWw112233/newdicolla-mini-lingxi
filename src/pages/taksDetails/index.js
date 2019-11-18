import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
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
        backIcon: ''
    }

    componentDidMount() {

        const board_id = this.$router.params.boardId //项目 Id
        const content_id = this.$router.params.contentId  //任务Id
        const back_icon = this.$router.params.backIcon //显示返回箭头图标还是小房子图标

        if (board_id || content_id) {
            Taro.setStorageSync('tasks_detail_boardId', board_id)
            Taro.setStorageSync('tasks_detail_contentId', content_id)
        }

        this.setState({
            content_Id: content_id,
            backIcon: back_icon,
        })

        this.loadTasksDetail(content_id, board_id)
    }

    loadTasksDetail(content_id, board_id) {
        let contentId
        let boardId
        if (content_id || board_id) {
            contentId = content_id
            boardId = board_id
        } else {
            contentId = Taro.getStorageSync('tasks_detail_contentId')
            boardId = Taro.getStorageSync('tasks_detail_contentId')
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

    componentWillReceiveProps() { }

    componentDidShow() {
        const { dispatch } = this.props
        dispatch({
            type: 'calendar/updateDatas',
            payload: {
                isOtherPageBack: true
            }
        })
    }

    componentDidHide() { }

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

        return (
            <View >
                <CustomNavigation backIcon={backIcon} />

                <View style={{ marginTop: `${statusBar_Height + navBar_Height}` + 'px', left: 0 }}>
                    <View className={indexStyles.tasks_time_style}>
                        <TasksTime cellInfo={timeInfo} tasksDetailsRealizeStatus={(timeInfo) => this.tasksDetailsRealizeStatus(timeInfo)} />
                    </View>
                    <ProjectNameCell title='项目' name={board_name} />
                    <View className={indexStyles.tasks_name_style}>
                        <ProjectNameCell title='任务分组' name={list_name} />
                    </View>
                    <View>
                        {
                            executors ? <ProjectNameCell title='执行人' name='' executors={executors} /> : ''
                        }
                        {
                            milestone_data.name ? <ProjectNameCell title='里程碑' name={milestone_data.name} /> : ''
                        }
                        {
                            description ? <ProjectNameCell title='描述' name={description} /> : ''
                        }
                        {
                            child_data.length > 0 ? <SonTasksCell child_data={child_data} /> : ''
                        }
                        <RelationContentCell />
                        {
                            label_data.length > 0 ? <TagCell label_data={label_data} /> : ''
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
