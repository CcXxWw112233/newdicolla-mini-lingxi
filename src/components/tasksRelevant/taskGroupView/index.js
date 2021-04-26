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
        const { contentId, listId,currentName } = this.props;
        this.setState({
            card_id: contentId,
            value: listId,
            listId:listId,
            current_select_taskGroup_name:currentName
        })
        const { tasksGroupList = [],cu } = this.props

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
                    calback: this.putCardBaseInfo(currtne_value, listId),
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
        console.log(item)
        this.setState({
            currentItem:item,
            listId:item.list_id,
            current_select_taskGroup_name:item.list_name
        })
    }
    /**
     * 确定选择
     */
    confirmSelect () {
        const {contentId,dispatch,listId} = this.props;
        const {currentItem} = this.state;
        if(!currentItem)  {
            this.cancelSelect()
            return
        }
        dispatch({
            type: 'tasks/putCardBaseInfo',
            payload: {
                card_id: contentId,
                list_id: currentItem.list_id,
                calback: this.putCardBaseInfo(currentItem.list_id,listId),
            }
        }).then(res => {
            // this.setState({
            //     current_select_taskGroup_name: tasksGroupList[e.detail.value]['list_name']
            // })
            this.cancelSelect()
        })
    }
    /**
     * 取消选择
     */
    cancelSelect () {
        typeof this.props.onClickAction == "function" &&
        this.props.onClickAction();
    }
    render() {
        const {
            title,
            tasksGroupList,
            editAuth,
        } = this.props;
        const { current_select_taskGroup_name,listId } = this.state;
        var rangeKey = 'list_name';
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
                          <View className={indexStyles.content_title_text}>{title}</View>
                       </View>
                       <View className={indexStyles.content_confirm} onClick={this.confirmSelect}>确定</View>
                    </View>
                    <ScrollView className={indexStyles.scrollview} scrollY scrollWithAnimation>
                       {
                           tasksGroupList && tasksGroupList.map((item,key)=>{
                               const isSelected = item.list_id == listId;
                               return (
                                
                                   <View className={`${indexStyles.content_item}`} onClick={this.selectItem.bind(this,item)}>
                                       <View className={`${indexStyles.content_item_name} ${isSelected ? indexStyles.content_item_selected : ''}`}>{item.list_name}</View>
                                       {
                                           isSelected ? (
                                            <View className={`${globalStyles.global_iconfont} ${indexStyles.item_iconfont} ${isSelected ? indexStyles.content_item_selected : ''}`}>&#xe844;</View>
                                           ):(
                                            <View className={`${globalStyles.global_iconfont} ${indexStyles.item_iconfont}`}>&#xe6df;</View>
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