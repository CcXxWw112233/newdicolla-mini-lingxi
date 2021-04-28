import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView,RichText } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtCheckbox } from 'taro-ui'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import { isApiResponseOk, } from "../../utils/request";

@connect(({ tasks: { tasksDetailDatas = {}, field_selection_list = [], field_selection_group_list = [], }, }) => ({
    tasksDetailDatas, field_selection_list, field_selection_group_list,
}))
export default class fieldSelection extends Component {
    config = {
        navigationBarTitleText: '全部字段'
    }

    constructor() {
        super(...arguments)
        this.state = {
            checkedList: [],  //已选中数组
            checkboxOption: [],  //全部数组
            card_id: '', //card_id, relation_id
        }
    }

    componentDidMount() {
        this.getMoreCustomField()        
    }
    /**
     * 重组字段分组的数据
     */
    regroup (fields) {
        const { field_selection_list = [], field_selection_group_list = [], } = this.props
        let new_group_array = []
        field_selection_group_list && field_selection_group_list.forEach(objData => {
            if (objData.fields) {
                objData.fields.forEach(item => {
                    item.desc = objData.name   //把分组名称作为描述
                })
                new_group_array.push(objData.fields)
            }
        })
        var combinationArray = [];
        if (new_group_array && new_group_array.length > 0) {
            combinationArray = new_group_array && new_group_array.length > 0 && new_group_array.reduce(function (a, b) { return a.concat(b) });
        }
        var finalArray = [];
        if (field_selection_list && field_selection_list.length > 0) {
            finalArray = field_selection_list && field_selection_list.length > 0 && combinationArray.concat(field_selection_list)
        } else {
            finalArray = combinationArray;
        }
        finalArray && finalArray.forEach(item => {
            item['label'] = item.name
            item['value'] = item.id
            item['desc'] = item.desc
        })

        //取出已经是执行人的id, 组成新数组(已选中)
        // let new_arr = fieldsData.map(obj => { return obj.field_id });

        this.setState({
            checkboxOption: finalArray,
            // checkedList: new_arr,
        })
        var newArr = [];
        for (var i = 0; i < finalArray.length; i++) {
            //我们将arr2中的元素依次放入函数中进行比较，然后接收函数的返回值
            if (this.noExist(finalArray[i]['id'], fields)) { //如果返回的值是true，我们将元素放入新的数组中
                newArr[newArr.length] = finalArray[i];
            } else {
                // checkedList[checkedList.length] = finalArray[i];
            }
        } 
        this.setState({
            checkboxOption: newArr,
        })
    }

    getMoreCustomField = e => {
        const { dispatch, tasksDetailDatas = {} } = this.props;
        const {  org_id, fields,card_id } = tasksDetailDatas;
        var that = this;
        Promise.resolve(
          dispatch({
              type: "tasks/getBoardFieldGroupList",
              payload: {
                  org_id: org_id,
              },
          })
        ).then((res) => {
            if (isApiResponseOk(res)) {
                let new_group_array = []
                let field_selection_group_list = res && res.data && res.data.groups;
                field_selection_group_list && field_selection_group_list.forEach(objData => {
                    if (objData.fields) {
                        new_group_array.push(objData.fields)
                    }
                })
                if (res.data && ((new_group_array.length > 0) || (res.data.fields && res.data.fields.length > 0))) {
                    that.setState({
                        checkedList: fields,
                        card_id: card_id,
                    })
                    that.regroup(fields);
                } else {
                    Taro.showToast({
                        title: '没有字段可选',
                        icon: 'none',
                        duration: 2000
                    })
                }
            }
        });
    
      }
    noExist(num, arr1) {
        for (var j = 0; j < arr1.length; j++) {
            if (num === arr1[j]['field_id']) {
                return false; //如果传过来的元素在arr1中能找到相匹配的元素，我们返回fasle
            }
        }
        return true; //如果不能找到相匹配的元素，返回true
    }

