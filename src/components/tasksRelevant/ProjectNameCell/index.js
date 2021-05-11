import Taro, { Component } from "@tarojs/taro";
import { View, Text, RichText, Picker } from "@tarojs/components";
import indexStyles from "./index.scss";
import globalStyle from "../../../gloalSet/styles/globalStyles.scss";
import Avatar from "../../avatar";
import { connect } from "@tarojs/redux";
import { isApiResponseOk, } from "../../../utils/request";
import { getOrgIdByBoardId, } from '../../../utils/basicFunction'
import { MilestoneCellView } from "../milestoneCellView";
import { textField } from '../../../pages/textField'
import { DateField } from '../../../pages/dateField'
import { FieldSelection } from '../../../pages/fieldSelection'
import { FieldPersonMultiple } from '../../../pages/fieldPersonMultiple'
import { SingleChoiceView } from '../SingleChoiceView'
import { FieldPersonSingleView } from '../FieldPersonSingleView'
import { ExecutorsList } from '../../../pages/executorsList'
import {selectPersonView} from '../../selectPersonView'


@connect(
    ({
        tasks: {
            tasksDetailDatas = {},
            properties_list = [],
        },
        board: {
            board_detail = {},
        }
    }) => ({
        tasksDetailDatas,
        properties_list,
        board_detail,
    })
)
export default class ProjectNameCell extends Component {
    state = {
        isFieldSelectionClick: true,
        isTasksGroupClick: true,
        isExecutorsListClick: true,
        isMilestoneListClick: true,
        isFieldPersonSingle: true,
        isFieldSelectionShow: false,
        isFieldPersonMultipleShow: false,
        isExecutorsListShow: false,//负责人
        isTaskGroupViewShow:false, //任务分组
        isMilestoneCellViewShow:false,//里程碑
        isSingleChoiceViewShow:false,//自定义字段 单选
        isFieldPersonSingleViewShow:false,//自定义  单选成员
        milestoneList: [],
        tasksGroupList: [],
        fieldPersonSignleList: [],
        fieldPersonMultiplelist: [],
    };

    componentDidMount() {
        const {type} = this.props;
        var that = this;
        // if(type == 2) {
        //     setTimeout(function () {
        //         that.getTasksGroupList()

        //     }, 1500);
        // }
    }
   
  

