import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../gloalSet/styles/globalStyles.scss'
import iconStyle from '../../../gloalSet/styles/lxicon.scss'
import { AtActionSheet, AtActionSheetItem } from "taro-ui"
import { connect } from '@tarojs/redux'
import { AddSonTask } from '../../../pages/addSonTask'
import {UploadWayView} from '../../../components/tasksRelevant/uploadWayView'
import { filterFileFormatType } from './../../../utils/util';
import { SonTaskExecutors } from '../../../pages/sonTaskExecutors';


export default class index extends Component {

    state = {
       
    }

    tasksRealizeStatus = (cardId, isRealize) => {
        const {board_id } = this.props

        const cellInfo = {
            cardId: cardId,
            isRealize: isRealize,
            board_id:board_id
        }
        
        typeof this.props.tasksDetailsRealizeStatus == 'function' && this.props.tasksDetailsRealizeStatus(cellInfo)
    }

    render() {
        const {content_list,board_id } = this.props
        const { isAddSonTaskShow,isUploadWayViewShow,cartName,isSonTaskExecutorsShow,subTaskData } = this.state
        return (
            <View className={indexStyles.list_item}>

                <View className={indexStyles.title_row}>
                    <View className={`${indexStyles.list_item_left_iconnext}`}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe84f;</Text>
                    </View>
                    <View className={indexStyles.list_item_name}>关联任务</View>
                    {/* <View className={`${indexStyles.list_item_rigth_iconnext}`} onClick={this.deleteCardProperty}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe8b2;</Text>
                    </View> */}
                </View>

                <View className={indexStyles.song_task_centent}>
                    {
                        content_list && content_list.map((value, key) => {
                            const { name, is_completed,id } = value
                            // var is_warning = time_warning && (now > (due_time - 86400000 * time_warning) || now == (due_time - 86400000 * time_warning)) ? true : false;
                            // var is_overdue = due_time && now > due_time && is_realize == '0'
                            return (
                                <View key={key} className={indexStyles.content}>
                                    <View className={indexStyles.song_row_instyle}>
                                        <View className={indexStyles.song_row_left_instyle}>
                                            {
                                                is_completed == '0' ? (<View className={`${indexStyles.list_item_select_iconnext}`} onClick={() => this.tasksRealizeStatus(id, is_completed)}>
                                                    <Text className={`${globalStyle.global_iconfont}`}>&#xe6df;</Text>
                                                </View>) : (<View className={`${indexStyles.list_item_select_iconnext}`} onClick={() => this.tasksRealizeStatus(id, is_completed)}>
                                                    <Text className={`${globalStyle.global_iconfont}`}>&#xe844;</Text>
                                                </View>)
                                            }

                                            <View className={indexStyles.song_task_name}>{name}</View>
                                            {/* <View onClick={this.reminderToast}>
                                                <Input
                                                    className={indexStyles.song_task_name}
                                                    value={name}
                                                    confirmType='完成'
                                                    onBlur={this.updataInput.bind(this, id)}
                                                    disabled={true}
                                                >
                                                </Input>
                                            </View> */}
                                        </View>
                                        {/* tasksOption */}
                                        {/* <View className={`${indexStyles.list_item_rigth_iconnext}`} onClick={() => this.showUploadWayView(card_id,card_name,key)}>
                                         {
                                             is_overdue && <Text className={`${indexStyles.list_item_status} ${indexStyles.list_item_status_overdue}`}>逾期</Text>              
                                         }
                                         {
                                             is_warning &&  <Text className={`${indexStyles.list_item_status} ${indexStyles.list_item_status_warning}`}>预警</Text>          
                                         }
                                            <Text className={`${globalStyle.global_iconfont}`}>&#xe63f;</Text>
                                        </View> */}
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>

                
                {/* {
                    isAddSonTaskShow   ? (<AddSonTask subTaskData={subTaskData} propertyId={id}  showSonTaskExecutors={()=>this.showSonTaskExecutors()}   boardId={board_id} listId={id} cardId={id} onClickAction={(isUpdate)=>this.onClickAddSonTask(isUpdate)}></AddSonTask>) : (null)
                } */}
                {/* {
                    isUploadWayViewShow ? (<UploadWayView title={cartName}  editSubTask={()=>this.editSubTask()} mold='subTask' uploadFile={()=>this.uploadFile()} deleteAction={()=>this.deleteSongTasks()} onClickAction={()=>this.hideUploadWayView()} uploadWXFile={()=>this.fileUploadMessageFile()}></UploadWayView>):('')
                } */}
                {/* {isSonTaskExecutorsShow ? (<SonTaskExecutors  contentId={id} onClickAction={this.onClickSonTaskExecutors} executors={selectExecutorsList}></SonTaskExecutors>) : (null)} */}

            </View>
        )
    }
}
