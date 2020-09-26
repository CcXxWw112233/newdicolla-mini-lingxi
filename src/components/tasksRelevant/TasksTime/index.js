import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'
import ChoiceTimes from './ChoiceTimes/index'
import { timestampToTimeZH, } from '../../../utils/basicFunction'
import { connect } from '@tarojs/redux'
import { AtList, AtListItem } from 'taro-ui'


@connect(({ tasks: { isPermission, tasksDetailDatas = {}, }, }) => ({
    isPermission, tasksDetailDatas,
}))
export default class TasksTime extends Component {

    state = {
        is_show_time_picks: false,
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
        let myDate = new Date();
        let str = myDate.toTimeString();
        let timeStr = str.substring(0, 8);

        var strTime = value + ' ' + timeStr
        var date = new Date(strTime);
        var time = date.getTime()

        const { cellInfo = {}, } = this.props
        const { cardId } = cellInfo
        //更新任务时间
        const { dispatch, tasksDetailDatas, } = this.props
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

        this.setState({
            is_show_time_picks: true,
        })


    }

    onDateChangeDue = e => {

        let value = e['detail']['value']
        let myDate = new Date();
        let str = myDate.toTimeString();
        let timeStr = str.substring(0, 8);

        var strTime = value + ' ' + timeStr
        var date = new Date(strTime);
        var time = date.getTime()

        const { cellInfo = {}, } = this.props
        const { cardId } = cellInfo
        //更新任务时间
        const { dispatch, tasksDetailDatas, } = this.props
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

        this.setState({
            is_show_time_picks: true,
        })
    }

    render() {

        const { is_show_time_picks } = this.state

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

                    <Picker mode='date' onChange={this.onDateChangeStart} className={indexStyles.startTime} onClick={this.ejectTimePicks}>
                        {/* <ChoiceTimes onClick={this.ejectTimePicks} time={sTime} /> */}
                        {sTime ? timestampToTimeZH(sTime) : '开始时间'}
                    </Picker>

                    {/* <Picker mode='time' onChange={this.onTimeChange}>
                    </Picker> */}
                    <Picker mode='date' onChange={this.onDateChangeDue} className={indexStyles.endTime} onClick={this.ejectTimePicks}>
                        {/* <ChoiceTimes onClick={this.ejectTimePicks} time={eTime} /> */}
                        {eTime ? timestampToTimeZH(eTime) : '结束时间'}
                    </Picker>
                </View>

                {/* {
                    is_show_time_picks == true ? <Picker mode='time' onChange={this.onTimeChange}>
                        <AtList>
                            <AtListItem title='请选择时间' extraText={this.state.timeSel} />
                        </AtList>
                    </Picker> : <View> </View>
                } */}

            </View>
        )
    }
}

TasksTime.defaultProps = {
    flag: '', //对象类型(任务, 日程...)
    cellInfo: {}, //当前信息
}