    // 获取里程碑列表
    getTaskMilestoneList = () => {
        const { dispatch, data, boardId, tasksDetailDatas = {} } = this.props;
        let board_id = Taro.getStorageSync("tasks_detail_boardId") || boardId;
        Promise.resolve(
            dispatch({
                type: "tasks/getTaskMilestoneList",
                payload: {
                    board_id: tasksDetailDatas.board_id,
                },
            })
        ).then((res) => {
            if (isApiResponseOk(res)) {
                if (res.data && res.data.length > 0) {
                    this.setState({
                        milestoneList: res.data,
                        milestoneId: data.id,
                        isMilestoneCellViewShow:true
                    })
                }  else {
                    Taro.showToast({
                        title: '暂无里程碑可选',
                        icon: 'none',
                        duration: 2000
                        })
                }
            }
        });
    }
    /**
     * 前往选择执行人
     * @param {*} value 
     * @returns 
     */
     getExecutorsList = () => {
        const { dispatch } = this.props;
        let board_id = Taro.getStorageSync("tasks_detail_boardId");
        Promise.resolve(
            dispatch({
                type: "tasks/getTaskExecutorsList",
                payload: {
                    board_id: board_id,
                },
            })
        ).then((res) => {
            if (isApiResponseOk(res)) {
                // Taro.navigateTo({
                //     url: `../../pages/executorsList/index?contentId=${contentId}&executors=${JSON.stringify(
                //         data
                //     )}`,
                // });
                this.setState({
                    isExecutorsListShow: true
                })
            } else {
                Taro.showToast({
                    title: '无执行人可选',
                    icon: 'none',
                    duration: 2000
                })
            }
        });
     }
    gotoChangeChoiceInfoPage = (value) => {
        const { type, items, field_value, field_item_id, item_id, field_set, } = value;
        const { dispatch, tasksDetailDatas = {}, data, cardId, editAuth } = this.props;
        const { list_id, org_id, fields } = tasksDetailDatas;

        const {
            isFieldSelectionClick,
            isTasksGroupClick,
            isExecutorsListClick,
            isMilestoneListClick,
            isFieldPersonSingle,
            tasksGroupList
        } = this.state;

        let board_id = Taro.getStorageSync("tasks_detail_boardId");
        let contentId = Taro.getStorageSync("tasks_detail_contentId");

        if (!editAuth) {
            Taro.showToast({
                title: '您没有该项目的编辑权限',
                icon: 'none',
                duration: 2000
            })
            return;
        }

        if (type === "2") {
            //任务分组
            if (isTasksGroupClick) {
                this.setState({
                    isTasksGroupClick: false,
                });
                if(tasksGroupList && tasksGroupList.length > 0) {
                    this.setState({
                        isTaskGroupViewShow:true
                    })
                } else {
                    Taro.showToast({
                        title: '暂无分组可选',
                        icon: 'none',
                        duration: 2000
                    })
                }
                const that = this;
                setTimeout(function () {
                    that.setState({
                        isTasksGroupClick: true,
                    });
                }, 1500);
            }
        } else if (type === "3") {
            //执行人
            if (isExecutorsListClick) {
                this.setState({
                    isExecutorsListClick: false,
                });
                this.getExecutorsList()
                const that = this;
                setTimeout(function () {
                    that.setState({
                        isExecutorsListClick: true,
                    });
                }, 1500);
            }
        } else if (type === "4") {
            //里程碑
            if (isMilestoneListClick) {
                this.setState({
                    isMilestoneListClick: false,
                });
                this.getTaskMilestoneList()
                const that = this;
                setTimeout(function () {
                    that.setState({
                        isMilestoneListClick: true,
                    });
                }, 1500);
            }
        } else if (type === "5") {
            //字段
            if (isFieldSelectionClick) {
                this.setState({
                    isFieldSelectionClick: false,
                });
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
                            // Taro.navigateTo({
                            //     url: `../../pages/fieldSelection/index?items=${items}&fields=${JSON.stringify(
                            //         fields
                            //     )}&card_id=${cardId}`,
                            // });
                            // this.setState({
                            //     isFieldSelectionShow: true
                            // })
                        } else {
                            Taro.showToast({
                                title: '没有字段可选',
                                icon: 'none',
                                duration: 2000
                            })
                        }
                    }
                });

                const that = this;
                setTimeout(function () {
                    that.setState({
                        isFieldSelectionClick: true,
                    });
                }, 1500);
            }
        } else if (type === "6") {
            //单选
            // Taro.navigateTo({
            // url: `../../pages/singleChoice/index?items=${JSON.stringify(
            // items
            // )}&field_value=${field_value}&field_item_id=${field_item_id}`,
            // });
            this.setState({
                isSingleChoiceViewShow:true
            })
        } else if (type === "8") {
            //日期
            // Taro.navigateTo({
            // url: `../../pages/dateField/index?field_value=${field_value}&item_id=${item_id}`,
            // });
            console.log(field_value);
        } else if (type === "9") {
            //数字

            // Taro.navigateTo({
            // url: `../../pages/textField/index?field_value=${field_value}&item_id=${item_id}&type=${"number"}`,
            // });
        } else if (type === "10") {
            //文本
            // Taro.navigateTo({
            // url: `../../pages/textField/index?field_value=${field_value}&item_id=${item_id}&type=${"text"}`,
            // });
        } else if (type === "12") {
            //多选，单人/多人

            const { member_selected_type, member_selected_range, date_field_code } = field_set

            /***
             * member_selected_range 1=项目人员, 2=组织人员
             * member_selected_type 1=单选, 2=多选 
             */

            if (member_selected_type === '1' || member_selected_type === 1) {  //单人
                if (isFieldPersonSingle) {
                    if (member_selected_range === '2' || member_selected_range === 2) { //项目内成员
                        this.setState({
                            isFieldPersonSingle: false,
                        });
                        Promise.resolve(
                            dispatch({
                                type: 'board/getBoardDetail',
                                payload: {
                                    id: board_id,
                                }
                            })
                        ).then((res) => {
                            if (isApiResponseOk(res)) {
                                this.setState({
                                    fieldPersonSignleList: res.data.data ? res.data.data : res.data,
                                    isFieldPersonSingleViewShow:true
                                })
                            }
                        });

                        const that = this;
                        setTimeout(function () {
                            that.setState({
                                isFieldPersonSingle: true,
                            });
                        }, 1500);
                    } else if (member_selected_range === '1' || member_selected_range === 1) { //组织内成员

                        this.setState({
                            isFieldPersonSingle: false,
                        });
                        Promise.resolve(
                            dispatch({
                                type: "my/getMemberAllList",
                                payload: {
                                    _organization_id: getOrgIdByBoardId(board_id),
                                },
                            })
                        ).then((res) => {
                            if (isApiResponseOk(res)) {

                                this.setState({
                                    fieldPersonSignleList: res.data.data ? res.data.data : res.data,
                                    isFieldPersonSingleViewShow:true
                                })
                            }
                        });

                        const that = this;
                        setTimeout(function () {
                            that.setState({
                                isFieldPersonSingle: true,
                            });
                        }, 1500);
                    }
                }
            }
            else if (member_selected_type === '2' || member_selected_type === 2) { //多人

                if (member_selected_range === '2' || member_selected_range === 2) {  //项目内成员

                    if (isFieldPersonSingle) {
                        this.setState({
                            isFieldPersonSingle: false,
                        });
                        Promise.resolve(
                            dispatch({
                                type: 'board/getBoardDetail',
                                payload: {
                                    id: board_id,
                                },
                            })
                        ).then((res) => {
                            if (isApiResponseOk(res)) {
                                this.setState({
                                    fieldPersonMultiplelist: res.data.data ? res.data.data : res.data,
                                    isFieldPersonMultipleShow: true
                                })
                            }
                        });

                        const that = this;
                        setTimeout(function () {
                            that.setState({
                                isFieldPersonSingle: true,
                            });
                        }, 1500);
                    }
                } else if (member_selected_range === '1' || member_selected_range === 1) {  //组织内成员
                    if (isFieldPersonSingle) {
                        this.setState({
                            isFieldPersonSingle: false,
                        });

                        Promise.resolve(
                            dispatch({
                                type: "my/getMemberAllList",
                                payload: {
                                    _organization_id: getOrgIdByBoardId(board_id),
                                },
                            })
                        ).then((res) => {
                            if (isApiResponseOk(res)) {
                                this.setState({
                                    fieldPersonMultiplelist: res.data.data ? res.data.data : res.data,
                                    isFieldPersonMultipleShow: true
                                })
                            }
                        });
                        const that = this;
                        setTimeout(function () {
                            that.setState({
                                isFieldPersonSingle: true,
                            });
                        }, 1500);
                    }
                }

            }
        }
    };

    deleteCardProperty = (type, item_id, propertyId) => {
        const { dispatch, cardId, editAuth } = this.props;
        if (!editAuth) {
            Taro.showToast({
                title: '您没有该项目的编辑权限',
                icon: 'none',
                duration: 2000
            })

            return;
        }
        if (
            type === "6" ||
            type === "8" ||
            type === "9" ||
            type === "10" ||
            type === "12"
        ) {
            dispatch({
                type: "tasks/deleteBoardFieldRelation",
                payload: {
                    id: item_id,
                    callBack: this.deleteBoardFieldRelation(item_id),
                },
            });
        }

        if (type === "3" || type === "4" || type === "2") {
            dispatch({
                type: "tasks/deleteCardProperty",
                payload: {
                    property_id: propertyId,
                    card_id: cardId,
                    callBack: this.deleteTasksFieldRelation(propertyId),
                },
            });
        }
    };

    deleteTasksFieldRelation = (propertyId) => {
        const { dispatch, tasksDetailDatas = {} } = this.props;
        const { properties = [] } = tasksDetailDatas;

        let new_array = [];
        properties.forEach((element) => {
            if (element.id !== propertyId) {
                new_array.push(element);
            }
        });

        dispatch({
            type: "tasks/updateDatas",
            payload: {
                tasksDetailDatas: {
                    ...tasksDetailDatas,
                    ...{ properties: new_array },
                },
            },
        });

    };
    onClickFieldSelection() {
        this.setState({
            isFieldSelectionShow: false
        })
        typeof this.props.onClickAction == "function" &&
            this.props.onClickAction();
    }
    /**
     * 自定义字段多选成员
     */
    onClickFieldPersonMultiple() {
        this.setState({
            isFieldPersonMultipleShow: false
        })
        typeof this.props.onClickAction == "function" &&
            this.props.onClickAction();
    }
    /**
     * 负责人
     */
    onClickExecutorsList() {
        this.setState({
            isExecutorsListShow: false
        })
        typeof this.props.onClickAction == "function" &&
            this.props.onClickAction();
    }
    /**
     * 任务分组
     */
    onClickTaskGroup = currentTaskGroup => {
        const {tasksGroupList} = this.state;
        
        const { dispatch, data,tasksDetailDatas = {} } = this.props;
        const {list_ids = []} = tasksDetailDatas;
     
        this.setState({
            isTaskGroupViewShow: false,
            currentTaskGroup:currentTaskGroup
        })
        typeof this.props.onClickAction == "function" &&
            this.props.onClickAction();
    }
    /**
     * 里程碑
     */
    onClickMilestone() {
        this.setState({
            isMilestoneCellViewShow: false
        })
        typeof this.props.onClickAction == "function" &&
            this.props.onClickAction();
    }
    /**
     * 时间
     */
    onDateClickAction() {
        typeof this.props.onClickAction == "function" &&
        this.props.onClickAction();
    }
    /**
     * 自定义字段 单选
     * @param {*} item_id 
     */
     onClickSingleChoice() {
        this.setState({
            isSingleChoiceViewShow: false
        })
        typeof this.props.onClickAction == "function" &&
            this.props.onClickAction();
     }
     /**
      * 自定义字段 单选成员
      * @param {*} item_id 
      */
      onClickPersonSingle () {
        this.setState({
            isFieldPersonSingleViewShow: false
        })
        typeof this.props.onClickAction == "function" &&
        this.props.onClickAction();
      }

    deleteBoardFieldRelation = (item_id) => {
        const { dispatch, tasksDetailDatas } = this.props;
        const { fields = [] } = tasksDetailDatas;

        let new_array = [];
        fields.forEach((element) => {
            if (element.id !== item_id) {
                new_array.push(element);
            }
        });

        dispatch({
            type: "tasks/updateDatas",
            payload: {
                tasksDetailDatas: {
                    ...tasksDetailDatas,
                    ...{ fields: new_array },
                },
            },
        });
    };

    render() {
        let contentId = Taro.getStorageSync("tasks_detail_contentId");
        const { tasksDetailDatas = {}, boardId, editAuth } = this.props;
        const { list_ids=[] } = tasksDetailDatas;
        const list_id = list_ids[0] || ''
        const title = this.props.title || "";
        const data = this.props.data || "";
        const type = this.props.type || "";
        const items = this.props.items || [];
        const field_value = this.props.field_value || "";
        const field_item_id = this.props.field_item_id || "";
        const item_id = this.props.item_id || "";
        const propertyId = this.props.propertyId || "";
        const fieldSet = this.props.fieldSet || {};
        const cardId = this.props.cardId || {};
        const { member_selected_type, member_selected_range, date_field_code } = fieldSet;
        const { fields } = tasksDetailDatas;
        const { milestoneList, milestoneId,isSingleChoiceViewShow, currentTaskGroup,tasksGroupList,isTaskGroupViewShow, tasksGroupId, fieldPersonSignleList, isFieldSelectionShow, fieldPersonMultiplelist, isFieldPersonMultipleShow, isExecutorsListShow } = this.state;
        //左边icon
        let icon;
        var placeText= '';
        if (type === "1") {
            icon = <Text className={`${globalStyle.global_iconfont}`} style={{color:'#5FA6FF',fontSize:'24px'}}>&#xe866;</Text>;
        } else if (type === "2") {
            icon = <Text className={`${globalStyle.global_iconfont}`} style={{color:'#5FA6FF',fontSize:'24px'}}>&#xe8b3;</Text>;
            placeText = "选择分组";
        } else if (type === "3") {
            placeText = "指派负责人";
            icon = <Text className={`${globalStyle.global_iconfont}`} style={{color:'#5FA6FF',fontSize:'24px'}}>&#xe877;</Text>;
        } else if (type === "4") {
            icon = <Text className={`${globalStyle.global_iconfont}`} style={{color:'#5FA6FF',fontSize:'24px'}} >&#xe850;</Text>;
            placeText = "选择里程碑";
        } else if (type === "5") {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe7be;</Text>;
        } else if (type === "6") {
            placeText = '选择' + title;
            icon = <Text className={`${globalStyle.global_iconfont}`} style={{color:'#5FA6FF',fontSize:'24px'}}>&#xe8b0;</Text>;
        } else if (type === "7") {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe7b8;</Text>;
            placeText = '选择' + title;
        } else if (type === "8") {
            icon = <Text className={`${globalStyle.global_iconfont}`} style={{color:'#5FA6FF',fontSize:'24px'}}>&#xe868;</Text>;
        } else if (type === "9") {
            icon = <Text className={`${globalStyle.global_iconfont}`} style={{color:'#5FA6FF',fontSize:'24px'}}>&#xe86a;</Text>;
        } else if (type === "10") {
            icon = <Text className={`${globalStyle.global_iconfont}`} style={{color:'#5FA6FF',fontSize:'24px'}}>&#xe869;</Text>;
        } else if (type === "12") {
            placeText = '选择' + title;
            icon = <Text className={`${globalStyle.global_iconfont}`} style={{color:'#5FA6FF',fontSize:'24px'}}>&#xe878;</Text>;
        }

        //右边icon
        let rightIcon;
        if (type != 1 && type != 2) {
        //     //向右箭头
        //     rightIcon = (
        //         <Text className={`${globalStyle.global_iconfont}`}>&#xe654;</Text>
        //     );
        // } 
        // else if (
        //     type === "3" ||
        //     type === "4" ||
        //     type === "6" ||
        //     type === "7" ||
        //     type === "8" ||
        //     type === "9" ||
        //     type === "10" ||
        //     type === "12"
        // ) {
        //     // 叉×
        rightIcon = (
            <Text className={`${globalStyle.global_iconfont}`}>&#xe8b2;</Text>
        );
        }
        return (
            <View className={indexStyles.index}>
              <View className={indexStyles.list_item}>
                <View
                    className={indexStyles.list_left}
                    onClick={this.gotoChangeChoiceInfoPage.bind(this, {
                        data: data,
                        type: type,
                        items: items,
                        field_value: field_value,
                        field_item_id: field_item_id,
                        item_id: item_id,
                        field_set: fieldSet,
                    })}
                >

                    <View className={`${indexStyles.list_item_left_iconnext}`}>
                        {icon}
                    </View>
                    {
                        type != 1 && type != 2 && type != 3 && type != 4 && <View className={indexStyles.list_item_name}>{title}</View>
                    }
                    <View className={indexStyles.right_style}>
                        <View className={indexStyles.right_centre_style}>
                            <View>
                                {(type === "3" || type === "12") && data && data.length > 0 ? (
                                    <View className={indexStyles.executors_list_item_detail}>
                                        <View className={`${indexStyles.avata_area}`}>
                                            <Avatar avartarTotal={"multiple"} userList={data} listMore={20} />
                                        </View>
                                    </View>
                                ) : (
                                    <View className={indexStyles.list_item_detail} v-if>
                                        {/* {
                                            type == 4 ? (
                                                milestoneList.length ? (<MilestoneCellPicer tag={type} title={data.name} dataArray={milestoneList} contentId={contentId} clickHandle={this.
                                                    clickSelectPicker} milestoneId={milestoneId} tasksDetailDatas={tasksDetailDatas} editAuth={editAuth}></ MilestoneCellPicer>) : (<View>暂无里程碑可选</View>)

                                            ) : (null)
                                        } */}
                                        {/* {
                                            type == 2 ? (
                                                tasksGroupList.length ? (<TaskGroupPicker contentId={contentId} tag={type} title={data.name} tasksGroupList={tasksGroupList}> editAuth={editAuth} listId={list_id} tasksDetailDatas={tasksDetailDatas}</TaskGroupPicker>) : (<View>暂无分组可选</View>)

                                            ) : (null)
                                        } */}
                                        {
                                            type == 9 || type == 10 ? (<textField item_id={item_id} field_value={data.name} editAuth={editAuth} type={type}></textField>) : (null)
                                        }

                                        {
                                            // field_value=${field_value}&item_id=${item_id}`,
                                            type == 8 ? (<DateField field_value={field_value} title={title} onClickAction={this.onDateClickAction} item_id={item_id} editAuth={editAuth} dateFieldCode={date_field_code}></DateField>) : (null)
                                        }
                                        {/* {
                                            type == 6 ? (
                                                items.length ? (<SingleChoicePicker items={items} field_value={field_value} editAuth={editAuth} field_item_id={field_item_id}></SingleChoicePicker>) : (<View>暂无选项可选</View>)
                                            ) : (null)
                                        } */}
                                        {/* {
                                            type == '12' && member_selected_type == 1 ? (
                                                fieldPersonSignleList.length ? (<FieldPersonSinglePicker contentId={contentId} editAuth={editAuth} executors={data} item_id={item_id} executorsList={fieldPersonSignleList} title={data.name}></FieldPersonSinglePicker>) : (<View>暂无选项可选</View>)
                                            ) : (null)
                                        } */}

                                        {type != 9 && type != 10 && type != 8 && (type != 12 && member_selected_type != 1)  ? (<View className={`${indexStyles.contentdata_style} ${type == 1 ? indexStyles.contentdata_project_name_style:''}`}>{type == '2' ? currentTaskGroup : data.name}</View>):('')}
                                        {
                                            (type != 2 && placeText && !data.name)  || (type == 2 && !currentTaskGroup) ?(<View className={`${indexStyles.contentdata_style} ${indexStyles.place_style}`}>{placeText}</View>):('')
                                        }
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                </View>

                <View
                    className={`${indexStyles.list_item_iconnext}`}
                    onClick={() => this.deleteCardProperty(type, item_id, propertyId)}
                >
                    {rightIcon}
                </View>
                {
                    isFieldSelectionShow ? (<FieldSelection items={items} fields={fields} card_id={cardId} onClickAction={this.onClickFieldSelection} ></FieldSelection>) : (null)
                }
                {
                    isFieldPersonMultipleShow ? (<FieldPersonMultiple contentId={contentId} executors={data} title={title} item_id={item_id} executorsList={fieldPersonMultiplelist} onClickAction={this.onClickFieldPersonMultiple}></FieldPersonMultiple>) : (null)
                }
                {
                    isExecutorsListShow ? (<ExecutorsList title='指派负责人' contentId={contentId} onClickAction={this.onClickExecutorsList} executors={data}></ExecutorsList>) : (null)
                }
                {/* {
                    isTaskGroupViewShow ? (<TaskGroupView contentId={contentId} onClickAction={(groupName)=>this.onClickTaskGroup(groupName)} tag={type} title={title} listId={list_id} currentName={data.name} tasksGroupList={tasksGroupList}></TaskGroupView>):('')
                }  */}
                {
                    isMilestoneCellViewShow ? (<MilestoneCellView onClickAction={this.onClickMilestone} tag={type}  title={title} currentName={data.name} dataArray={milestoneList} contentId={contentId} milestoneId={milestoneId} tasksDetailDatas={tasksDetailDatas} editAuth={editAuth}></MilestoneCellView>):('')
                }
                {
                    isSingleChoiceViewShow ? (<SingleChoiceView onClickAction={this.onClickSingleChoice} title={title} currentName={data.name} items={items} field_value={field_value} editAuth={editAuth} field_item_id={field_item_id}></SingleChoiceView>):('')
                } 
                {
                    isFieldPersonSingleViewShow ? (<FieldPersonSingleView onClickAction={this.onClickPersonSingle} contentId={contentId} editAuth={editAuth} executors={data} item_id={item_id} executorsList={fieldPersonSignleList} title={title}></FieldPersonSingleView>):('')
                }
              </View >
              <View className={indexStyles.line_View}></View>
            </View>
        );
    }
}