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
import { connect } from '@tarojs/redux'


@connect(({ tasks: { tasksDetailDatas = {} }, calendar: { isOtherPageBack = {} } }) => ({
    tasksDetailDatas, isOtherPageBack
}))
export default class taksDetails extends Component {
    config = {
        navigationBarTitleText: '任务详情'
    }
    state = {
        content_Id: '',
        isComplete: '',  //是否完成状态
    }

    componentDidMount() {

        const content_id = this.$router.params.contentId
        const board_id = this.$router.params.boardId

        const { dispatch } = this.props
        dispatch({
            type: 'tasks/getTasksDetail',
            payload: {
                id: content_id,
                boardId: board_id,
            }
        })

        this.setState({
            content_Id: content_id
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

    componentWillUnmount() { }

    tasksDetailsRealizeStatus = () => {

        const { isComplete } = this.state
        this.setState({
            isComplete: !isComplete
        })
    }

    render() {
        const { tasksDetailDatas } = this.props
        const card_id = tasksDetailDatas['card_id'] || ''
        const card_name = tasksDetailDatas['card_name'] || ''
        const due_time = tasksDetailDatas['due_time'] || ''
        const start_time = tasksDetailDatas['start_time']
        const is_realize = tasksDetailDatas['is_realize'] || ''
        let { isComplete } = this.state
        isComplete = isComplete ? isComplete : (is_realize === "0" ? false : true)
        const timeInfo = {
            eTime: due_time,
            sTime: start_time,
            cardDefinition: card_name,
            isComplete: isComplete,
            cardId: card_id
        }
        const board_name = tasksDetailDatas['board_name'] || ''
        const list_name = tasksDetailDatas['list_name'] || '未分组'
        const description = tasksDetailDatas['description'] || ''
        const { content_Id } = this.state
        const executors = tasksDetailDatas['executors'] || []
        const milestone_data = tasksDetailDatas['milestone_data'] || ''
        const label_data = tasksDetailDatas['label_data']
        const child_data = tasksDetailDatas['child_data']
        const is_Function = {
            isExecutors: executors,
            isMilestone: milestone_data.name,
            isDescription: description,
        }

        return (
            <View >
                <View className={indexStyles.tasks_time_style}>
                    <TasksTime cellInfo={timeInfo} tasksDetailsRealizeStatus={() => this.tasksDetailsRealizeStatus()} />
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
        )
    }
}
