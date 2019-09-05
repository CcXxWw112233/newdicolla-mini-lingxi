import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import TasksTime from '../../components/tasksRelevant/TasksTime/index'
import ProjectNameCell from '../../components/tasksRelevant/ProjectNameCell/index'
import ExecutorCell from '../../components/tasksRelevant/ExecutorCell/index'
import MilepostCell from '../../components/tasksRelevant/MilepostCell/index'
import DescribeCell from '../../components/tasksRelevant/DescribeCell/index'
import SonTasksCell from './components/SonTasksCell/index';
import RelationContentCell from './components/RelationContentCell/index';
import TagCell from './components/TagCell/index';
import NewBuilders from './components/NewBuilders/index';
import CommentCell from './components/CommentCell/index';
import CommentBox from './components/CommentBox/index';
import { connect } from '@tarojs/redux';

@connect(({ tasks: { tasksDetailDatas = {} } }) => ({
    tasksDetailDatas
}))
export default class taksDetails extends Component {
    navigationStyle
    config = {
        navigationBarTitleText: '任务详情'
    }
    constructor() {
        super(...arguments)
        this.state = {
            content_Id: ''
        }
    }

    componentDidMount() {
        const contentId = this.$router.params.content_id
        this.setState({
            content_Id: contentId
        })
        this.loadDatas(contentId)
    }

    componentWillReceiveProps() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    loadDatas = (contentId) => {
        const { dispatch } = this.props
        dispatch({
            type: 'tasks/getTasksDetail',
            payload: {
                id: contentId
            }
        })

        dispatch({
            type: 'tasks/getCardCommentListAll',
            payload: {
                id: contentId
            }
        })
    }

    render() {
        const { tasksDetailDatas = {} } = this.props
        const card_name = tasksDetailDatas['card_name'] || ''
        const due_time = tasksDetailDatas['due_time'] || ''
        const start_time = tasksDetailDatas['start_time'] || ''
        const timeInfo = {
            eTime: due_time,
            sTime: start_time,
            cardName: card_name,
        }
        const board_name = tasksDetailDatas['board_name'] || ''
        const list_name = tasksDetailDatas['list_name'] || ''
        const description = tasksDetailDatas['description'] || ''
        const content_Id = this.state
      
        return (
            <View className={`${globalStyle.global_horrizontal_padding}`}>
                <TasksTime cellInfo={timeInfo} />
                <ProjectNameCell title='项目' name={board_name} />
                <ProjectNameCell title='任务' name={list_name}/>
                {/* <ExecutorCell /> */}
                <MilepostCell />
                <DescribeCell description={description}/>
                <SonTasksCell />
                <RelationContentCell />
                <TagCell />
                <NewBuilders />
                <CommentCell />
                <CommentBox content={content_Id} />
            </View>
        )
    }
}
