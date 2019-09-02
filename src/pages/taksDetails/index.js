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

export default class taksDetails extends Component {
navigationStyle
    config = {
        navigationBarTitleText: '任务详情'
    }
    constructor() {
        super(...arguments)
        this.state = {
        }
    }

    componentWillReceiveProps() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    render() {
        return (
            <View className={`${globalStyle.global_horrizontal_padding}`}>
               <TasksTime />
               <ProjectNameCell />
               <ProjectNameCell />
               <ExecutorCell />
               <MilepostCell />
               <DescribeCell />
               <SonTasksCell />
               <RelationContentCell />
               <TagCell />
               <NewBuilders />
               <CommentCell />
               <CommentBox />
            </View>
        )
    }
}
