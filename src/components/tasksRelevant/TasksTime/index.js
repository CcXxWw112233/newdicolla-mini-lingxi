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

        task_start_date: '',
        task_start_time: '',
        task_due_date: '',
        task_due_time: '',

        start_date_str: '',
        due_date_str: '',
    
    }

    componentDidMount() {
        const { cellInfo = {}, } = this.props
        const { sTime, eTime, } = cellInfo

        var obj = dateTimePicker('YMDHM');

        var startT = formatTypePickerDateTime(obj.dateTimeArray, obj.dateTime,'YMDHM')
        this.setState({
            task_start_date: timestampToTime(sTime),
            task_due_date: timestampToTime(eTime),
            task_start_time: timestampToHM(sTime),
            task_due_time: timestampToHM(eTime),
            dateTime: obj.dateTime,
            dateTimeArray: obj.dateTimeArray,
            startT: startT,
            currentSelectMonth:startT.split("-")[1],
     
        })
    }

    tasksRealizeStatus = () => {
        const { cellInfo = {}, flag } = this.props
        if (flag != '0') return
        // typeof this.props.tasksDetailsRealizeStatus == 'function' && this.props.tasksDetailsRealizeStatus(cellInfo)
        this.props.tasksDetailsRealizeStatus(cellInfo)
    }

    //更新任务名称
    updataCardName = (cardId, value) => {

        const { dispatch } = this.props
        this.setState({
            isStartprint:false,
            new_card_name:value['detail']["value"]
        })
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
        })

        var strTime = value + ' ' + '00:00:00'
        var date = new Date(strTime.replace(/-/g, '/'));
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
        var date = new Date(strTime.replace(/-/g, '/'));
        var time = date.getTime()

        this.putTasksStartTime(time)
    }

    cleanStartDateTime = () => {
        this.setState({
            start_date_str: '开始时间',
        })
        this.putTasksStartTime('0')
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
                typeof this.props.onClickAction == "function" &&
                this.props.onClickAction();
                // dispatch({
                //     type: 'tasks/updateDatas',
                //     payload: {
                //         tasksDetailDatas: {
                //             ...tasksDetailDatas,
                //             ...{ start_time: time }
                //         }
                //     }
                // })
            }
        })
    }


    onDateChangeDue = e => {
        let value = e['detail']['value']
        this.setState({
            task_due_date: value,
            due_date_str: value,
        })
        var strTime = value + ' ' + '23:59:59'
        var date = new Date(strTime.replace(/-/g, '/'));
        var time = date.getTime()
        this.putTasksDueTime(time)
    }


    onTimeChangeDue = e => {
        let value = e['detail']['value']
        this.setState({
            task_due_time: value,
            due_time_str: value,
        })
        const { task_due_date, } = this.state
        var strTime = task_due_date + ' ' + value
        var date = new Date(strTime.replace(/-/g, '/'));
        var time = date.getTime()
        this.putTasksDueTime(time)
    }
    // 更新结束时间
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
                typeof this.props.onClickAction == "function" &&
                this.props.onClickAction();
                // dispatch({
                //     type: 'tasks/updateDatas',
                //     payload: {
                //         tasksDetailDatas: {
                //             ...tasksDetailDatas,
                //             ...{ due_time: time }
                //         }
                //     }
                // })
            }
        })
    }
    // 清除结束日期
    cleanDueDateTime = () => {
        this.setState({
            due_date_str: '结束时间',
        })
        this.putTasksDueTime('0')
        
    }
    // 没有权限的弹窗
    reminderToast() {
        const { editAuth } = this.props;
        if (!editAuth) {
            Taro.showToast({
                title: '您没有该项目的编辑权限',
                icon: 'none',
                duration: 2000
            })
        }
    }
    /**
     * 删除时间
     * @param {} e 
     */
     cleanDateTime = e => {
        var promise = []
        
        
        promise.push(this.cleanDueDateTime())
        promise.push(this.cleanStartDateTime())

        Promise.all(promise).then(res => {
            typeof this.props.onClickAction == "function" &&
            this.props.onClickAction();
        })

     }
    /**
     * 获取焦点
     * @param {*} e 
     */
    getfouces = e => {
        this.setState({
            isStartprint:true
        })
    }
    /**
     * 修改开始时间
     * @param {*} e 
     */
    changeStartDateTime = e => {
        var startT = formatTypePickerDateTime(this.state.dateTimeArray, e.detail.value,'YMDHM')
        this.setState({
            startT: startT,
            start_date_str:''
        })
      
        var date = new Date(startT.replace(/-/g, '/'));
        var time = date.getTime()
        this.putTasksStartTime(time)

    }
    /**
     * 修改结束时间
     * @param {*} e 
     */
    changeEndDateTime = e => {
        var startT = formatTypePickerDateTime(this.state.dateTimeArray, e.detail.value,'YMDHM')
        this.setState({
            endT: startT,
            due_date_str:''
        })
        var date = new Date(startT);
        var time = date.getTime()
        this.putTasksDueTime(time)

    }
    onColumnPickerChange = e =>{
        var value = e.detail.value;
        var column = e.detail.column;
        var {dateTimeArray,currentYear,currentSelectMonth} = this.state;
        if(column == 0) {
            const year = dateTimeArray[0][value].substring(0,dateTimeArray[0][value].length-1);
            dateTimeArray[2] = getMonthDay(year,currentSelectMonth).map(item => {
                return item + '日'
            });
            this.setState({
                dateTimeArray:dateTimeArray,
                currentYear:year
            })
        } else if(column == 1) {
            dateTimeArray[2] = getMonthDay(currentYear,dateTimeArray[1][value].substring(0,dateTimeArray[1][value].length-1)).map(item => {
                return item + '日'
            });
            this.setState({
                dateTimeArray:dateTimeArray,
                currentSelectMonth:dateTimeArray[1][value].substring(0,dateTimeArray[1][value].length-1)
            })
        }
    } 
    render() {
       
        const { start_date_str, start_time_str, due_date_str, due_time_str,isStartprint,new_card_name,dateTime,dateTimeArray } = this.state
        const { cellInfo = {}, isPermission, flag, completeAuth, editAuth,ishasChildCard,progress_percent,isHasSubFinish,isHasNoFinish,time_warning } = this.props
        const card_name = (new_card_name && card_name != cellInfo.cardDefinition) ? new_card_name : cellInfo.cardDefinition
        var sTime = cellInfo.sTime ? timestampToDateTimeLine(cellInfo.sTime, 'YMDHM',true) : '开始时间'
        var eTime = cellInfo.eTime ? timestampToDateTimeLine(cellInfo.eTime, 'YMDHM',true) : '结束时间'
        eTime =  eTime.substring(eTime.length - 5) == '00:00' || eTime.substring(eTime.length - 5) == '23:59' ? eTime.substring(0,eTime.length - 5) : eTime;
        sTime =  sTime.substring(sTime.length - 5) == '00:00' || sTime.substring(sTime.length - 5) == '23:59' ? sTime.substring(0,sTime.length - 5) : sTime
        const isSameYear = sTime.substring(0,4) == eTime.substring(0,4);
        var nowTime = timestampToDateTimeLine(new Date().getTime(), 'YMDHM',true)
        const isCurrentYear = nowTime.substring(0,4) == eTime.substring(0,4) && sTime.substring(0,4) == nowTime.substring(0,4);
        sTime = isSameYear && isCurrentYear ? sTime.substring(5) : sTime;
        eTime = isSameYear && isCurrentYear ? eTime.substring(5) : eTime;
        sTime = sTime ? sTime :start_date_str;
        eTime = eTime ? eTime : due_date_str;
        const card_id = cellInfo.cardId
        const is_Realize = cellInfo.isRealize
        //当前时间
        var now = Date.parse(new Date()) / 1000;
        var is_overdue = cellInfo.eTime && now > cellInfo.eTime;
        // var is_warning = time_warning && (now < (cellInfo.eTime - 86400000 * time_warning) || now == (cellInfo.eTime - 86400000 * time_warning)) ? true : false;
        var timeStamp = new Date(parseInt(now)).setHours(0, 0, 0, 0), duetimeStamp = new Date(parseInt(cellInfo.eTime)).setHours(0, 0, 0, 0);
        var is_warning = time_warning && (timeStamp > (duetimeStamp - 86400000 * time_warning) || timeStamp == (duetimeStamp - 86400000 * time_warning)) ? true : false;
        var istimeoverdue =  is_overdue;
        var istime_warning =  is_warning && is_Realize === '0';
        var taskStatus = '';
        if (ishasChildCard) {
            if((!isHasNoFinish && is_Realize === '0') || !isHasSubFinish) {
                taskStatus = '未到期';
            } else if(!isHasNoFinish) {
                  taskStatus = '已完成';
                   if(is_overdue && is_Realize === '1') {
                    taskStatus = '逾期完成';
                }  else if(is_Realize === '1' && !is_overdue){
                    taskStatus = '按时完成';
                } 
            } else if (isHasSubFinish && isHasNoFinish) {
                taskStatus = '进行中';
            }
        } else {
            if(is_Realize === '0') {
                taskStatus = '未到期';
            } else if(is_overdue && is_Realize === '1') {
                taskStatus = '逾期完成';
            }  else if(is_Realize === '1' && !is_overdue){
                taskStatus = '按时完成';
            } 
        }
        return (
            <View className={indexStyles.view_Style}>
                <View className={indexStyles.input_View}>
                    <View className={`${indexStyles.list_item_iconnext}`} onClick={this.tasksRealizeStatus} >
                        {flag === '0' || flag === '2' ? (
                            //任务
                        ishasChildCard ? '' : (is_Realize === '1' && isPermission === true  ? (
                                <Text className={`${globalStyles.global_iconfont} ${globalStyles.status_iconfont}`} style={{ color: '#1890FF' }}>&#xe844;</Text>
                            ) : (
                                <Text className={`${globalStyles.global_iconfont} ${globalStyles.status_iconfont}`}>&#xe6df;</Text>
                            ))
                        ) : (
                            //日程
                            //当前时间小于结束时间, 日程为: 完成状态
                            now > eTime ? (
                                <Text className={`${globalStyles.global_iconfont}`} style={{ color: '#1890FF' }}>&#xe63e;</Text>
                            ) : (
                                <Text className={`${globalStyles.global_iconfont}`}>&#xe63e;</Text>
                            )
                        )}
                    </View>
                    
                    <View onClick={this.reminderToast} className={`${indexStyles.card_title_View} ${indexStyles.card_top_View}`}>
                        {
                            isStartprint ? (
                                <Textarea
                                className={`${indexStyles.card_title}  ${indexStyles.card_title_hasChild}`}
                                placeholder='填写名称'
                                value={card_name}
                                confirmType='完成'
                                auto-height="true"
                                onBlur={this.updataCardName.bind(this, card_id)}
                                disabled={!isStartprint}
                            ></Textarea>
                            ) :(
                                // ${ishasChildCard ? indexStyles.card_title_hasChild: ''}
                                <View
                                className={`${indexStyles.card_title_place_view}  ${indexStyles.card_title_hasChild}`}
                                onClick={this.getfouces}
                                >{card_name}</View>
                            )
                        }
                    </View>
                    {
                        taskStatus && <View className={indexStyles.card_status}>{taskStatus}</View>
                    }
                </View>
                {
                    ishasChildCard ? (
                       <View className={indexStyles.progress_View}>
                            <Progress percent={progress_percent} activeMode="forwards" duration={10} strokeWidth={8} borderRadius={4} showInfo={true}  active activeColor='#95DE64' />
                       </View>
                    ):(<View className={indexStyles.line_View}></View>)
                }
                <View className={`${indexStyles.selectionTime} ${istimeoverdue ? indexStyles.selectionTime_overdue:''} ${istime_warning ? indexStyles.selectionTime_warning:''}`}>
                    <View className={indexStyles.start_content}>
                    <Picker mode='multiSelector'  onColumnChange={this.onColumnPickerChange} disabled={ishasChildCard} value={dateTime} onChange={this.changeStartDateTime} range={dateTimeArray}>
                        <View>{sTime}</View>
                    </Picker>
                    </View>
                    <Text className={`${globalStyles.global_iconfont} ${indexStyles.time_Icon_style} ${istimeoverdue ? indexStyles.selectionTime_overdue:''} ${istime_warning ? indexStyles.selectionTime_warning:''}`}>&#xe654;</Text>
                    <View className={indexStyles.due_content} onClick={this.reminderToast}>
                        <Picker mode='multiSelector' value={dateTime} onChange={this.
                                changeEndDateTime} onColumnChange={this.onColumnPickerChange} disabled={ishasChildCard} range={dateTimeArray}>
                            <View>{eTime}</View>
                        </Picker>
                    </View>
                    {
                        istimeoverdue && <View className={`${indexStyles.card_mark} ${indexStyles.card_mark_overdue}`}>逾期                            
                        </View>
                    }
                    {
                        istime_warning && 
                        <View className={`${indexStyles.card_mark} ${indexStyles.card_mark_warning}`}>预警</View>
                    }
                     
                    <View onClick={this.cleanDateTime} className={indexStyles.deleteTimeIcon}>
                        {
                            !ishasChildCard  &&<Text className={`${globalStyles.global_iconfont}`}>&#xe639;</Text> 
                        }
                    </View>
                    

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
