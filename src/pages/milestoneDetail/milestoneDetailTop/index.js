import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker, Input,Progress } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'
import { timestampToDateZH, timestampToHoursMinZH, timestampToTime, timestampToHM, timestampToDateTimeLine } from '../../../utils/basicFunction'
import { connect } from '@tarojs/redux'
import { dateTimePicker, formatPickerDateTime,formatTypePickerDateTime ,getMonthDay} from '../../DateTimePicker'


@connect(({ tasks: { isPermission, tasksDetailDatas = {}, }, }) => ({
    isPermission, tasksDetailDatas,
}))
export default class TasksTime extends Component {

    state = {
    }

    componentDidMount() {
 
    }


    render() {

     
        return (
            <View className={indexStyles.view_Style}>
                <View className={indexStyles.input_View}>
                    <View className={`${indexStyles.list_item_iconnext}`} onClick={this.tasksRealizeStatus} >
                     {
                         ishasChildCard ? '' : (is_Realize === '1' && isPermission === true  ? (
                            <Text className={`${globalStyles.global_iconfont} ${globalStyles.status_iconfont}`} style={{ color: '#1890FF' }}>&#xe844;</Text>
                        ) : (
                            <Text className={`${globalStyles.global_iconfont} ${globalStyles.status_iconfont}`}>&#xe6df;</Text>
                        ))
                     }
                    </View>
                    
                    <View onClick={this.reminderToast} className={`${indexStyles.card_title_View} ${ishasChildCard ? indexStyles.card_top_View : ''}`}>
                        <View
                            className={`${indexStyles.card_title_place_view} ${ishasChildCard ? indexStyles.card_title_hasChild : ''}`}
                            onClick={this.getfouces}
                            >{card_name}</View>
                    </View>
                    <View className={indexStyles.card_status}>进行中</View>
                </View>
                
                <View className={indexStyles.progress_View}>
                    <Progress percent={progress_percent}  strokeWidth={8} borderRadius={4} showInfo={true}  active activeColor='#95DE64' />
                </View>
                    
            
                <View className={indexStyles.line_View}></View>
            </View >
        )
    }
}

TasksTime.defaultProps = {
    flag: '', //对象类型(任务, 日程...)
    cellInfo: {}, //当前信息
}
