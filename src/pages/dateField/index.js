import Taro, { Component } from '@tarojs/taro'
import { View, Picker, } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtList, AtListItem } from 'taro-ui'
import { timestampToTime, } from '../../utils/basicFunction'

@connect(({
    tasks: { tasksDetailDatas, },
}) => ({
    tasksDetailDatas,
}))
export default class dateField extends Component {
    config = {
        navigationBarTitleText: '日期字段'
    }

    constructor() {
        super(...arguments)
        this.state = {
            dateSel: '',
            timeSel: '',
            current_id: '', //当前字段id
            is_show_time_picker: false,
        }
    }

    componentDidMount() {
        const { item_id, field_value, } = this.$router.params

        const date_value = timestampToTime(field_value)

        this.setState({
            current_id: item_id,
            dateSel: date_value,
        })
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

        // Taro.navigateBack({})
    }

    onDateChange = e => {

        var value = e.detail.value
        this.setState({
            dateSel: value,
            is_show_time_picker: true,
        })

        let myDate = new Date();
        let str = myDate.toTimeString(); //"10:55:24 GMT+0800 (中国标准时间)"
        let timeStr = str.substring(0, 8); //  '10:55:24'

        var strTime = value + ' ' + timeStr
        var date = new Date(strTime);
        var time = date.getTime()

        this.updataContent(time)
    }

    onTimeChange = e => {

        let value = e.detail.value;

        this.setState({
            timeSel: value,
        })

        const { dateSel, } = this.state

        var strTime = dateSel + ' ' + value
        var date = new Date(strTime);
        var time = date.getTime()
        this.updataContent(time)
    }

    render() {

        const { dateSel, timeSel, is_show_time_picker, } = this.state

        return (
            <View >

                <Picker
                    mode='date'
                    onChange={this.onDateChange}
                    value={dateSel}>
                    <AtList>
                        <AtListItem
                            title='请选择日期'
                            extraText={dateSel}
                        />
                    </AtList>
                </Picker>

                {
                    is_show_time_picker ? (<Picker
                        mode='time'
                        onChange={this.onTimeChange}
                        value={timeSel}>
                        <AtList>
                            <AtListItem
                                title='选择时间'
                                extraText={timeSel}
                            />
                        </AtList>
                    </Picker>) : <View></View>
                }

            </View>
        )
    }
}

dateField.defaultProps = {

};