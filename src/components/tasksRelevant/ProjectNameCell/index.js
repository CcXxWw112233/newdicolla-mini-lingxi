import Taro, { Component } from "@tarojs/taro";
import { View, Text, RichText, Picker } from "@tarojs/components";
import indexStyles from "./index.scss";
import globalStyle from "../../../gloalSet/styles/globalStyles.scss";
import Avatar from "../../avatar";
import { connect } from "@tarojs/redux";
import { isApiResponseOk, } from "../../../utils/request";
import { getOrgIdByBoardId, } from '../../../utils/basicFunction'
import { MilestoneCellPicer } from "../milestoneCellPicker";
import { TaskGroupPicker } from "../taskGroupPicker";
import { textField } from '../../../pages/textField'
import { DateField } from '../../../pages/dateField'
import { FieldSelection } from '../../../pages/fieldSelection'
import { FieldPersonMultiple } from '../../../pages/fieldPersonMultiple'
import { SingleChoicePicker } from '../SingleChoicePicker'
import { FieldPersonSinglePicker } from '../FieldPersonSinglePicker'
import { ExecutorsList } from '../../../pages/executorsList'

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
        isExecutorsListShow: false,
        milestoneList: [],
        tasksGroupList: [],
        fieldPersonSignleList: [],
        fieldPersonMultiplelist: [],
    };

    componentDidMount() {
        const { type, data, tasksDetailDatas } = this.props;
        const fieldSet = this.props.fieldSet || {};
        const { member_selected_type, member_selected_range, } = fieldSet;

        if (type == 2) {
            this.getTasksGroupList()
        }
        // if (member_selected_type === '1' || member_selected_type === 1) {  //单人
        // if (isFieldPersonSingle) {
        // if (member_selected_range === '2' || member_selected_range === 2) { //项目内成员
        if (type == '12') {
            if (member_selected_type === '1' || member_selected_type === 1) {
                if (member_selected_range === '2' || member_selected_range === 2) {
                    this.fieldPersonSingle();
                } else if (member_selected_range === '1' || member_selected_range === 1) {
                    this.getMemberAllList();
                }
            }
        }
        if (type == 4) {
            this.getTaskMilestoneList()
        }
    }
    //单选项目内成员列表
    fieldPersonSingle() {
        let board_id = Taro.getStorageSync("tasks_detail_boardId");
        const { dispatch, data } = this.props;
        const item_id = this.props.item_id || "";

        Promise.resolve(
            dispatch({
                type: 'board/getBoardDetail',
                payload: {
                    id: board_id,
                }
            })
        ).then((res) => {
            if (isApiResponseOk(res)) {
                // Taro.navigateTo({
                // url: `../../pages/fieldPersonSingle/index?contentId=${contentId}&executors=${JSON.stringify(
                // data
                // )}&item_id=${item_id}&executorsList=${JSON.stringify(res.data.data)}`,
                // });
                this.setState({
                    fieldPersonSignleList: res.data.data
                })
            }
        });
    }

    // 单选组织内成员
    getMemberAllList() {
        let board_id = Taro.getStorageSync("tasks_detail_boardId");
        const { dispatch, data } = this.props;
        const item_id = this.props.item_id || "";

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
                    fieldPersonSignleList: res.data.data
                })
                // Taro.navigateTo({
                // url: `../../pages/fieldPersonSingle/index?contentId=${contentId}&executors=${JSON.stringify(
                // data
                // )}&item_id=${item_id}&executorsList=${JSON.stringify(res.data)}`,
                // });
            }
        });

    }

    //获取任务分组列表
    getTasksGroupList = () => {
        let board_id = Taro.getStorageSync("tasks_detail_boardId");
        const { dispatch, data } = this.props;
        Promise.resolve(
            dispatch({
                type: "tasks/getCardList",
                payload: {
                    board_id: board_id,
                },
            })
        ).then((res) => {
            if (isApiResponseOk(res)) {
                if (res.data && res.data.length > 0) {
                    // Taro.navigateTo({
                    // url: `../../pages/tasksGroup/index?contentId=${contentId}&listId=${list_id}`,
                    // });

                    this.setState({
                        tasksGroupList: res.data,
                    })
                } else {
                    // Taro.showToast({
                    // title: '无分组',
                    // icon: 'none',
                    // duration: 2000
                    // })
                }
            }
        });
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
                    Taro.navigateTo({
                        // url: `../../pages/milestoneList/index?contentId=${contentId}&milestoneId=${data.id}`,
                    });
                    this.setState({
                        milestoneList: res.data,
                        milestoneId: data.id
                    })
                } else {
                    // Taro.showToast({
                    // title: '没有里程碑可设置',
                    // icon: 'none',
                    // duration: 2000
                    // })
                }
            }
        });
    }

    gotoChangeChoiceInfoPage = (value) => {
        const { type, items, field_value, field_item_id, item_id, field_set, } = value;
        const { dispatch, tasksDetailDatas = {}, data, cardId, } = this.props;
        const { list_id, org_id, fields } = tasksDetailDatas;

        console.log(value);
        const {
            isFieldSelectionClick,
            isTasksGroupClick,
            isExecutorsListClick,
            isMilestoneListClick,
            isFieldPersonSingle,
        } = this.state;

        let board_id = Taro.getStorageSync("tasks_detail_boardId");
        let contentId = Taro.getStorageSync("tasks_detail_contentId");

        if (type === "2") {
            //任务分组
            if (isTasksGroupClick) {
                this.setState({
                    isTasksGroupClick: false,
                });


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
                        // this.setState({
                        //     dataArray: res.data,
                        // })
                        // console.log(this.state.dataArray);

                    } else {
                        Taro.showToast({
                            title: '无执行人可选',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                });

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
                console.log(data.id);

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
                            this.setState({
                                isFieldSelectionShow: true
                            })
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
                        // Promise.resolve(
                        //     dispatch({
                        //         type: 'board/getBoardDetail',
                        //         payload: {
                        //             id: board_id,
                        //         }
                        //     })
                        // ).then((res) => {
                        //     if (isApiResponseOk(res)) {
                        //         Taro.navigateTo({
                        //             url: `../../pages/fieldPersonSingle/index?contentId=${contentId}&executors=${JSON.stringify(
                        //                 data
                        //             )}&item_id=${item_id}&executorsList=${JSON.stringify(res.data.data)}`,
                        //         });
                        //     }
                        // });

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
                        // Promise.resolve(
                        //     dispatch({
                        //         type: "my/getMemberAllList",
                        //         payload: {
                        //             _organization_id: getOrgIdByBoardId(board_id),
                        //         },
                        //     })
                        // ).then((res) => {
                        //     if (isApiResponseOk(res)) {
                        //         Taro.navigateTo({
                        //             url: `../../pages/fieldPersonSingle/index?contentId=${contentId}&executors=${JSON.stringify(
                        //                 data
                        //             )}&item_id=${item_id}&executorsList=${JSON.stringify(res.data)}`,
                        //         });
                        //     }
                        // });

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
                                // Taro.navigateTo({
                                //     url: `../../pages/fieldPersonMultiple/index?contentId=${contentId}&executors=${JSON.stringify(
                                //         data
                                //     )}&item_id=${item_id}&executorsList=${JSON.stringify(res.data.data)}`,
                                // });
                                this.setState({
                                    fieldPersonMultiplelist: res.data.data,
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
                                // Taro.navigateTo({
                                //     url: `../../pages/fieldPersonMultiple/index?contentId=${contentId}&executors=${JSON.stringify(
                                //         data
                                //     )}&item_id=${item_id}&executorsList=${JSON.stringify(res.data)}`,
                                // });
                                this.setState({
                                    fieldPersonMultiplelist: res.data,
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
        const { dispatch, cardId } = this.props;

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

        if (type === "3" || type === "4") {
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
    onClickFieldPersonMultiple() {
        this.setState({
            isFieldPersonMultipleShow: false
        })
        typeof this.props.onClickAction == "function" &&
            this.props.onClickAction();
    }
    onClickExecutorsList() {
        this.setState({
            isExecutorsListShow: false
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
    clickSelectPicker() {

    };
    render() {
        let contentId = Taro.getStorageSync("tasks_detail_contentId");
        const { tasksDetailDatas = {}, boardId } = this.props;
        const { list_id } = tasksDetailDatas;
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
        const { milestoneList, milestoneId, tasksGroupList, tasksGroupId, fieldPersonSignleList, isFieldSelectionShow, fieldPersonMultiplelist, isFieldPersonMultipleShow, isExecutorsListShow } = this.state;
        //左边icon
        let icon;
        if (type === "1") {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe6a8;</Text>;
        } else if (type === "2") {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe6a7;</Text>;
        } else if (type === "3") {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe7ae;</Text>;
        } else if (type === "4") {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe6a9;</Text>;
        } else if (type === "5") {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe7be;</Text>;
        } else if (type === "6") {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe7ba;</Text>;
        } else if (type === "7") {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe7b8;</Text>;
        } else if (type === "8") {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe63e;</Text>;
        } else if (type === "9") {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe7c0;</Text>;
        } else if (type === "10") {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe7c1;</Text>;
        } else if (type === "12") {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe7bf;</Text>;
        }

        //右边icon
        let rightIcon;
        if (type === "2" || type === "5") {
            //向右箭头
            rightIcon = (
                <Text className={`${globalStyle.global_iconfont}`}>&#xe654;</Text>
            );
        } else if (
            type === "3" ||
            type === "4" ||
            type === "6" ||
            type === "7" ||
            type === "8" ||
            type === "9" ||
            type === "10" ||
            type === "12"
        ) {
            // 叉×
            rightIcon = (
                <Text className={`${globalStyle.global_iconfont}`}>&#xe7fc;</Text>
            );
        }

        return (
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

                    <View className={indexStyles.list_item_name}>{title}</View>

                    <View className={indexStyles.right_style}>
                        <View className={indexStyles.right_centre_style}>
                            <View>
                                {(type === "3" || type === "12" && member_selected_type != 1) && data && data.length > 0 ? (
                                    <View className={indexStyles.executors_list_item_detail}>
                                        <View className={`${indexStyles.avata_area}`}>
                                            <Avatar avartarTotal={"multiple"} userList={data} />
                                        </View>
                                    </View>
                                ) : (
                                    <View className={indexStyles.list_item_detail} v-if>
                                        {
                                            type == 4 ? (
                                                milestoneList.length ? (<MilestoneCellPicer tag={type} title={data.name} dataArray={milestoneList} contentId={contentId} clickHandle={this.
                                                    clickSelectPicker} milestoneId={milestoneId} tasksDetailDatas={tasksDetailDatas}></ MilestoneCellPicer>) : (<View>暂无里程碑可选</View>)

                                            ) : (null)
                                        }
                                        {
                                            type == 2 ? (
                                                tasksGroupList.length ? (<TaskGroupPicker contentId={contentId} tag={type} title={data.name} tasksGroupList={tasksGroupList}> listId={list_id} tasksDetailDatas={tasksDetailDatas}</TaskGroupPicker>) : (<View>暂无分组可选</View>)

                                            ) : (null)
                                        }
                                        {
                                            type == 9 || type == 10 ? (<textField item_id={item_id} field_value={data.name} type={type}></textField>) : (null)
                                        }

                                        {
                                            // field_value=${field_value}&item_id=${item_id}`,
                                            type == 8 ? (<DateField field_value={field_value} item_id={item_id} dateFieldCode={date_field_code}></DateField>) : (null)
                                        }
                                        {
                                            type == 6 ? (
                                                items.length ? (<SingleChoicePicker items={items} field_value={field_value} field_item_id={field_item_id}></SingleChoicePicker>) : (<View>暂无选项可选</View>)
                                            ) : (null)
                                        }
                                        {
                                            type == '12' && member_selected_type == 1 ? (
                                                fieldPersonSignleList.length ? (<FieldPersonSinglePicker contentId={contentId} executors={data} item_id={item_id} executorsList={fieldPersonSignleList} title={data.name}></FieldPersonSinglePicker>) : (<View>暂无选项可选</View>)
                                            ) : (null)
                                        }

                                        { type != 2 && type != 4 && type != 9 && type != 10 && type != 8 && type != 6 && (type != 12 && member_selected_type != 1) ? (<View>{data.name}</View>) : (null)}
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
                    isFieldPersonMultipleShow ? (<FieldPersonMultiple contentId={contentId} executors={data} item_id={item_id} executorsList={fieldPersonMultiplelist} onClickAction={this.onClickFieldPersonMultiple}></FieldPersonMultiple>) : (null)
                }
                {
                    isExecutorsListShow ? (<ExecutorsList contentId={contentId} onClickAction={this.onClickExecutorsList} executors={data}></ExecutorsList>) : (null)
                }
            </View >
        );
    }
}