import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../gloalSet/styles/globalStyles.scss'
import TasksTime from '../../../components/tasksRelevant/TasksTime/index'
import ProjectNameCell from '../../../components/tasksRelevant/ProjectNameCell/index'
import ExecutorCell from '../../../components/tasksRelevant/ExecutorCell/index'
import MilepostCell from '../../../components/tasksRelevant/MilepostCell/index'
import AddFunctionCell from '../../../components/tasksRelevant/AddFunctionCell/index'
import DescribeCell from '../../../components/tasksRelevant/DescribeCell/index'

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
            <View className={`${globalStyle.global_horrizontal_padding}`}>
                <TasksTime timePicks={() => timePicks()}/>
                <ProjectNameCell />
                <ProjectNameCell />
                <ExecutorCell /> 
                <MilepostCell />
                <DescribeCell />
                <AddFunctionCell />
                {/* <Button className={`${indexStyles.establish_btn_normal} ${indexStyles.establish_btn}`} type='primary' onClick={this.immediatelyEstablish}>立即创建</Button> */}
            </View>
        )
    }
}
