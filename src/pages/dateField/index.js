import Taro, { Component } from '@tarojs/taro'
import { View, Picker, } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtList, AtListItem } from 'taro-ui'
import { timestampToTime, } from '../../utils/basicFunction'
import styles from './index.scss';

@connect(({
    tasks: { tasksDetailDatas, },
}) => ({
    tasksDetailDatas,
}))
export default class dateField extends Component {
    // config = {
    // navigationBarTitleText: '日期字段'
    // }

    constructor() {
        super(...arguments)
        this.state = {
            dateSel: '',
            timeSel: '',
            current_id: '', //当前字段id
            is_show_time_picker: false,
            date_field_code: '', //时间格式
        }
    }

    componentDidMount() {
        const { item_id, field_value, dateFieldCode, } = this.props

        // const date_value = timestampToTime(field_value)
        // var arr = field_value?.split(" ")
        console.log(field_value);
        this.setState({
            current_id: item_id,
            dateSel: field_value,
            date_field_code: dateFieldCode,
        })
        // if (arr) {
        // if (arr.length == 1) {
        // this.setState({
        // dateStr: arr[0]
        // })
        // } else if (arr.length == 2) {
        // this.setState({
        // dateStr: arr[0]
        // timeStr: arr[1]
        // })
        // }
        // }
    }

    updataContent = (valueText) => {

        const { dispatch } = this.props
        const { current_id } = this.state

        dispatch({
            type: 'tasks/putBoardFieldRelation',
            payload: {
                id: current_id,
                field_value: valueText,
                calback: this.putBoardFieldRelation(valueText),
            }
        })
    }

    putBoardFieldRelation = (valueText) => {

        const { dispatch, tasksDetailDatas, } = this.props
        const { fields = [] } = tasksDetailDatas
        const { current_id } = this.state

        fields.forEach(item => {

            if (item.id === current_id) {
                item.field_value = valueText
            }
        })

        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                tasksDetailDatas: {
                    ...tasksDetailDatas,
                    ...fields,
                }
            }
        })
    }

    onDateChange = e => {

        var value = e && e.detail && e.detail.value

        this.setState({
            dateSel: value,
            is_show_time_picker: true,
        })

        let myDate = new Date();
        let str = myDate.toTimeString(); //"10:55:24 GMT+0800 (中国标准时间)"
        let timeStr = str.substring(0, 8); //  '10:55:24'

        var strTime = value + ' ' + timeStr
        var date = new Date(strTime.replace(/-/g, '/'));
        var time = date.getTime();

        this.updataContent(time)
    }

    onTimeChange = e => {

        let value = e.detail.value;

        this.setState({
            timeSel: value,
        })

        const { dateSel, } = this.state

        var strTime = dateSel + ' ' + value
        var date = new Date(strTime.replace(/-/g, '/'));
        var time = date.getTime()
        this.updataContent(time)
    }

    render() {

        const { dateSel, timeSel, is_show_time_picker, date_field_code, } = this.state

        let titleString = '设置时间'
        if (date_field_code === 'YM') { //年月
            titleString = '年月'
        } else if (date_field_code === 'YMD') { //年月日
            titleString = '年月日'
        } else if (date_field_code === 'YMDH') { //年月日 时
            titleString = '年月日 时'
        } else if (date_field_code === 'YMDHM') { //年月日 时分
            titleString = '年月日 时分'
        } else if (date_field_code === 'YMDHMS') { //年月日 时分秒
            titleString = '年月日 时分秒'
        }

        return (
            <View className={styles.dataField}>

                <Picker
                    mode='date'
                    onChange={this.onDateChange}
                    value={dateSel}>
                    <View className={styles.atListItem}>
                        {dateSel ? dateSel : titleString}
                    </View>
                </Picker>

                {
                    is_show_time_picker ? (<Picker
                        mode='time'
                        onChange={this.onTimeChange}
                        value={timeSel}>

                        <View className={`${styles.atListItem} ${styles.timeText}`}>
                            {timeSel ? timeSel : '选择时分'}
                        </View>

                    </Picker>) : <View></View>
                }

            </View>
        )
    }
}

dateField.defaultProps = {

};
