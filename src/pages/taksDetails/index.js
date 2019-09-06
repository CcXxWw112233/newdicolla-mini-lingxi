import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import TasksTime from '../../components/tasksRelevant/TasksTime/index'
import ProjectNameCell from '../../components/tasksRelevant/ProjectNameCell/index'
import ExecutorCell from '../../components/tasksRelevant/ExecutorCell/index'
import MilepostCell from '../../components/tasksRelevant/MilepostCell/index'
import DescribeCell from '../../components/tasksRelevant/DescribeCell/index'
import SonTasksCell from './components/SonTasksCell/index'
import RelationContentCell from './components/RelationContentCell/index'
import TagCell from './components/TagCell/index'
import NewBuilders from './components/NewBuilders/index'
import CommentCell from './components/CommentCell/index'
import CommentBox from './components/CommentBox/index'
import { connect } from '@tarojs/redux'

@connect(({ tasks: { tasksDetailDatas = {} } }) => ({
    tasksDetailDatas
}))
export default class taksDetails extends Component {
    config = {
        navigationBarTitleText: '任务详情'
    }
    state = {
        content_Id: ''
    }

    componentDidMount() {
        const contentId = this.$router.params.content_id
        this.setState({
            content_Id: contentId
        })
    }

    componentWillReceiveProps() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    render() {
        const { tasksDetailDatas } = this.props
        const card_name = tasksDetailDatas.card_name
        const due_time = tasksDetailDatas.due_time
        const start_time = tasksDetailDatas.start_time
        const timeInfo = {
            eTime: due_time,
            sTime: start_time,
            cardName: card_name,
        }
        const board_name = tasksDetailDatas['board_name'] || ''
        const list_name = tasksDetailDatas['list_name'] || ''
        const description = tasksDetailDatas['description'] || ''
        const { content_Id } = this.state
        const executors = tasksDetailDatas['executors'] || ''
        const milestone_data = tasksDetailDatas['milestone_data'] || ''
        const label_data = tasksDetailDatas['label_data'] || ''
        const child_data = tasksDetailDatas['child_data'] || ''

        return (
            <View className={`${globalStyle.global_horrizontal_padding}`}>
                <TasksTime cellInfo={timeInfo} />
                <ProjectNameCell title='项目' name={board_name} />
                <ProjectNameCell title='任务' name={list_name} />
                <ExecutorCell executors={executors} />
                <MilepostCell milestone_data={milestone_data} />
                <DescribeCell description={description} />
                <SonTasksCell child_data={child_data} />
                <RelationContentCell />
                <TagCell label_data={label_data} />
                {/* <NewBuilders />
                <CommentCell />
                <CommentBox content={content_Id} /> */}
            </View>
        )
    }
}
