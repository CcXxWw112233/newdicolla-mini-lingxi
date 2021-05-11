import Taro, { Component } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import indexStyles from './index.scss'
import globalStyle from "../../gloalSet/styles/globalStyles.scss";

@connect(({ tasks: {
  // executors_list = [], 
  tasksDetailDatas = {} } }) => ({
    // executors_list,
    tasksDetailDatas,
  }))
export default class fieldPersonMultiple extends Component {
  config = {
    navigationBarTitleText: "多选人员",
  };

  constructor() {
    super(...arguments);
    this.state = {
      checkedList: [], //已选中数组
      checkboxOption: [], //全部数组
      itemId: "",
    };
  }

  componentDidMount() {
    const { contentId, executors = [], item_id, executorsList, } = this.props;
    let executorsData;
    let new_arr;
    let newCheckedList = [];
    if (executors.length > 0) {
      executorsData = executors;
      //取出已经是执行人的id, 组成新数组(已选中)
      new_arr = executorsData && executorsData.map((obj) => {
        return obj.user_id ? obj.user_id : obj.id;
      });
      newCheckedList = executorsData && executorsData.map((obj) => {
        return obj.user_id ? obj.user_id : obj.id;
      });
    }

    this.setState({
      card_id: contentId,
      itemId: item_id,
    });

    const executors_list = executorsList;
    executors_list.forEach((item) => {
      item["label"] = item.name;
      item["value"] = item.id ? item.id : item.user_id;
    });

    this.setState({
      checkboxOption: executors_list,
      checkedList: new_arr,
      newCheckedList:newCheckedList
    });
  }

  handleChange(value) {
    this.setState({
      checkedList: value,
    });

    var valueText = value.join(",");

    const { dispatch } = this.props;
    const { itemId } = this.state;

    dispatch({
      type: "tasks/putBoardFieldRelation",
      payload: {
        id: itemId,
        field_value: valueText,
      },
    });
  }

  //更改本地数据
  deleteCardExecutor = (value) => {
    const { dispatch, tasksDetailDatas, executors_list = [], } = this.props;
    const { properties = [] } = tasksDetailDatas;

    let array = [];
    for (let i = 0; i < value.length; i++) {
      executors_list.forEach((obj) => {
        var id = obj.id ? obj.id : obj.user_id;
        if (id === value[i]) {
          array.push(obj);
        }
      });
    }
    properties.forEach((item) => {
      if (item["code"] === "EXECUTOR") {
        item.data = array;
      }
    });

    dispatch({
      type: "tasks/updateDatas",
      payload: {
        tasksDetailDatas: {
          ...tasksDetailDatas,
          ...properties,
        },
      },
    });
  };
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
  var {newCheckedList = []} = this.state;
  var id = item.id ? item.id : item.user_id;
  if(newCheckedList.indexOf(id) != -1) {
    newCheckedList = newCheckedList.filter((value)=> {
          return id != value;
      });  
  } else {
    newCheckedList.push(id)
      }
      this.setState({
        newCheckedList:  newCheckedList,
      })
  }
  /**
   * 重置
   */
   resetAction() {     
      this.setState({
        newCheckedList:  [],
      })
   }
  /**
   * 确定选择
   * @returns 
   */
  confirmSelect () {
      const {checkedList = [],itemId,newCheckedList} = this.state;
      const {dispatch,title} = this.props
      // if(newCheckedList && newCheckedList.length > 0) {
        dispatch({
          type: "tasks/putBoardFieldRelation",
          payload: {
            id: itemId,
            field_value: newCheckedList.join(",")
          },
        });
        this.onClickAction()
      // } else {
      //   Taro.showToast({
      //     title: '请选择' + title,
      //     icon: 'none',
      //     duration: 2000
      //   })
      // }
  }

  render() {
    const { checkboxOption = [],newCheckedList } = this.state;
    return (
      // <View className={indexStyles.fieldSelectionView}>

      //   <View className={indexStyles.index}>
      //     <View className={indexStyles.titleView}>请选择</View>
      //     <ScrollView className={indexStyles.scrollview} scrollY scrollWithAnimation>

      //       <AtCheckbox
      //         options={checkboxOption}
      //         selectedList={this.state.checkedList}
      //         onChange={this.handleChange.bind(this)} />
      //     </ScrollView>
      //     <View className={indexStyles.bootomBtnView}>
      //       <View onClick={this.onClickAction} className={indexStyles.btnView}>确定</View>
      //     </View>
      //   </View>
      // </View>
      <View className={indexStyles.index} onTouchMove={(e) => {e.stopPropagation()}} onClick={this.onClickAction}>
        <View className={indexStyles.content_view} onClick={(e) => {e.stopPropagation()}}>
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
                          checkboxOption && checkboxOption.map((item,key)=>{
                            var id = item.id ? item.id : item.user_id;

                              const isSelected = newCheckedList.indexOf(id) != -1;
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
          <View className={indexStyles.reset_View} onClick={this.resetAction} hover-class={indexStyles.lattice_hover_style}>重置负责人</View>
          <View className={indexStyles.cencel_View} onClick={this.onClickAction} >取消</View>
        </View>
    </View>
    );
  }
}

fieldPersonMultiple.defaultProps = {};
