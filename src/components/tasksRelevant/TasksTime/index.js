import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'
import ChoiceTimes from './ChoiceTimes/index'
import { timestampToTimeZH, timestampToDateZH, timestampToHoursMinZH, } from '../../../utils/basicFunction'
import { connect } from '@tarojs/redux'
import { AtList, AtListItem } from 'taro-ui'


@connect(({ tasks: { isPermission, tasksDetailDatas = {}, }, }) => ({
    isPermission, tasksDetailDatas,
}))
export default class TasksTime extends Component {

    state = {

        task_start_date: '',
        task_start_time: '',
        task_due_date: '',
        task_due_date: '',

        is_show_start_time: false,
        is_show_due_time: false,
        task_due_date: '',

        start_date_str: '开始日期',
        start_time_str: '开始时间',
        due_date_str: '结束日期',
        due_time_str: '结束时间',
    }

    ejectTimePicks = () => {
        this.props.ejectTimePicks();
    }

    modifyInput = () => {

    }

    tasksRealizeStatus = () => {
        const { cellInfo = {}, flag } = this.props
        if (flag != '0') return
        this.props.tasksDetailsRealizeStatus(cellInfo)
    }

    //更新任务名称
    updataCardName = (cardId, value) => {

        const { dispatch } = this.props
        dispatch({
            type: 'tasks/putCardBaseInfo',
            payload: {
                card_id: cardId,
                card_name: value['detail']["value"],
                name: value['detail']["value"],
            }
        })
    }

    onDateChangeStart = e => {

        var value = e['detail']['value']

        this.setState({
            task_start_date: value,
            start_date_str: value,
            is_show_start_time: true,
        })

        var strTime = value + ' ' + '00:00:00'
        var date = new Date(strTime);
        var time = date.getTime()

        this.putTasksStartTime(time)
    }

    onTimeChangeStart = e => {
        var value = e['detail']['value']

        this.setState({
            task_time_date: value,
            start_time_str: value,
        })

        const { task_start_date } = this.state

        var strTime = task_start_date + ' ' + value
        var date = new Date(strTime);
        var time = date.getTime()

        this.putTasksStartTime(time)
    }

    cleanStartDateTime = () => {

        this.putTasksStartTime('')
    }

    putTasksStartTime = (time) => {

        //更新任务开始时间
        const { dispatch, tasksDetailDatas, cellInfo = {}, } = this.props
        const { cardId } = cellInfo

        dispatch({
            type: 'tasks/putCardBaseInfo',
            payload: {
                card_id: cardId,
                start_time: time,
            }
        }).then((res) => {
            const { code } = res
            if (code == 0 || code == '0') {
                dispatch({
                    type: 'tasks/updateDatas',
                    payload: {
                        tasksDetailDatas: {
                            ...tasksDetailDatas,
                            ...{ start_time: time }
                        }
                    }
                })
            }
        })
    }


    onDateChangeDue = e => {

        let value = e['detail']['value']

        this.setState({
            task_due_date: value,
            due_date_str: value,
            is_show_due_time: true,
        })

        var strTime = value + ' ' + '00:00:00'
        var date = new Date(strTime);
        var time = date.getTime()

        this.putTasksDueTime(time)
    }


    onTimeChangeDue = e => {

        let value = e['detail']['value']

        this.setState({
            task_due_time: value,
            due_time_str: value,
            is_show_due_time: true,
        })

        const { task_due_date, } = this.state

        var strTime = task_due_date + ' ' + value
        var date = new Date(strTime);
        var time = date.getTime()

        this.putTasksDueTime(time)
    }

    putTasksDueTime = (time) => {

        //更新任务结束时间
        const { dispatch, tasksDetailDatas, cellInfo = {}, } = this.props
        const { cardId } = cellInfo
        dispatch({
            type: 'tasks/putCardBaseInfo',
            payload: {
                card_id: cardId,
                due_time: time,
            }
        }).then((res) => {
            const { code } = res
            if (code == 0 || code == '0') {
                dispatch({
                    type: 'tasks/updateDatas',
                    payload: {
                        tasksDetailDatas: {
                            ...tasksDetailDatas,
                            ...{ due_time: time }
                        }
                    }
                })
            }
        })
    }

