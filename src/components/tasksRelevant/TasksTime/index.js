import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'
import ChoiceTimes from './ChoiceTimes/index'
import { timestampToTimeZH } from '../../../utils/basicFunction'
import { connect } from '@tarojs/redux'


@connect(({ tasks: { isPermission, }, }) => ({
    isPermission,
}))
export default class TasksTime extends Component {

    componentWillReceiveProps(nextProps) { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    ejectTimePicks = () => {
        this.props.timePicks()
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
            type: 'tasks/updataTasks',
            payload: {
                card_id: cardId,
                name: value['detail']["value"],
            }
        })
    }

    render() {
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
                    <View className={indexStyles.startTime} >
                        {/* <ChoiceTimes onClick={this.ejectTimePicks} time={sTime} /> */}
                        {sTime ? timestampToTimeZH(sTime) : '开始时间'}
                    </View>
                    <View className={indexStyles.endTime} >
                        {/* <ChoiceTimes onClick={this.ejectTimePicks} time={eTime} /> */}
                        {eTime ? timestampToTimeZH(eTime) : '结束时间'}
                    </View>
                </View>
            </View>
        )
    }
}

TasksTime.defaultProps = {
    flag: '', //对象类型(任务, 日程...)
    cellInfo: {}, //当前信息
}
