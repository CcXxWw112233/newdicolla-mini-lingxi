import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, Button, Picker, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import { AtList, AtListItem } from 'taro-ui'
import Avatar from '../../components/avatar';

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
            start_time: '', //开始时间
            due_time: '', //结束时间
            start_time_str: '开始时间',
            due_time_str: '结束时间',
            due_start_range: '1970-01-01',
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

        const { start_time, due_time, inputText, list_id, property_id, board_id, } = this.state

        if (inputText === '') {
            Taro.showToast({
                title: '请填写子任务名称',
                icon: 'none',
                duration: 2000
            })

            return
        }

        if ((due_time - start_time) < 0) {
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
                due_time: due_time,
                list_id: list_id,
                name: inputText,
                parent_id: property_id,
                start_time: start_time,
                users: userStr,
            }
        }).then((res) => {
            const { code } = res
            if (code == 0 || code == '0') {
                Taro.removeStorageSync('son_tasks_executors')
                Taro.navigateBack()
                // setTimeout(function () {
                //     Taro.navigateBack()
                // }, 2000);
            }
        })
    }

    onDueTimeDateChange = e => {

        this.timeConversion(e['detail']['value'], 'due')
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
            })
        }
    }


    onStartTimeDateChange = e => {

        this.timeConversion(e['detail']['value'], 'start')
    }


    render() {

        const { start_time_str, due_time_str, due_start_range, selectExecutorsList = [], } = this.state

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
                    <View >
                        <Picker mode='date'
                            onChange={this.onStartTimeDateChange}
                            className={indexStyles.startTime}
                        >
                            {start_time_str}
                        </Picker>
                    </View>
                    <View>
                        <Picker mode='date'
                            onChange={this.onDueTimeDateChange}
                            className={indexStyles.startTime}
                            start={due_start_range}
                            value={due_start_range}
                        >
                            {due_time_str}
                        </Picker>
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


            </View>
        )
    }
}

addSonTask.defaultProps = {

};