    cleanDueDateTime = () => {

        this.putTasksDueTime('')
    }

    render() {

        const { is_show_start_time, is_show_due_time, start_date_str, start_time_str, due_date_str, due_time_str, } = this.state

        const { cellInfo = {}, isPermission, flag, } = this.props
        const card_name = cellInfo.cardDefinition
        // const input_disabled = !card_name ? false : true
        const sTime = cellInfo.sTime
        const eTime = cellInfo.eTime
        const card_id = cellInfo.cardId
        const is_Realize = cellInfo.isRealize

        //当前时间
        var now = Date.parse(new Date());
        var unix = now / 1000

        return (
            <View className={indexStyles.view_Style}>
                <View className={indexStyles.input_View}>
                    <View className={`${indexStyles.list_item_iconnext}`} onClick={this.tasksRealizeStatus}>
                        {flag === '0' || flag === '2' ? (
                            //任务
                            is_Realize === '1' && isPermission === true ? (
                                <Text className={`${globalStyles.global_iconfont}`} style={{ color: '#1890FF' }}>&#xe66a;</Text>
                            ) : (
                                    <Text className={`${globalStyles.global_iconfont}`}>&#xe661;</Text>
                                )
                        ) : (
                                //日程
                                //当前时间小于结束时间, 日程为: 完成状态
                                unix > eTime ? (
                                    <Text className={`${globalStyles.global_iconfont}`} style={{ color: '#1890FF' }}>&#xe63e;</Text>
                                ) : (
                                        <Text className={`${globalStyles.global_iconfont}`}>&#xe63e;</Text>
                                    )
                            )}
                    </View>

                    <Input
                        className={indexStyles.card_title}
                        placeholder='填写名称'
                        value={card_name}
                        confirmType='完成'
                        onBlur={this.updataCardName.bind(this, card_id)}
                    ></Input>

                </View>
                <View className={indexStyles.selectionTime}>

                    <View className={indexStyles.start_content}>

                        <View className={indexStyles.start_date_style}>

                            <Picker mode='date' onChange={this.onDateChangeStart} className={indexStyles.startTime} onClick={this.ejectTimePicks}>
                                {sTime ? (is_show_start_time ? timestampToDateZH(sTime) : timestampToTimeZH(sTime)) : start_date_str}
                            </Picker>
                        </View>

                        {
                            is_show_start_time ? (<View className={indexStyles.start_time_style}>
                                <Picker mode='time' onChange={this.onTimeChangeStart} className={indexStyles.startTime} onClick={this.ejectTimePicks}>
                                    {sTime ? timestampToHoursMinZH(sTime) : start_time_str}
                                </Picker>
                            </View>) : ''
                        }


                        {/* <View className={`${indexStyles.list_item_left_iconnext}`} onClick={this.cleanStartDateTime}>
                            <Text className={`${globalStyles.global_iconfont}`}>&#xe77d;</Text>
                        </View> */}


                    </View>

                    <View className={indexStyles.due_content}>

                        <View className={indexStyles.due_date_style}>
                            <Picker mode='date' onChange={this.onDateChangeDue} className={indexStyles.endTime} onClick={this.ejectTimePicks}>
                                {eTime ? (is_show_due_time ? timestampToDateZH(eTime) : timestampToTimeZH(eTime)) : due_date_str}
                            </Picker>
                        </View>


                        {is_show_due_time ? (<View className={indexStyles.due_time_style}>
                            <Picker mode='time' onChange={this.onTimeChangeDue} className={indexStyles.endTime} onClick={this.ejectTimePicks}>
                                {eTime ? timestampToHoursMinZH(eTime) : due_time_str}
                            </Picker>
                        </View>) : ''
                        }

                        {/* <View className={`${indexStyles.list_item_right_iconnext}`} onClick={this.cleanDueDateTime}>
                            <Text className={`${globalStyles.global_iconfont}`}>&#xe77d;</Text>
                        </View> */}

                    </View>

                </View>

            </View >
        )
    }
}

TasksTime.defaultProps = {
    flag: '', //对象类型(任务, 日程...)
    cellInfo: {}, //当前信息
}
