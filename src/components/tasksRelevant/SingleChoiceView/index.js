import Taro, { Component } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import { AtRadio } from 'taro-ui'

@connect(({ tasks: { tasksDetailDatas = {}, }, }) => ({
    tasksDetailDatas,
}))
export default class SingleChoicePicker extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            current_select_name: '未选择',
            value: '', //当选选中id
            singleList: [],  //数据列表 
            field_single_choice_id: '', //当前选中字段id
        }
    }

    onChange(e) {
        //更新任务分组
        const { dispatch, } = this.props
        const { field_single_choice_id, field_item_id, singleList,currentItem } = this.state
        var value = currentItem['value'];
        let fieldValue
        if (field_single_choice_id === value) {
            this.cancelSelect()
        }
        else {
            this.setState({
                field_single_choice_id: value,
                current_select_name: currentItem['label'] ? currentItem['label'] : ''
            })
            fieldValue = value
            dispatch({
                type: 'tasks/putBoardFieldRelation',
                payload: {
                    id: field_item_id,
                    field_value: fieldValue,
                    calback: this.putBoardFieldRelation(value),
                }
            })
        }
        this.cancelSelect()

    }

    putBoardFieldRelation = (value) => {

        const { singleList = [], field_item_id, } = this.state

        let fieldValue = ''
        singleList.forEach(obj => {
            if (obj['id'] === value) {
                fieldValue = obj.id;
            }
        })

        const { dispatch, tasksDetailDatas, } = this.props
        const { fields = [] } = tasksDetailDatas

        fields.forEach(item => {

            if (item.id === field_item_id) {
                item.field_value = fieldValue
            }
        })

        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                tasksDetailDatas: {
                    ...tasksDetailDatas,
                    ...singleList,
                }
            }
        })
    }

    componentDidMount() {

        const { items, field_value, field_item_id, tasksDetailDatas, editAuth,title,currentName } = this.props
        const itemsData = items;
        const { fields = [] } = tasksDetailDatas

        this.setState({
            value: field_value,  //当选选中id
            field_single_choice_id: field_value,
            field_item_id: field_item_id, //单选字段id
            current_select_name:currentName
        })

        itemsData.forEach(item => {
            item['label'] = item.item_value
            item['value'] = item.id
        })

        let fieldValue = ''
        itemsData.forEach(obj => {
            if (obj['id'] === field_value) {
                this.setState({
                    title: obj.label
                })
            }
        })
        fields.forEach(item => {

            if (item.id === field_item_id) {
                item.field_value = fieldValue
            }
        })
        this.setState({
            singleList: itemsData,
        })
    }
 /**
     * 选择
     * @param {*} item 
     */
  selectItem = (item) => {
      const {current_select_name} = this.state
      if(current_select_name == item.label) {
        this.setState({
            currentItem:'',
            current_select_name:''
        })
      } else {
        this.setState({
            currentItem:item,
            current_select_name:item.label
        })
      }
}
 /**
 * 确定选择
 */
  confirmSelect () {       
    this.onChange()
  }

   /**
 * 取消选择
 */
cancelSelect () {
    typeof this.props.onClickAction == "function" &&
    this.props.onClickAction();
}
    render() {
        const { singleList = [], title, current_select_name } = this.state
        const rangeKey = 'label';
        console.log(singleList);
        return (
            <View className={indexStyles.index}>

                {/* <Picker rangeKey={rangeKey} mode='selector' disabled={!editAuth} range={singleList} onChange={this.onChange}>
                    <View className={indexStyles.projectNameCellPicker}>
                        {current_select_name != '未选择' || !title ? current_select_name : title}
                    </View>
                </Picker> */}
                   <View className={indexStyles.content_view}>
                    <View className={indexStyles.content_topline_view}></View>
                    <View className={indexStyles.content_title_view}>
                       <View className={indexStyles.content_title_left}>
                          <View className={`${globalStyle.global_iconfont} ${indexStyles.iconfont}`}>&#xe6a8;</View>
                          <View className={indexStyles.content_title_text}>{title}</View>
                       </View>
                       <View className={indexStyles.content_confirm} onClick={this.confirmSelect}>确定</View>
                    </View>
                    <ScrollView className={indexStyles.scrollview} scrollY scrollWithAnimation>
                       {
                           singleList && singleList.map((item,key)=>{
                               const isSelected = item.label == current_select_name;
                               return (
                                
                                   <View className={`${indexStyles.content_item}`} onClick={this.selectItem.bind(this,item)}>
                                       <View className={`${indexStyles.content_item_name} ${isSelected ? indexStyles.content_item_selected : ''}`}>{item.label}</View>
                                       {
                                           isSelected ? (
                                            <View className={`${globalStyle.global_iconfont} ${indexStyles.item_iconfont} ${isSelected ? indexStyles.content_item_selected : ''}`}>&#xe844;</View>
                                           ):(
                                            <View className={`${globalStyle.global_iconfont} ${indexStyles.item_iconfont}`}>&#xe6df;</View>
                                           )
                                       }
                                   </View>
                               )
                           })
                       }
                    </ScrollView>
                    <View className={indexStyles.cencel_View} onClick={this.cancelSelect}>取消</View>
                </View>
            </View>
        )
    }
}

