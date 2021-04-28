import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker,ScrollView,RichText } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
@connect(({
    tasks: { milestone_list = [], tasksDetailDatas, },
}) => ({
    milestone_list, tasksDetailDatas,
}))
export default class taskGroupPicker extends Component {
    state = {
        current_select_taskGroup_name: '未选择'
    }

    componentDidMount() {
        let contentId = Taro.getStorageSync("tasks_detail_contentId");
        const { selectgroupList = [],groupList = [] } = this.props

        var selectIdList = selectgroupList.map(item=>{
            return item.list_id
        })
        var newCheckedList = selectgroupList.map(item=>{
            return item.list_id
        })
        this.setState({
            selectgroupList: selectIdList,
            groupList:groupList,
            newCheckedList:newCheckedList,
            contentId:contentId
        })
        // tasksGroupList.forEach(item => {
        //     item['label'] = item.list_name
        //     item['value'] = item.list_id
        // })
    }
    putCardBaseInfo = (value, currtne_value,) => {
        const { tasksGroupList = [], } = this.state
        let listName = ''
        if (value !== currtne_value) {
            // tasksGroupList.forEach(obj => {
            // if (obj['list_id'] === value) {
            // listName = obj.list_name;
            // }
            // })
        }
        else {
            // this.setState({
            // value: '',
            // })
        }
        const { dispatch, tasksDetailDatas, } = this.props
        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                tasksDetailDatas: {
                    ...tasksDetailDatas,
                    ...{ list_name: listName },
                }
            }
        })
    }
    onChange = e => {
        const {
            tasksGroupList,
            listId,
            contentId
        } = this.props;
        var listId1 = listId;
        var currtne_value = tasksGroupList[e.detail.value]['list_id']
        if (currtne_value !== listId) {
            listId1 = currtne_value
            //更新任务分组
            const { dispatch } = this.props
            const { card_id } = this.state
            dispatch({
                type: 'tasks/putCardBaseInfo',
                payload: {
                    card_id: contentId,
                    list_id: currtne_value,
                    // calback: this.putCardBaseInfo(currtne_value, listId),
                }
            }).then(res => {
                this.setState({
                    current_select_taskGroup_name: tasksGroupList[e.detail.value]['list_name']
                })
            })
        }
    }
    /**
     * 选择
     * @param {*} item 
     */
    selectItem = (item) => {
        // console.log(item)
        // this.setState({
        //     currentItem:item,
        //     listId:item.list_id,
        //     current_select_taskGroup_name:item.list_name
        // })
        var {newCheckedList = []} = this.state;
        if(newCheckedList.indexOf(item.list_id) != -1) {
            newCheckedList = newCheckedList.filter((value)=> {
                return item.list_id != value;
            });  
        } else {
            newCheckedList.push(item.list_id)
        }
        this.setState({
            newCheckedList:  newCheckedList,
        })

    }
    
    /**
     * 确定选择
     */
    confirmSelect () {

        const {dispatch,listId} = this.props;
        const {contentId} = this.state
        // const {currentItem} = this.state;
        // if(!currentItem)  {
        //     this.cancelSelect()
        //     return
        // }
        // dispatch({
        //     type: 'tasks/putCardBaseInfo',
        //     payload: {
        //         card_id: contentId,
        //         list_id: currentItem.list_id,
        //         calback: this.putCardBaseInfo(currentItem.list_id,listId),
        //     }
        // }).then(res => {
        //     // this.setState({
        //     //     current_select_taskGroup_name: tasksGroupList[e.detail.value]['list_name']
        //     // })
        //     typeof this.props.onClickAction == "function" &&
        //     this.props.onClickAction(currentItem.list_name);
        // })
        const {newCheckedList = [],card_id,selectgroupList=[]} = this.state;
        if(newCheckedList.length == 0 || !newCheckedList) {
            Taro.showToast({
                title: '请选择任务分组',
                icon: 'none',
                duration: 2000
              })
              return
        }
        // 现在选择的和已选择的差集
        const handelarr = newCheckedList.concat(selectgroupList).filter(function(v, i, arr) {
            return arr.indexOf(v) === arr.lastIndexOf(v);     
        });
        handelarr.forEach(item => {
            // 删除
            if(selectgroupList.indexOf(item) != -1) {
                console.log("删除",item)
                  dispatch({
                    type: 'tasks/deleteTaskGroup',
                    payload: {
                        list_id: item,
                        card_id: contentId,
                        // callBack: this.putCardLabel(newCheckedList),
                    },
                  })
            } else {
                console.log("增加",item)

                // 增加
                   dispatch({
                        type: 'tasks/putBoardtaskGroup',
                        payload: {
                            list_id: item,
                        card_id: contentId,
                        // calback: this.putCardBaseInfo(currentItem.list_id,listId),
                        },
                    })
            }
        })
            
        this.cancelSelect(newCheckedList)

        
        // this.putCardLabel(newCheckedList)
    }
    /**
     * 取消选择
     */
     cancelSelect (newCheckedList) {
        const {selectgroupList=[]} = this.state;

         if(!newCheckedList) {
            newCheckedList = selectgroupList
         }
        typeof this.props.onClickAction == "function" &&
        this.props.onClickAction(newCheckedList);
    }
    render() {
        const {
             selectgroupList,
            groupList,
            newCheckedList
        } = this.state;
        return (
            <View className={indexStyles.index}>
                {/* <Picker rangeKey={rangeKey} disabled={!editAuth} mode='selector' range={tasksGroupList} onChange={this.onChange}>
                    <View className={indexStyles.projectNameCellPicker}>
                        {current_select_taskGroup_name != '未选择' || !title ? current_select_taskGroup_name : title}
                    </View>
                </Picker> */}
                <View className={indexStyles.content_view}>
                    <View className={indexStyles.content_topline_view}></View>
                    <View className={indexStyles.content_title_view}>
                       <View className={indexStyles.content_title_left}>
                          <View className={`${globalStyles.global_iconfont} ${indexStyles.iconfont}`}>&#xe6a8;</View>
                          <View className={indexStyles.content_title_text}>任务分组</View>
                       </View>
                       <View className={indexStyles.content_confirm} onClick={this.confirmSelect}>确定</View>
                    </View>
                    <ScrollView className={indexStyles.scrollview} scrollY scrollWithAnimation>
                       {
                           groupList && groupList.map((item,key)=>{
                               
                            const  isSelected = newCheckedList.indexOf(item.list_id) != -1;
                            return (

                                   <View className={`${indexStyles.content_item}`} onClick={this.selectItem.bind(this,item)}>
                                       <View className={`${indexStyles.content_item_name} ${isSelected ? indexStyles.content_item_selected : ''}`}>{item.list_name}</View>
                                       {
                                            isSelected ? (
                                            <View className={`${globalStyles.global_iconfont} ${indexStyles.item_iconfont} ${isSelected ? indexStyles.content_item_selected : ''}`}>&#xe66a;</View>
                                            ):(
                                            <View className={`${globalStyles.global_iconfont} ${indexStyles.item_iconfont}`}>&#xe661;</View>
                                            )
                                        }
                                   </View>
                               )
                           })
                       }
                    </ScrollView>
                    <View className={indexStyles.cencel_View} onClick={this.cancelSelect}>取消</View>
                </View>
            </View >
        );
    }

}
taskGroupPicker.defaultProps = {
    title: "", //显示的信息, 是
    dataArray: [], //Picker的自定义数据源, 是
    tag: "", //标识符, 是
};