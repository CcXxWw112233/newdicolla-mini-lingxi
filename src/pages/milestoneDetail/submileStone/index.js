import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../gloalSet/styles/globalStyles.scss'
import {  timestampToDateTimeLine } from '../../../utils/basicFunction'



export default class index extends Component {

    state = {
       
    }

  
    render() {
        const {chird_list, } = this.props
        return (
            <View className={indexStyles.list_item}>

                <View className={indexStyles.title_row}>
                    <View className={`${indexStyles.list_item_left_iconnext}`}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe867;</Text>
                    </View>
                    <View className={indexStyles.list_item_name}>关联里程碑</View>

                </View>

                <View className={indexStyles.song_task_centent}>
                    {
                        chird_list && chird_list.map((value, key) => {
                            const { name, deadline,id } = value;
                            var endtime = deadline ? timestampToDateTimeLine(deadline, 'YMDHM',true) : '开始时间'
                            endtime =  endtime.substring(endtime.length - 5) == '00:00' || endtime.substring(endtime.length - 5) == '23:59' ? endtime.substring(0,endtime.length - 5) : endtime;
                            var nowTime = timestampToDateTimeLine(new Date().getTime(), 'YMDHM',true)
                            const isCurrentYear = nowTime.substring(0,4) == endtime.substring(0,4);
                            endtime = isCurrentYear ? endtime.substring(5) : endtime;
                      
                            return (
                                <View className={indexStyles.song_row_left_instyle}>
                                    <View className={`${indexStyles.song_task_name}`}>{name}</View>
                                    <View className={`${indexStyles.song_task_name} ${indexStyles.song_task_time}`}>{endtime}</View>
                                </View>

                            )
                        })
                    }
                </View>

            </View>
        )
    }
}
