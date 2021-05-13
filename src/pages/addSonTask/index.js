import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, Button, Picker,Form } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import Avatar from '../../components/avatar';
import { SonTaskExecutors } from '../sonTaskExecutors';
import { dateTimePicker, formatPickerDateTime,formatTypePickerDateTime,dateTimeTypePicker } from '../../components/DateTimePicker'
import { timestampToDateTimeLine, } from '../../utils/basicFunction'

@connect(({ tasks: { executors_list = [], tasksDetailDatas = {},selectExecutorsList }, }) => ({
    executors_list, tasksDetailDatas,selectExecutorsList
}))
export default class addSonTask extends Component {
    // config = {
    //     navigationBarTitleText: '添加子任务'
    // }

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
            isShowDeleteIcon:false,
            start_date_str: '开始时间',
            due_date_str: '结束时间',
            start_time_str: '未选择开始时间',
            due_time_str: '未选择结束时间',

            start_timestamp: '',
            due_timestamp: '',

            due_start_range: '',
            start_start_range: '',

            property_id: '',
            board_id: '',
            list_id: '',
            card_id: '',
            // selectExecutorsList: [], //选择的任务执行人

            isSonTaskExecutorsShow: false
        }
    }

    componentDidMount() {
        var { propertyId,dispatch, boardId, listId, cardId,subTaskData={} } = this.props
        var obj = dateTimePicker("YMDHM");
        var startT = formatTypePickerDateTime(obj.dateTimeArray, obj.dateTime, "YMDHM");
        var inputText = '';
        var start_date_str = '开始时间'
        var due_date_str = '结束时间'
        var isUpdate = false; // 是否是更新子任务
        if(!(JSON.stringify(subTaskData) == "{}" || subTaskData == null)) {
            cardId = subTaskData.card_id;
            inputText = subTaskData.card_name;
            start_date_str = subTaskData.start_time ? timestampToDateTimeLine(subTaskData.start_time, 'YMDHM') : '开始时间'
            due_date_str = subTaskData.due_time ? timestampToDateTimeLine(subTaskData.due_time, 'YMDHM') : '结束时间',
            isUpdate = true
            dispatch({
                type: 'tasks/updateDatas',
                payload: {
                    selectExecutorsList: subTaskData.executors,
                }
            })
        }
        this.setState({
            property_id: propertyId,
            board_id: boardId,
            list_id: listId,
            card_id: cardId,
            dateTime: obj.dateTime,
            dateTimeArray: obj.dateTimeArray,
            startT: startT,
            start_date_str:start_date_str,
            due_date_str:due_date_str,
            inputText:inputText,
            isUpdate:isUpdate
        })
        
    }

    componentDidShow() {
        // var users = Taro.getStorageSync('son_tasks_executors')
        // var userData = []
        // if (users && users != '[]') {
        //     userData = JSON.parse(users)
        // }

        // let new_array = []
        // const { executors_list = [], } = this.props
        // new_array = executors_list.filter(item => {
        //     const gold_code = (userData.find(n => {
        //         if (item.id == n) {
        //             return n
        //         }
        //     }) || {})
        //     if (item.id == gold_code) {
        //         return item
        //     }
        // })
        // this.setState({
        //     selectExecutorsList: new_array,
        // })
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
            // Taro.navigateTo({
            //     url: `../../pages/sonTaskExecutors/index?contentId=${card_id}&executors=${JSON.stringify(selectExecutorsList)}`
            // })
            typeof this.props.showSonTaskExecutors == "function" &&
            this.props.showSonTaskExecutors();
            // this.setState({
            //     isSonTaskExecutorsShow: true,
            // })
        })
    }

    //实时输入保存
    handleInput = (value) => {
        this.setState({
            inputText: value['detail']["value"],
            isShowDeleteIcon:true
        })
    }
    /**
     * 清空
     * @param {*} e 
     */
    formReset = e => {
        this.setState({
          inputText:'',
          isShowDeleteIcon:false
        })
    }
    /**
     * 修改子任务名称
     * @param {*} value 
     */
    handleBlur = value =>{
        const {isUpdate} = this.state
        if(isUpdate) {
            this.updataCardName(value['detail']["value"])
        }
        
    }
    //更新任务名称
    updataCardName = (inputText) => {
        const {card_id} = this.state
        const {dispatch} = this.props
        dispatch({
            type: 'tasks/putCardBaseInfo',
            payload: {
                card_id: card_id,
                card_name: inputText,
                name: inputText,
            }
        })
    }
    /**
     * 确认添加
     * @returns 
     */
    confirm = () => {
        const { dispatch } = this.props
        const { start_timestamp, due_timestamp, isUpdate,inputText, list_id, property_id, board_id, } = this.state
        // 判断是否是修改子任务  修改就直接关闭弹窗
        if(isUpdate) {
            this.cancel()
            return;
        }
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
                // Taro.navigateBack()
                typeof this.props.onClickAction == "function" &&
                    this.props.onClickAction();
            }
        })

    }

    onDueDateChange = e => {
        var value = e['detail']['value']
        var strTime = value + ' ' + '23:59:59'
        var date = new Date(strTime.replace(/-/g, '/'));
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
        var date = new Date(strTime.replace(/-/g, '/'));
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
        var date = new Date(strTime.replace(/-/g, '/'));
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
    // 关闭弹窗
    cancel() {
        const { dispatch } = this.props
        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                selectExecutorsList: [],
            }
        })
        const {isUpdate}  = this.state;
        typeof this.props.onClickAction == "function" &&
            this.props.onClickAction(isUpdate);
           
    }
    onClickSonTaskExecutors() {
        this.setState({
            isSonTaskExecutorsShow: false
        })
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
            isSonTaskExecutorsShow: false
        })
    }

    onStartDateChange = e => {
        var value = e['detail']['value']
        var strTime = value + ' ' + '00:00:00'
        var date = new Date(strTime.replace(/-/g, '/'));
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
        const { start_date, } = this.state
        var strTime = start_date + ' ' + value
        var date = new Date(strTime.replace(/-/g, '/'));
        var time = date.getTime()
        this.setState({
            start_time: value,
            start_time_str: value,
            start_timestamp: time,
        })
    }
     /**
     * 修改开始时间
     * @param {*} e 
     */
      changeStartDateTime = e => {
        const {isUpdate} = this.state;
        var start_date_str = formatTypePickerDateTime(this.state.dateTimeArray, e.detail.value,'YMDHM')
        var date = new Date(start_date_str.replace(/-/g, '/'));
        var time = date.getTime()
        if(isUpdate) {
            this.putTasksStartTime(time,start_date_str);
            return;
        }
        this.setState({
            start_date_str: start_date_str,
            start_timestamp:time
        })
    }
    //更新任务开始时间
    putTasksStartTime = (time,start_date_str) => {
        const { dispatch} = this.props
        const {card_id} = this.state
        dispatch({
            type: 'tasks/putCardBaseInfo',
            payload: {
                card_id: card_id,
                start_time: time,
            }
        }).then((res) => {
            const { code } = res
            if (code == 0 || code == '0') {
                this.setState({
                    start_date_str: start_date_str,
                    start_timestamp:time
                })
            }
        })
    }

    /**
     * 修改结束时间
     * @param {*} e 
     */
    changeEndDateTime = e => {
        const {isUpdate} = this.state;
        var due_date_str = formatTypePickerDateTime(this.state.dateTimeArray, e.detail.value,'YMDHM')
        var date = new Date(due_date_str);
        var time = date.getTime()
        if(isUpdate) {
            this.putTasksDueTime(time,due_date_str)
        }
        this.setState({
            due_date_str: due_date_str,
            due_timestamp:time
        })
    }

    //更新任务结束时间
    putTasksDueTime = (time,due_date_str) => {
        const { dispatch} = this.props
        const {card_id} = this.state
        dispatch({
            type: 'tasks/putCardBaseInfo',
            payload: {
                card_id: card_id,
                due_time: time,
            }
        }).then((res) => {
            const { code } = res
            if (code == 0 || code == '0') {
                this.setState({
                    due_date_str: due_date_str,
                    due_timestamp:time
                })
            } 
        })
    }
    render() {
        const {selectExecutorsList = []} = this.props
        const { isShowDeleteIcon,start_date_str, isUpdate,due_date_str, start_time_str, due_time_str, due_start_range,  start_start_range, card_id, is_start_time_show, is_due_time_show, isSonTaskExecutorsShow,inputText,dateStr,dateTime,dateTimeArray,startT, } = this.state
        return (
            <View className={indexStyles.fieldSelectionView} onTouchMove={(e) => {e.stopPropagation()}} onClick={this.cancel}>
                <View className={indexStyles.index} hidden={isSonTaskExecutorsShow} onClick={(e) => {e.stopPropagation()}}>
                    <View className={indexStyles.titleView}>
                    {
                        isUpdate ? '修改子任务' :'添加子任务'
                    }
                    </View>
                    <View className={`${globalStyle.global_iconfont} ${indexStyles.close_icon}`} onClick={this.cancel}>&#xe7fc;</View>
                  <View className={indexStyles.contant_View}>
                    <Form  className={indexStyles.son_tasks_from} onReset={this.formReset}>
                        <View className={indexStyles.son_tasks_name} >
                            <Input placeholder='任务名称' value={inputText}  placeholder-style="#BCC2D6" onBlur={this.handleBlur.bind(this)} onInput={this.handleInput.bind(this)} className={indexStyles.son_tasks_input}></Input>
                            {
                                isShowDeleteIcon && <Button className={`${globalStyle.global_iconfont} ${indexStyles.deleteIcon}`} formType='reset'  >&#xe639;</Button>
                            }
                        </View>
                    </Form>
                    <View className={indexStyles.info_style}>

                        <View className={indexStyles.time_style}>

                            {/* 开始时间: */}
                            <View className={start_date_str == '开始时间' ? indexStyles.placestyle : indexStyles.left_date_style}>
                                <Picker mode='multiSelector' value={dateTime} onChange={this.changeStartDateTime} range={dateTimeArray}>
                                    {
                                        start_date_str == '开始时间' ? (
                                            <View className={indexStyles.timeInfoView}>开始时间</View>
                                        ) :(
                                            <View className={indexStyles.timeInfoView}>
                                                <View className={indexStyles.timeInfo_subTitle}>开始时间</View>
                                                <View className={indexStyles.timeInfo_date}>{start_date_str}</View>
                                            </View>
                                        )
                                    }
                                </Picker>
                                {/* <Picker mode='date'
                                    onChange={this.onStartDateChange}
                                    className={indexStyles.startTime}
                                    end={start_start_range}
                                >
                                    {start_date_str}
                                </Picker>
                            </View>

                            <View className={start_time_str == '未选择开始时间' ? indexStyles.placestyle : indexStyles.left_date_style}>

                                {is_start_time_show ? (<Picker mode='time'
                                    onChange={this.onStartTimeChange}
                                    className={indexStyles.startTime}
                                    end={start_date_str}
                                >
                                    {start_time_str}
                                </Picker>) : ''

                                } */}

                            </View> 

                        </View>


                        <View className={indexStyles.time_style}>
                            {/* 结束时间: */}
                            <View className={due_date_str == '结束时间' ? indexStyles.placestyle : indexStyles.right_date_style}>                               
                              <Picker mode='multiSelector' value={dateTime} onChange={this.changeEndDateTime} range={dateTimeArray}>
                                    {
                                        due_date_str == '结束时间' ? (
                                            <View className={indexStyles.timeInfoView}>结束时间</View>
                                        ) :(
                                            <View className={indexStyles.timeInfoView}>
                                                <View className={indexStyles.timeInfo_subTitle}>结束时间</View>
                                                <View className={indexStyles.timeInfo_date}>{due_date_str}</View>
                                            </View>
                                        )
                                    }
                                </Picker>
                                {/* <Picker mode='date'
                                    onChange={this.onDueDateChange}
                                    className={indexStyles.startTime}
                                    start={due_start_range}
                                >


                                    <View>{due_date_str}</View>
                                </Picker>
                            </View>

                            <View className={due_time_str == '未选择结束时间' ? indexStyles.placestyle : indexStyles.right_date_style}>

                                {
                                    is_due_time_show ? (<Picker mode='time'
                                        onChange={this.onDueTimeChange}
                                        className={indexStyles.startTime}
                                        start={due_start_range}
                                    >
                                        {due_time_str}
                                    </Picker>) : ''
                                } */}

                            </View>

                        </View>
                        <View className={indexStyles.time_style}>


                        {
                            selectExecutorsList && selectExecutorsList.length > 0 ?
                                (
                                    <View className={indexStyles.executors_list_item_detail} onClick={this.addExecutors}>
                                        <View className={`${indexStyles.timeInfoView}`}>
                                             <Text className={`${indexStyles.timeInfo_subTitle}`}>执行人:</Text>
                                             <View className={`${indexStyles.avatar_place}`}></View>
                                             <Avatar avartarTotal={'multiple'} userList={selectExecutorsList} listMore={10}/>
                                        </View>
                                    </View>
                                ) : (
                                    <View className={`${indexStyles.executors_list_item_detail} ${indexStyles.placestyle}`} onClick={this.addExecutors}>添加执行人</View>
                                )
                        }

                        </View>
                    </View>

                    <View className={`${indexStyles.login_footer}`}>
                        {/* <Button className={`${indexStyles.login_btn_normal} ${indexStyles.login_btn} ${indexStyles.cencel_btn}`} onClick={this.cancel}>取消</Button> */}
                        <Button className={`${indexStyles.login_btn_normal} ${indexStyles.login_btn}`} type='primary' onClick={this.confirm}>完成</Button>

                    </View>
                    </View>
                </View>
                {/* {isSonTaskExecutorsShow ? (<SonTaskExecutors contentId={card_id} onClickAction={this.onClickSonTaskExecutors} executors={selectExecutorsList}></SonTaskExecutors>) : (null)} */}
            </View>
        )
    }
}


addSonTask.defaultProps = {

};