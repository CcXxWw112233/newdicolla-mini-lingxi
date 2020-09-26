import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, Button, Picker, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import { AtList, AtListItem } from 'taro-ui'
import Avatar from '../../components/avatar';
import DateTimePicker from '../../pages/taksDetails/components/DateTimePicker';

@connect(({ tasks: { executors_list = [], tasksDetailDatas = {}, }, }) => ({
    executors_list, tasksDetailDatas,
}))
export default class addSonTask extends Component {
    config = {
        navigationBarTitleText: '添加子任务'
    }

    constructor() {
        super(...arguments)
        this.state = {
            inputText: '', //输入的子任务名称
            start_date: '', //开始日期
            start_time: '', //开始时间
            due_date: '', //结束日期
            due_time: '',   //结束时间
            is_start_time_show: false,
            is_due_time_show: false,

            start_date_str: '开始日期',
            due_date_str: '结束日期',
            start_time_str: '开始时间',
            due_time_str: '结束时间',

            start_timestamp: '',
            due_timestamp: '',

            due_start_range: '',
            start_start_range: '',

            property_id: '',
            board_id: '',
            list_id: '',
            card_id: '',
            selectExecutorsList: [], //选择的任务执行人
        }
    }

    componentDidMount() {

        const { propertyId, boardId, listId, cardId } = this.$router.params

        this.setState({
            property_id: propertyId,
            board_id: boardId,
            list_id: listId,
            card_id: cardId,
        })
    }

    componentDidShow() {
        var users = Taro.getStorageSync('son_tasks_executors')
        var userData = []
        if (users && users != '[]') {
            userData = JSON.parse(users)
        }

        let new_array = []
        const { executors_list = [], } = this.props
        new_array = executors_list.filter(item => {
            const gold_code = (userData.find(n => {
                if (item.id == n) {
                    return n
                }
            }) || {})
            if (item.id == gold_code) {
                return item
            }
        })

        this.setState({
            selectExecutorsList: new_array,
        })
    }

    componentWillUnmount() {

        Taro.removeStorageSync('son_tasks_executors')
    }

    addExecutors = () => {

        const { dispatch } = this.props
        const { board_id, card_id, selectExecutorsList = [], } = this.state

        Promise.resolve(
            dispatch({
                type: 'tasks/getTaskExecutorsList',
                payload: {
                    board_id: board_id,
                },
            })
        ).then(res => {
            Taro.navigateTo({
                url: `../../pages/sonTaskExecutors/index?contentId=${card_id}&executors=${JSON.stringify(selectExecutorsList)}`
            })
        })
    }

    updataInput = (value) => {

        this.setState({
            inputText: value['detail']["value"],
        })
    }

    confirm = () => {

        const { dispatch } = this.props

        const { start_timestamp, due_timestamp, inputText, list_id, property_id, board_id, } = this.state

        if (inputText === '') {
            Taro.showToast({
                title: '请填写子任务名称',
                icon: 'none',
                duration: 2000
            })

            return
        }

        if (due_timestamp != '' && start_timestamp != '' && (due_timestamp - start_timestamp) < 0) {
            Taro.showToast({
                title: '截止时间大于开始时间',
                icon: 'none',
                duration: 2000
            })

            return
        }


        var users = Taro.getStorageSync('son_tasks_executors')
        var userData = []
        if (users && users != '[]') {
            userData = JSON.parse(users)
        }

        var userStr;
        if (userData.length > 0) {
            userStr = userData.join(",");
        } else {
            userStr;
        }

        dispatch({
            type: 'tasks/postV2Card',
            payload: {
                board_id: board_id,
                due_time: due_timestamp,
                list_id: list_id,
                name: inputText,
                parent_id: property_id,
                start_time: start_timestamp,
                users: userStr,
            }
        }).then((res) => {
            const { code } = res
            if (code == 0 || code == '0') {
                Taro.removeStorageSync('son_tasks_executors')
                Taro.navigateBack()
            }
        })
    }

    onDueDateChange = e => {

        var value = e['detail']['value']

        var strTime = value + ' ' + '00:00:00'
        var date = new Date(strTime);
        var time = date.getTime()
        this.setState({
            due_date: value,
            is_due_time_show: true,
            due_date_str: value,
            due_timestamp: time,
        })
    }

    onDueTimeChange = e => {

        var value = e['detail']['value']

        const { due_date } = this.state
        var strTime = due_date + ' ' + value
        var date = new Date(strTime);
        var time = date.getTime()

        this.setState({
            due_time: e['detail']['value'],
            due_time_str: e['detail']['value'],
            due_timestamp: time,
        })
    }

