import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import indexStyles from './ContentIndex.scss'
import globalStyle from '../../../gloalSet/styles/globalStyles.scss'
import TasksTime from '../../../components/tasksRelevant/TasksTime/index'
import ProjectNameCell from '../../../components/tasksRelevant/ProjectNameCell/index'
import AddFunctionCell from '../../../components/tasksRelevant/AddFunctionCell/index'
import { connect } from '@tarojs/redux';

@connect(({ ContentIndex }) => ({
    ContentIndex
}))
export default class ContentIndex extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            describeInfo: '',

            board_id: '',
            board_name: '',
            
            list_id: '',
            list_name: '',

            executors_id: '',
            executors: [],

            milestone_data_id: '',
            milestone_data_name: '',
        }
    }

    componentWillReceiveProps() { }

    componentWillUnmount() { }

    componentDidShow() {
        let pages = getCurrentPages();
        let currPage = pages[pages.length - 1];
        if (currPage.data.source === 'fillDescribe') {
            this.setState({
                describeInfo: currPage.data.describeInfo,
            })
        } else if (currPage.data.source === '项目') {
            this.setState({
                board_id: currPage.data.valueInfo.id,
                board_name: currPage.data.valueInfo.name,
            })
        } else if (currPage.data.source === '任务分组') {
            this.setState({
                list_id: currPage.data.valueInfo.id,
                list_name: currPage.data.valueInfo.name,
            })
        } else if (currPage.data.source === '执行人') {
            this.setState({
                executors_id: currPage.data.valueInfo.id,
                executors: currPage.data['valueInfo'],
            })
        } else if (currPage.data.source === '里程碑') {
            this.setState({
                milestone_data_id: currPage.data.valueInfo.id,
                milestone_data_name: currPage.data.valueInfo.name,
            })
        }

        console.log(currPage.data, 'kkkkk')
    }

    componentDidHide() { }

    immediatelyEstablish() {
        const { board_id, } = this.state
        const { dispatch } = this.props

        dispatch({
            type: 'tasks/addTask',
            payload: {
                add_type: '1',
                board_id: board_id,
                due_time: '',
                list_id: '',
                name: '任务名称',
                start_time: '',
                type: '0',
                users: '',
            }
        })
    }

    timePicks = () => {
        console.log('66666666666');
    }

    render() {
        const {
            board_id,
            board_name,
            
            list_id,
            list_name,

            executors_id,
            executors = [],

            milestone_data_id,
            milestone_data_name,

            describeInfo,
        } = this.state
        
        return (
            <View>
                <View className={indexStyles.tasks_time_style}>
                    {/* <TasksTime isDisabled={false}/> */}
                </View>
                <ProjectNameCell title='项目' executors='' name={board_name} />
                <View className={indexStyles.tasks_name_style}>
                    <ProjectNameCell title='任务分组' executors='' name={list_name} boardId={board_id} />
                </View>
                <View>
                    <ProjectNameCell title='执行人' name='' executors={executors} boardId={board_id} />
                    <ProjectNameCell title='里程碑' executors='' name={milestone_data_name} boardId={board_id} />
                    <ProjectNameCell title='描述' executors='' name={describeInfo} />
                </View>

                <View className={indexStyles.add_function_style}>
                    {/* <AddFunctionCell /> */}
                </View>

                <Button className={`${indexStyles.establish_btn_normal} ${indexStyles.establish_btn}`} type='primary' onClick={this.immediatelyEstablish} >立即创建</Button>

            </View>
        )
    }
}
