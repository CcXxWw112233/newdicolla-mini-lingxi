import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'
import ChoiceTimes from './ChoiceTimes/index'
import { timestampToTimeZH } from '../../../utils/basicFunction'
import { connect } from '@tarojs/redux'


@connect(({ TasksTime }) => ({
    TasksTime
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
        this.props.tasksDetailsRealizeStatus()

        const { cellInfo = {} } = this.props
        const isCompleteStatus = cellInfo.isComplete
        const isRealize = isCompleteStatus === false ? 1 : 0
        const { dispatch } = this.props
        dispatch({
            type: 'tasks/setTasksRealize',
            payload: {
                card_id: cellInfo.cardId,
                is_realize: isRealize,
            }
        })
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
        const { cellInfo = {} } = this.props
        const card_name = cellInfo.cardDefinition
        // const input_disabled = !card_name ? false : true
        const sTime = cellInfo.sTime
        const eTime = cellInfo.eTime
        const card_id = cellInfo.cardId
        const isComplete = cellInfo.isComplete

        const inputIcon = isComplete === true ? <Text className={`${globalStyles.global_iconfont}`} style={{ color: '#1890FF' }}>&#xe66a;</Text> : <Text className={`${globalStyles.global_iconfont}`}>&#xe661;</Text>

        return (
            <View className={indexStyles.view_Style}>
                <View className={indexStyles.input_View}>
                    <View className={`${indexStyles.list_item_iconnext}`} onClick={this.tasksRealizeStatus}>
                        {inputIcon}
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