    timeConversion = (value, type) => {

        let myDate = new Date();
        let str = myDate.toTimeString(); //"10:55:24 GMT+0800 (中国标准时间)"
        let timeStr = str.substring(0, 8); //  '10:55:24'

        var strTime = value + ' ' + timeStr
        var date = new Date(strTime);
        var time = date.getTime()

        if (type === 'start') {
            this.setState({
                start_time_str: strTime,
                start_time: time,
                due_start_range: value,
            })
        }
        else if (type === 'due') {
            this.setState({
                due_time_str: strTime,
                due_time: time,
                start_start_range: value,
            })
        }
    }


    onStartDateChange = e => {

        var value = e['detail']['value']

        var strTime = value + ' ' + '00:00:00'
        var date = new Date(strTime);
        var time = date.getTime()

        this.setState({
            start_date: value,
            is_start_time_show: true,
            start_date_str: value,
            start_timestamp: time,
        })
    }

    onStartTimeChange = e => {

        var value = e['detail']['value']

        const { start_date } = this.state

        var strTime = start_date + ' ' + value
        var date = new Date(strTime);
        var time = date.getTime()

        this.setState({
            start_time: value,
            start_time_str: value,
            start_timestamp: time,
        })
    }


    render() {

        const { start_date_str, due_date_str, start_time_str, due_time_str, due_start_range, selectExecutorsList = [], start_start_range, is_start_time_show, is_due_time_show } = this.state

        return (
            <View >

                <View className={indexStyles.add_son_tasks_row}>

                    <View className={`${indexStyles.list_item_left_iconnext}`}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe7c1;</Text>
                    </View>

                    <View className={indexStyles.list_item_name}>子任务</View>


                    {/* <View className={`${indexStyles.list_item_iconnext}`}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe7fc;</Text>
                    </View> */}

                </View>


                <View className={indexStyles.son_tasks_name} >
                    <Input
                        className={indexStyles.son_tasks_input}
                        placeholder='添加子任务'
                        // value={}
                        confirmType='完成'
                        onBlur={this.updataInput.bind(this)}
                    >
                    </Input>

                </View>


                <View className={indexStyles.info_style}>

                    <View className={indexStyles.left_time_style}>

                        <View className={indexStyles.left_date_style}>
                            <Picker mode='date'
                                onChange={this.onStartDateChange}
                                className={indexStyles.startTime}
                                end={start_start_range}
                            >
                                {start_date_str}
                            </Picker>
                        </View>

                        <View className={indexStyles.left_time_style}>

                            {is_start_time_show ? (<Picker mode='time'
                                onChange={this.onStartTimeChange}
                                className={indexStyles.startTime}
                                end={start_date_str}
                            >
                                {start_time_str}
                            </Picker>) : ''

                            }

                        </View>

                    </View>


                    <View className={indexStyles.rigth_time_style}>
                        <View className={indexStyles.right_date_style}>

                            <Picker mode='date'
                                onChange={this.onDueDateChange}
                                className={indexStyles.startTime}
                                start={due_start_range}
                            >
                                {due_date_str}
                            </Picker>
                        </View>

                        <View className={indexStyles.right_time_style}>

                            {
                                is_due_time_show ? (<Picker mode='time'
                                    onChange={this.onDueTimeChange}
                                    className={indexStyles.startTime}
                                    start={due_start_range}
                                >
                                    {due_time_str}
                                </Picker>) : ''
                            }

                        </View>

                    </View>


                    {
                        selectExecutorsList && selectExecutorsList.length > 0 ?
                            (
                                <View className={indexStyles.executors_list_item_detail} onClick={this.addExecutors}>
                                    <View className={`${indexStyles.avata_area}`}>
                                        <Avatar avartarTotal={'multiple'} userList={selectExecutorsList} />
                                    </View>
                                </View>
                            ) : (
                                <View onClick={this.addExecutors}>添加执行人</View>
                            )
                    }


                </View>


                <View className={`${indexStyles.login_footer}`}>
                    <Button className={`${indexStyles.login_btn_normal} ${indexStyles.login_btn}`} type='primary' onClick={this.confirm}>确定</Button>
                </View>


                {/* <DateTimePicker onOk={this.onOK} initValue="2016/01/01 17:22:37" /> */}

            </View>
        )
    }
}

addSonTask.defaultProps = {

};