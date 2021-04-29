import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import indexStyles from './index.scss'
import globalStyle from "../../../gloalSet/styles/globalStyles.scss";

@connect(({ tasks: {
    tasksDetailDatas = {},
} }) => ({
    tasksDetailDatas,
}))
export default class FieldPersonSinglePicker extends Component {
    // config = {
    // navigationBarTitleText: "人员单选",
    // };

    constructor() {
        super(...arguments);
        this.state = {
            value: "", //当选选中id
            singleList: [], //数据列表
            itemId: "",
            current_select_user_id: '', //当前选中人员的id,
            current_select_name: '未选择',
            executors1: []
        };
    }

    // onChange(e) {
    //     const { dispatch, executorsList, item_id } = this.props
    //     const { itemId, current_select_user_id, singleList } = this.state
    //     var value = executorsList[e.detail.value]['user_id'];
    //     if (current_select_user_id === value) {
    //     }
    //     else {
    //         var executors1 = [];
    //         executors1.push(executorsList[e.detail.value])
    //         this.setState({
    //             current_select_user_id: value,
    //             current_select_name: executorsList[e.detail.value]['name'],
    //             executors1: executors1,
    //             select_user_id:select_user_id
    //         });

    //         dispatch({
    //             type: "tasks/putBoardFieldRelation",
    //             payload: {
    //                 id: item_id,
    //                 field_value: value,
    //                 calback: this.putBoardFieldRelation(value),
    //             },
    //         });
    //     }

    // }

    putBoardFieldRelation = (value) => {
        const { singleList = [], field_item_id } = this.state;

        let fieldValue = "";
        singleList.forEach((obj) => {
            var id = obj.user_id ? obj.user_id : obj.id;

            if (id === value) {
                fieldValue = obj.id;
            }
        });

        const { dispatch, tasksDetailDatas } = this.props;
        const { fields = [] } = tasksDetailDatas;

        fields.forEach((item) => {
           var id = item.user_id ? item.user_id : item.id;

            if (id === field_item_id) {
                item.field_value = fieldValue;
            }
        });

        dispatch({
            type: "tasks/updateDatas",
            payload: {
                tasksDetailDatas: {
                    ...tasksDetailDatas,
                    ...singleList,
                },
            },
        });
    };

    componentDidMount() {
        const { executors, item_id, executorsList, } = this.props;
        const itemsData = executors;
        const itemsDataIdValue = itemsData && itemsData[0] && itemsData[0]["id"];
        const select_user_id = itemsData && itemsData[0] && itemsData[0]["id"];
        const executors_list = executorsList;
        executors_list && executors_list.forEach((item) => {
            item["label"] = item.name;
            item["value"] = item.id ? item.id : item.user_id;
        });
        this.setState({
            singleList: executors_list,
            value: itemsDataIdValue, //当前选中人员id
            itemId: item_id,
            current_select_user_id: itemsDataIdValue,
            select_user_id:select_user_id
        });
    }
    /**
    * 取消
    */
    onClickAction() {
        typeof this.props.onClickAction == "function" &&
            this.props.onClickAction();
    }
    /**
     * 选择
     * @param {*} item 
     */
    selectItem = item => {
        const {current_select_user_id} = this.state
        var id = item.user_id ? item.user_id : item.id;
        this.setState({
            current_select_user_id:id == current_select_user_id ? '' : id
        })
    }
    /**
     * 确定选择
     * @returns 
     */
     confirmSelect () {
         const {select_user_id, current_select_user_id,} = this.state; 

         const {item_id,dispatch,title} = this.props;
        //  if(current_select_user_id) {
            if(current_select_user_id != select_user_id) {
                dispatch({
                    type: "tasks/putBoardFieldRelation",
                    payload: {
                        id: item_id,
                        field_value: current_select_user_id,
                        calback: this.putBoardFieldRelation(current_select_user_id),
                    },
                });
             }
             this.onClickAction()
        //  } else {
        //     Taro.showToast({
        //         title: '请选择' + title,
        //         icon: 'none',
        //         duration: 2000
        //       })
        //  }
        
     }
    render() {

        const { singleList = [], current_select_name, current_select_user_id,select_user_id } = this.state;
        const rangeKey = "name";
        const { executors = [],  title } = this.props;
        var isShowAvator = false;
        if (executors.length) {
            isShowAvator = true
            current_select_name != '未选择'
        }
        if (current_select_name != '未选择') {
            isShowAvator = true
        }
        return (
            // <View>
            //     {/* <AtRadio
            //         options={singleList}
            //         value={this.state.value}
            //         onClick={this.handleChange.bind(this)}
            //     /> */}
            //     <Picker rangeKey={rangeKey} mode='selector' disabled={!editAuth} range={executorsList} onChange={this.onChange}>
            //         <View className={indexStyles.projectNameCellPicker}>
            //             {!isShowAvator ? "未选择" : <Avatar avartarTotal={"multiple"} userList={executors1.length ? executors1 : executors} />}
            //         </View>
            //     </Picker>
            // </View>
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
                <View className={indexStyles.grid_style}>
                        {
                            singleList && singleList.map((item,key)=>{
                                var id = item.user_id ? item.user_id : item.id;

                                const isSelected = current_select_user_id == id;
                                console.log('sssssssssssssssss',isSelected,current_select_user_id,item)
                              return (
                                  <View className={indexStyles.lattice_style} key={key} onClick={this.selectItem.bind(this,item)}>  
                                     {
                                         isSelected ? (
                                            <Text className={`${globalStyle.global_iconfont} ${indexStyles.checked_iconfont}`}>&#xe844;</Text>
                                         ):('')
                                     }
                                    {
                                    item.avatar ? (
                                      <Image src={item.avatar} className={indexStyles.content_avatar}></Image>
                                    ) :(
                                      <View className={`${globalStyle.global_iconfont} ${indexStyles.content_avatar}`}>&#xe878;</View>
                                    )

                                  }
                                    <Text className={indexStyles.content_avatar_name}>{item.name || item.mobile}</Text>
                                 </View>
                             )
                          })
                        }
                </View>
             </ScrollView>
             {/* <View className={indexStyles.reset_View} onClick={this.resetAction}>重置负责人</View> */}
             <View className={indexStyles.cencel_View} onClick={this.onClickAction} >取消</View>
            </View>
         </View>
        );
    }
}

FieldPersonSinglePicker.defaultProps = {};
