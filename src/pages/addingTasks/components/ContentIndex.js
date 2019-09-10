import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import indexStyles from './ContentIndex.scss'
import globalStyle from '../../../gloalSet/styles/globalStyles.scss'
import TasksTime from '../../../components/tasksRelevant/TasksTime/index'
import ProjectNameCell from '../../../components/tasksRelevant/ProjectNameCell/index'
import AddFunctionCell from '../../../components/tasksRelevant/AddFunctionCell/index'

import DescribeCell from '../../../components/tasksRelevant/DescribeCell/index'
import ExecutorCell from '../../../components/tasksRelevant/ExecutorCell/index'
import MilepostCell from '../../../components/tasksRelevant/MilepostCell/index'

export default class ContentIndex extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            describeInfo: '',
        }
    }

    componentWillReceiveProps() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    immediatelyEstablish() {
        console.log('立即创建')
    }

    timePicks = () => {
        console.log('66666666666');
    }

    render() {
        const { describeInfo } = this.state
        console.log(describeInfo, '');

        return (
            // <View className={`${globalStyle.global_horrizontal_padding}`}>
            <View>
                <View className={indexStyles.tasks_time_style}>
                    <TasksTime cellInfo={timeInfo} />
                </View>
                <View className={indexStyles.project_name_style}>
                    <ProjectNameCell title='项目' name={board_name} />
                </View>
                <View className={indexStyles.tasks_name_style}>
                    <View className={indexStyles.other_style}>
                        <ProjectNameCell title='任务分组' name={list_name} />
                    </View>
                    <View className={indexStyles.tasks_name_style}>
                        <ProjectNameCell title='执行人' name='' executors={executors} />
                    </View>
                    <View className={indexStyles.tasks_name_style}>
                        <ProjectNameCell title='里程碑' name={milestone_data.name} />
                    </View>
                    <View className={indexStyles.tasks_name_style}>
                        <ProjectNameCell title='描述' name={description} />
                    </View>
                </View>

                <AddFunctionCell />
                {/* <Button className={`${indexStyles.establish_btn_normal} ${indexStyles.establish_btn}`} type='primary' onClick={this.immediatelyEstablish}>立即创建</Button> */}
            </View>
        )
    }
}