    handleChange(value) {
        var sa = new Set(this.state.checkedList);
        var sb = new Set(value);
        const { dispatch } = this.props
        const { card_id } = this.state
        this.setState({
            checkedList: value
        })
        if (this.state.checkedList.length > value.length) {  //删减

        }
        else if (this.state.checkedList.length < value.length) {  //增加
            //补集
            let complement = [...this.state.checkedList.filter(x => !sb.has(x)), ...value.filter(x => !sa.has(x))];
            let executor_id = complement[0];
            
            dispatch({
                type: 'tasks/postBoardFieldRelation',
                payload: {
                    fields: [executor_id],
                    relation_id: card_id,
                    source_type: '2',
                },
            })
        }
    }
    onClickAction() {
        typeof this.props.onClickAction == "function" &&
            this.props.onClickAction();
    }
    /**
     * 增加字段
     * @param {}} item 
     */
    addField = item => {
        const { dispatch,tasksDetailDatas } = this.props
        var { card_id,checkboxOption,checkedList } = this.state
        var fields = [item.id];
        var that = this;
        Promise.resolve(
            dispatch({
                type: 'tasks/postBoardFieldRelation',
                payload: {
                    fields: fields,
                    relation_id: card_id,
                    source_type: '2',
                },
            })
          ).then(res => {
            Promise.resolve(
                dispatch({
                    type: "tasks/getTasksDetail",
                    payload: {
                        id: card_id,
                        boardId: tasksDetailDatas.board_id,
                    },
                })
            ).then((res) => {
                that.getMoreCustomField();
            });
          })
    }
    /**
     * 减少字段
     * @param {*} item 
     */
    deleteField = item => {
        const { dispatch, tasksDetailDatas} = this.props
        var { card_id,checkboxOption,checkedList } = this.state;
        var that = this;
        Promise.resolve(
            dispatch({
                type: 'tasks/deleteBoardFieldRelation',
                payload: {
                    id: item.id,
                },
            })
          ).then(res => {
            Promise.resolve(
                dispatch({
                    type: "tasks/getTasksDetail",
                    payload: {
                        id: card_id,
                        boardId: tasksDetailDatas.board_id,
                    },
                })
            ).then((res) => {
                that.getMoreCustomField();
            });
          })
    }

    leftIcon = code => {
        var icon = '';
        if(code == 1) {
            icon = '&#xe8b0;'
        } else if(code == 2) {
            icon = '&#xe8b1;';
        } else if (code == 3) {
            icon = '&#xe868;';
        } else if (code == 4) {
            icon = '&#xe86a;'
        } else if (code == 5) {
            icon = '&#xe869;'
        } else if (code == 6) {
            icon = '&#xe86b;'
        } else if (code == 7) {
            icon = '&#xe878;'
        } else if (code == 8) {
            icon = '&#xe878;'
        }
        return icon;
    }


    render() {
        const { checkboxOption = [],checkedList=[] } = this.state
        //  1 单选字段
        //                     2 多选字段
        //                     3 日期字段
        //                     4 数字字段
        //                     5 文本字段
        //                     6 文件字段
        //                     7 评分字段
        //                     8 成员-单人
        //                     8 成员-多人
        return (
            <View className={indexStyles.index}>
                <View className={indexStyles.bgView}>
                <View className={indexStyles.topText}>添加和调整显示在“任务详情”中的字段</View>
                <ScrollView className={indexStyles.fileList_scrollView} scrollY scrollWithAnimation>
                    <View className={indexStyles.fileList_title}>已添加</View>
                      {
                          checkedList && checkedList.length > 0 ? (
                            checkedList.map((item,key)=> {
                                return (
                                <View className = {indexStyles.fileList_item} key={key} >
                                    <View onClick = {this.deleteField.bind(this,item)} className={`${globalStyle.global_iconfont} ${indexStyles.fileList_item_icon} ${indexStyles.fileList_item_add_icon}`}>&#xe891;</View>
                                    <RichText className={`${globalStyle.global_iconfont} ${indexStyles.fileList_item_icon}`} nodes={this.leftIcon(item.field_content.field_type)}></RichText>
                                    <Text className={indexStyles.indexStyles.fileList_item_title}>{item.field_content.name}</Text>
                                </View>
                                )
                              })
                          ) :(
                            <View className={indexStyles.noDataText_View}>未添加字段</View>
                          )
                      }
                      

                    <View className={indexStyles.fileList_title}>更多</View>
                        {
                            checkboxOption && checkboxOption.length > 0 ? (
                                checkboxOption && checkboxOption.map((item,key)=> {
                                    return (
                                        <View className = {indexStyles.fileList_item} key={key} >
                                            <View  onClick={this.addField.bind(this,item)} className={`${globalStyle.global_iconfont}  ${indexStyles.fileList_item_icon} ${indexStyles.fileList_item_more_icon}`} >&#xe890;</View>
                                            <RichText className={`${globalStyle.global_iconfont} ${indexStyles.fileList_item_icon}`} nodes={this.leftIcon(item.field_type)}></RichText>
                                            <Text className={indexStyles.indexStyles.fileList_item_title}>{item.label}</Text>
                                        </View>
    
                                    )
                                })
                            ):(
                                <View className={indexStyles.noDataText_View}>暂无更多字段可添加</View>
                            )    
                        }
                    <View className={indexStyles.bottom_placeView}></View>
                </ScrollView>
                </View>    
            </View>
        )
    }
}

fieldSelection.defaultProps = {

};