import { connect } from '@tarojs/redux'
import Taro, { Component, } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { AtCheckbox, } from 'taro-ui'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'

@connect(({ tasks: { label_list = [], tasksDetailDatas = {}, }, }) => ({
    label_list, tasksDetailDatas,
}))
export default class LabelSelection extends Component {
    state = {
        item_id: '',
        checkedList: [],  //已选中数组
        checkboxOption: [],  //全部数组
    }

    // 取消选择
    cancelSelect() {
        typeof this.props.onClickAction == "function" &&
            this.props.onClickAction();
    }

    componentDidMount() {

        const { fieldValue, data, item_id} = this.props
        const itemData = data
        this.setState({
            item_id: item_id,
        })
        itemData.forEach(item => {
            item['label'] = item.item_value
            item['value'] = item.id
        })
        var new_arr = [];
        if (fieldValue) {
            new_arr = fieldValue.split(",");
        }


        this.setState({
            checkboxOption: itemData,
            checkedList: new_arr,
        })
    }

    handleChange(value) {

        var sa = new Set(this.state.checkedList);
        var sb = new Set(value);

        this.setState({
            checkedList: value
        })

        const valueStr = value.toString()

        const { dispatch, } = this.props
        const { item_id } = this.state

        if (this.state.checkedList.length > value.length) {  //删减

            dispatch({
                type: 'tasks/putBoardFieldRelation',
                payload: {
                    id: item_id,
                    field_value: valueStr,
                    calback: this.putBoardFieldRelation(value),
                }
            })
        }
        else if (this.state.checkedList.length < value.length) {  //增加

            dispatch({
                type: 'tasks/putBoardFieldRelation',
                payload: {
                    id: item_id,
                    field_value: valueStr,
                    calback: this.putBoardFieldRelation(value),
                }
            })
        }
    }

    putBoardFieldRelation = (value) => {
        const { dispatch, tasksDetailDatas, } = this.props
        const { fields = [] } = tasksDetailDatas
        var fieldValueStr = value.toString();
        fields.forEach(item => {
            if (item['field_content']['field_type'] === '2') {
                item.field_value = fieldValueStr
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
    /**
     * 选择
     * @param {*} item 
     */
    selectItem = item => {
        const {checkedList = []} = this.state;
        var currentCheckedList = checkedList;
        if(currentCheckedList.indexOf(item.id) != -1) {
            currentCheckedList = currentCheckedList.filter((value)=> {
                return item.id != value;
            });  

        } else {
            currentCheckedList.push(item.id)
        }
        this.setState({
            checkedList:  currentCheckedList,
        })
    }
    /**
     * 确定选择
     * @returns 
     */
     confirmSelect () {
        const {checkedList = [],item_id,dataArray} = this.state;
        const { dispatch, } = this.props
        const checkedStr = checkedList.toString;
        dispatch({
            type: 'tasks/putBoardFieldRelation',
            payload: {
                id: item_id,
                field_value: checkedList.toString(),
                calback: this.putBoardFieldRelation(checkedList),
            }
        }).then(res=>{
            this.cancelSelect()
        })
     }
    render() {

        const { checkboxOption = [],checkedList } = this.state
        const {title} = this.props
        return (
            <View className={indexStyles.index}>
               <View className={indexStyles.content_view}>
                <View className={indexStyles.content_topline_view}></View>
                <View className={indexStyles.content_title_view}>
                   <View className={indexStyles.content_title_left}>
                      <View className={indexStyles.content_title_text}>{title}</View>
                   </View>
                   <View className={indexStyles.content_confirm} onClick={this.confirmSelect}>确定</View>
                </View>
                <ScrollView className={indexStyles.scrollview} scrollY scrollWithAnimation>
                   {
                       checkboxOption && checkboxOption.map((item,key)=>{
                        //    const isSelected = item.label == current_select_name;
                           const  isSelected = checkedList.indexOf(item.id) != -1;
                           return (
                            
                               <View className={`${indexStyles.content_item}`} onClick={this.selectItem.bind(this,item)}>
                                   <View className={`${indexStyles.content_item_name} ${isSelected ? indexStyles.content_item_selected : ''}`}>{item.label}</View>
                                   {
                                       isSelected ? (
                                        <View className={`${globalStyle.global_iconfont} ${indexStyles.item_iconfont} ${isSelected ? indexStyles.content_item_selected : ''}`}>&#xe66a;</View>
                                       ):(
                                        <View className={`${globalStyle.global_iconfont} ${indexStyles.item_iconfont}`}>&#xe661;</View>
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

