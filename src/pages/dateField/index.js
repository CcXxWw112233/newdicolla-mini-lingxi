import Taro, { Component } from '@tarojs/taro'
import { View, Picker, } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtList, AtListItem } from 'taro-ui'
import { timestampToDateTimeLine, } from '../../utils/basicFunction'
import styles from './index.scss';
import { formatTimeN, formatDay, timePicker } from './timePicker'
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

        const date_value = timestampToDateTimeLine(field_value, dateFieldCode)
        var arr = date_value.split(" ")
        console.log('---------' + dateFieldCode);
        console.log(arr);
        this.setState({
            current_id: item_id,
            dateSel: field_value,
            date_field_code: dateFieldCode,
            startTimeArray: timePicker(formatTimeN(new Date())).timeArray
        })

        if (arr) {
            if (arr.length == 1) {
                this.setState({
                    dateSel: arr[0]
                })
            } else if (arr.length == 2) {
                this.setState({
                    dateSel: arr[0],
                    timeSel: arr[1],
                    is_show_time_picker: true
                })
                console.log(arr[1])
            }
        }
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
        const { date_field_code } = this.state

        let value = e.detail.value;
        let valeStr = '', value1 = '', value2 = '', value3 = '';
        if (date_field_code === 'YMDHMS') {
            if (parseInt(value[0]) < 10) value1 = '0' + value[0];
            if (parseInt(value[1]) < 10) value2 = '0' + value[1];
            if (parseInt(value[2]) < 10) value3 = '0' + value[2];

            valeStr = value1 + ":" + value2 + ":" + + value3;
            value = valeStr;
        }
        console.log(value)

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

        const { dateSel, timeSel, is_show_time_picker, date_field_code, startTimeArray } = this.state

        let titleString = '设置时间'
        let isShowTime = true;
        if (date_field_code === 'YM') { //年月
            titleString = '年月',
                isShowTime = false
        } else if (date_field_code === 'YMD') { //年月日
            titleString = '年月日'
            isShowTime = false
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
                    is_show_time_picker && date_field_code === 'YMDHMS' && isShowTime ? (

                        <Picker
                            mode='multiSelector'
                            onChange={this.onTimeChange}
                            value={timeSel}
                            range={startTimeArray}
                        >

                            <View className={`${styles.atListItem} ${styles.timeText}`}>
                                {timeSel ? timeSel : '选择时分秒'}
                            </View>
                        </Picker>

                    ) : <View></View>
                }
                {
                    is_show_time_picker && date_field_code != 'YMDHMS' && isShowTime ? (

                        <Picker
                            mode='time'
                            onChange={this.onTimeChange}
                            value={timeSel}
                        >
                            <View className={`${styles.atListItem} ${styles.timeText}`}>
                                {timeSel ? timeSel : '选择时分'}
                            </View>
                        </Picker>

                    ) : <View></View>
                }
            </View>
        )
    }
}

dateField.defaultProps = {

};
