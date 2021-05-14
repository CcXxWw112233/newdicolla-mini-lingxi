import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker, Input,Progress } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import { timestampToDateZH, timestampToHoursMinZH, timestampToTime, timestampToHM, timestampToDateTimeLine } from '../../../utils/basicFunction'


@connect(({ milestone: { mileStone_detail } }) => ({
    mileStone_detail
}))

export default class TasksTime extends Component {

    state = {

 
    }

    componentDidMount() {

    }

    tasksRealizeStatus = () => {
        const {board_id,id,is_finished,mileStone_detail} = this.props;
        const info = {
            board_id:mileStone_detail.board_id,
            id:mileStone_detail.id,
            is_finished:mileStone_detail.is_finished == '1' ? '0' : '1'
        }
        typeof this.props.mileStoneRealizeStatus == 'function' && this.props.mileStoneRealizeStatus(info)
    }

   
    render() {
        const {is_finished,name,chird_list=[],content_list=[],progress_percent,deadline,ishasChild,isHasNoFinish,isHasFinish} = this.props
        var ishasChildCard = chird_list.length == 0  && content_list.length == 0 ? true : false
        var isStartprint = false,istime_warning = false
        var endtime = deadline ? timestampToDateTimeLine(deadline, 'YMDHM',true) : '开始时间'
        endtime =  endtime.substring(endtime.length - 5) == '00:00' || endtime.substring(endtime.length - 5) == '23:59' ? endtime.substring(0,endtime.length - 5) : endtime;
        var nowTime = timestampToDateTimeLine(new Date().getTime(), 'YMDHM',true)
        const isCurrentYear = nowTime.substring(0,4) == endtime.substring(0,4);
        endtime = isCurrentYear ? endtime.substring(5) : endtime;
        var now = Date.parse(new Date()) / 1000;
        var is_overdue = deadline && now > deadline;
        var taskStatus = '';
        // var isHasNoFinish = isAllChirdNoFinish && isHasTaskNoFinish;
        // var isHasFinish = isHasTaskFinish && isAllChirdFinish;
        var taskStatus = '';
        if (ishasChild) {
            if((!isHasNoFinish && is_finished === '0') || !isHasFinish) {
                taskStatus = '未到期';
            } else if(!isHasNoFinish) {
                  taskStatus = '已完成';
                   if(is_overdue && is_finished === '1') {
                    taskStatus = '逾期完成';
                }  else if(is_finished === '1' && !is_overdue){
                    taskStatus = '按时完成';
                } 
            } else if (isHasFinish && isHasNoFinish) {
                taskStatus = '进行中';
            }
        } else {
            if(is_finished === '0') {
                taskStatus = '未到期';
            } else if(is_overdue && is_finished === '1') {
                taskStatus = '逾期完成';
            }  else if(is_finished === '1' && !is_overdue){
                taskStatus = '按时完成';
            } 
        }
      
        
        return (
            <View className={indexStyles.view_Style}>
                <View className={indexStyles.input_View}>
                    <View className={`${indexStyles.list_item_iconnext}`} onClick={this.tasksRealizeStatus} >
                        {
                        !ishasChildCard ? '' : (is_finished === '1'  ? (
                                <Text className={`${globalStyles.global_iconfont} ${globalStyles.status_iconfont}`} style={{ color: '#1890FF' }}>&#xe844;</Text>
                            ) : (
                                <Text className={`${globalStyles.global_iconfont} ${globalStyles.status_iconfont}`}>&#xe6df;</Text>
                            ))
                        }
                    </View>
                    
                    <View onClick={this.reminderToast} className={`${indexStyles.card_title_View} ${ indexStyles.card_top_View }`}>
                        {
                            isStartprint ? (
                                <Textarea
                                className={`${indexStyles.card_title} `}
                                placeholder='填写名称'
                                value={name}
                                confirmType='完成'
                                auto-height="true"
                                onBlur={this.updataCardName.bind(this, card_id)}
                                disabled={!isStartprint}
                            ></Textarea>
                            ) :(
                                <View
                                className={`${indexStyles.card_title_place_view} `}
                                onClick={this.getfouces}
                                >{name}</View>
                            )
                        }
                    </View>
                    <View className={indexStyles.card_status}>{taskStatus}</View>
                </View>
                {
                    !ishasChildCard ? (
                       <View className={indexStyles.progress_View}>
                            <Progress percent={progress_percent}  strokeWidth={8} activeMode="forwards" duration={10}  borderRadius={4} showInfo={true}  active activeColor='#95DE64' />
                       </View>
                    ):(<View className={indexStyles.line_View}></View>)
                }
                <View className={`${indexStyles.selectionTime} `}>
                    <View className={indexStyles.start_content}>
                    {/* <Picker mode='multiSelector'  onColumnChange={this.onColumnPickerChange} disabled={true} value={dateTime} onChange={this.changeStartDateTime} range={dateTimeArray}> */}
                        <View>{endtime}</View>
                    {/* </Picker> */}
                    </View>
                 
                    {/* {   
                        !ishasChildCard  &&  <View onClick={this.cleanDateTime} className={indexStyles.deleteTimeIcon}>
                                <Text className={`${globalStyles.global_iconfont}`}>&#xe639;</Text>
                            </View>
                    }

                    {
                        ishasChildCard && is_overdue && <View className={`${indexStyles.card_mark} ${indexStyles.card_mark_overdue}`}>逾期</View>
                    }
                    {
                        istime_warning && <View className={`${indexStyles.card_mark} ${indexStyles.card_mark_warning}`}>预警</View>
                    } */}
                    
                </View>
                <View className={indexStyles.line_View}></View>
            </View >

        )
    }
}

TasksTime.defaultProps = {
}
