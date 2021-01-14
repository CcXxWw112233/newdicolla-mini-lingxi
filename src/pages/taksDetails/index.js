import Taro, { Component } from "@tarojs/taro";
import { View, Picker } from "@tarojs/components";
import indexStyles from "./index.scss";
import globalStyle from "../../gloalSet/styles/globalStyles.scss";
import TasksTime from "../../components/tasksRelevant/TasksTime/index";
import ProjectNameCell from "../../components/tasksRelevant/ProjectNameCell/index";
import RelationContentCell from "./components/RelationContentCell/index";
import TagCell from "./components/TagCell/index";
import AddFunctionCell from "../../components/tasksRelevant/AddFunctionCell/index";
import NewBuilders from "./components/NewBuilders/index";
import CommentCell from "./components/CommentCell/index";
import CommentBox from "./components/CommentBox/index";
import CustomNavigation from "../acceptInvitation/components/CustomNavigation.js";
import { connect } from "@tarojs/redux";
import SonTasks from "./components/SonTasks/index";
import DescribeTasks from "./components/DescribeTasks/index";
import TaksChoiceFolder from "./components/TaksChoiceFolder/index";
import MultipleSelectionField from "./components/MultipleSelectionField/index";
import FileFields from "./components/FileFields/index";
import { timestampToDateTime, } from "../../utils/basicFunction";

@connect(
    ({
        tasks: { tasksDetailDatas = {}, properties_list = [] },
        calendar: { isOtherPageBack = {} },
        file: { folder_tree, isShowChoiceFolder },
    }) => ({
        tasksDetailDatas,
        isOtherPageBack,
        properties_list,
        folder_tree,
        isShowChoiceFolder,
    })
)
export default class taksDetails extends Component {
    config = {
        navigationStyle: "custom",
        navigationBarTitleText: "任务详情",
    };
    state = {
        content_Id: "",
        backIcon: "",
        type_flag: "",
        board_id: "",
        milestone_show: false,
    };

    onShareAppMessage() {
        return {
            title: "任务详情",
            path: `/pages/taksDetails/index`,
        };
    }

    componentDidMount() {
        const { flag, boardId, contentId, back_icon } = this.$router.params;

        if (boardId || contentId) {
            Taro.setStorageSync("tasks_detail_boardId", boardId);
            Taro.setStorageSync("tasks_detail_contentId", contentId);
        }

        this.setState({
            content_Id: contentId,
            backIcon: back_icon,
            type_flag: flag,
            board_id: boardId,
        });
        this.loadTasksDetail(contentId, boardId);
        this.getBoardFileList(boardId);
    }

    loadTasksDetail = (content_id, board_id) => {
        let contentId;
        let boardId;
        if (content_id || board_id) {
            contentId = content_id;
            boardId = board_id;
        } else {
            contentId = Taro.getStorageSync("tasks_detail_contentId");
            boardId = Taro.getStorageSync("tasks_detail_boardId");
        }

        const { dispatch } = this.props;
        const that = this;
        Promise.resolve(
            dispatch({
                type: "tasks/getTasksDetail",
                payload: {
                    id: contentId,
                    boardId: boardId,
                },
            })
        ).then((res) => {
            that.getCardProperties();
        });
    };

    getCardProperties = () => {
        const { dispatch } = this.props;
        dispatch({
            type: "tasks/getCardProperties",
            payload: {},
        });
    };

    getBoardFileList = (boardId) => {
        const { dispatch } = this.props;
        dispatch({
            type: "file/getFolder",
            payload: {
                board_id: boardId,
            },
        });
    };

    componentDidShow() {
        const { dispatch } = this.props;
        dispatch({
            type: "calendar/updateDatas",
            payload: {
                isOtherPageBack: true,
            },
        });
        console.log("刷新界面")
        const { content_Id, board_id } = this.state;

        if (content_Id != "" && content_Id != "") {
            this.loadTasksDetail(content_Id, board_id);
        }
    }
    onClickAction() {

        const { dispatch } = this.props;
        dispatch({
            type: "calendar/updateDatas",
            payload: {
                isOtherPageBack: true,
            },
        });

        const { content_Id, board_id } = this.state;

        if (content_Id != "" && content_Id != "") {
            this.loadTasksDetail(content_Id, board_id);
        }
    }
    componentWillUnmount() {
        const { sourcePage } = this.state;
        if (sourcePage === "auccessJoin" || sourcePage === "sceneEntrance") {
            const switchTabCurrentPage = "currentPage_BoardDetail_or_Login";
            Taro.setStorageSync("switchTabCurrentPage", switchTabCurrentPage);
            Taro.switchTab({
                url: `../../pages/calendar/index`,
            });
        }
    }

    tasksDetailsRealizeStatus = (timeInfo, type) => {
        const { dispatch } = this.props;

        let isRealize;
        if (timeInfo.isRealize === "1") {
            this.modifyRealize({ is_realize: "0" }, type, timeInfo.cardId);
            isRealize = 0;
        } else if (timeInfo.isRealize === "0") {
            this.modifyRealize({ is_realize: "1" }, type, timeInfo.cardId);
            isRealize = 1;
        }

        Promise.resolve(
            dispatch({
                type: "tasks/setTasksRealize",
                payload: {
                    card_id: timeInfo.cardId,
                    is_realize: isRealize,
                },
            })
        ).then((res) => {
            if (type === "SonTasks") {
                let contentId = Taro.getStorageSync("tasks_detail_contentId");
                let boardId = Taro.getStorageSync("tasks_detail_boardId");
                this.loadTasksDetail(contentId, boardId);
            }
        });
    };

    modifyRealize = (new_data = {}, type, card_id) => {
        const { tasksDetailDatas = {}, dispatch } = this.props;

        if (type === "TasksTime") {
            dispatch({
                type: "tasks/updateDatas",
                payload: {
                    tasksDetailDatas: {
                        ...tasksDetailDatas,
                        ...new_data,
                    },
                },
            });
        } else if (type === "SonTasks") {
            return;

            // const { properties = [] } = tasksDetailDatas

            // properties.forEach(item => {

            //     if (item['code'] === 'SUBTASK') {

            //         item['data'] && item['data'].forEach(obj => {

            //             if (obj.card_id === card_id) {

            //                 obj.is_realize = new_data.is_realize
            //             }
            //         })
            //     }
            // })

            // dispatch({
            //     type: 'tasks/updateDatas',
            //     payload: {
            //         tasksDetailDatas: {
            //             ...tasksDetailDatas,
            //             ...properties,
            //         }
            //     }
            // })
        }
    };

    getCustomFieldSingleChoiceValue = (field_value, items = []) => {
        if (!field_value) return;

        let item_value = "";

        items.forEach((value) => {
            if (value["id"] === field_value) {
                item_value = value["item_value"];
            }
        });

        return { name: item_value };
    };

    render() {
        const {
            tasksDetailDatas = {},
            properties_list = [],
            folder_tree,
            isShowChoiceFolder,
        } = this.props;
        const card_id = tasksDetailDatas["card_id"] || "";
        const card_name = tasksDetailDatas["card_name"] || "";
        const due_time = tasksDetailDatas["due_time"] || "";
        const start_time = tasksDetailDatas["start_time"];
        const is_realize = tasksDetailDatas["is_realize"] || "";

        const timeInfo = {
            eTime: due_time,
            sTime: start_time,
            cardDefinition: card_name,
            isRealize: is_realize,
            cardId: card_id,
        };
        const board_name = tasksDetailDatas["board_name"] || "";
        const list_name = tasksDetailDatas["list_name"] || "未分组";
        const description = tasksDetailDatas["description"] || "";
        const { content_Id, backIcon } = this.state;
        const executors = tasksDetailDatas["executors"] || [];
        const milestone_data = tasksDetailDatas["milestone_data"] || "";
        const label_data = tasksDetailDatas["label_data"];
        const child_data = tasksDetailDatas["child_data"];
        const is_Function = {
            isExecutors: executors,
            isMilestone: milestone_data.name,
            isDescription: description,
        };

        const SystemInfo = Taro.getSystemInfoSync();
        const statusBar_Height = SystemInfo.statusBarHeight;
        const navBar_Height = SystemInfo.platform == "ios" ? 44 : 48;

        const { type_flag } = this.props;

        const { properties = [], fields = [], org_id } = tasksDetailDatas;

        let board_id = Taro.getStorageSync("tasks_detail_boardId");

        return (
            <View>
                <CustomNavigation backIcon={backIcon} />

                <View
                    style={{
                        marginTop: `${statusBar_Height + navBar_Height}` + "px",
                        left: 0,
                    }}
                >
                    <View className={indexStyles.tasks_time_style}>

                        {
                            card_id ? (<TasksTime
                                cellInfo={timeInfo}
                                tasksDetailsRealizeStatus={(timeInfo, type) =>
                                    this.tasksDetailsRealizeStatus(timeInfo, "TasksTime")
                                }
                                flag={type_flag}
                            />) : <View></View>
                        }

                    </View>
                    <ProjectNameCell
                        title="项目"
                        data={{ name: board_name }}
                        boardId={board_id}
                        type="1"
                    />
                    <View className={indexStyles.tasks_name_style}>
                        <ProjectNameCell
                            title="任务分组"
                            data={{ name: list_name }}
                            boardId={board_id}
                            type="2"
                        />
                    </View>
                    <View>
                        {properties &&
                            properties.map((item, key) => {
                                const { code, name, id, data = [] } = item;
                                return (
                                    <View key={key}>
                                        <View>
                                            {code == "EXECUTOR" ? (
                                                <ProjectNameCell
                                                    title={name}
                                                    data={data}
                                                    boardId={board_id}
                                                    propertyId={id}
                                                    cardId={card_id}
                                                    type="3"
                                                    onClickAction={this.onClickAction}

                                                // onLoadTasksDetail={this.loadTasksDetail.bind(board_id, card_id)}
                                                />
                                            ) : (
                                                    ""
                                                )}
                                        </View>
                                        <View>
                                            {code == "MILESTONE" ? (
                                                <ProjectNameCell
                                                    title={name}
                                                    data={data}
                                                    boardId={board_id}
                                                    propertyId={id}
                                                    cardId={card_id}
                                                    type="4"
                                                />
                                            ) : (
                                                    ""
                                                )}
                                        </View>
                                        {code == "SUBTASK" ? (
                                            <SonTasks
                                                child_data={data}
                                                boardId={board_id}
                                                propertyId={id}
                                                cardId={card_id}
                                                onClickAction={this.onClickAction}
                                                onTasksDetailsRealizeStatus={(timeInfo, type) =>
                                                    this.tasksDetailsRealizeStatus(timeInfo, "SonTasks")
                                                }
                                            />
                                        ) : (
                                                ""
                                            )}
                                        {code == "LABEL" ? (
                                            <TagCell
                                                label_data={data}
                                                propertyId={id}
                                                cardId={card_id}
                                            />
                                        ) : (
                                                ""
                                            )}

                                        {code == "REMARK" ? (
                                            <DescribeTasks
                                                name={data}
                                                boardId={board_id}
                                                propertyId={id}
                                                cardId={card_id}
                                            />
                                        ) : (
                                                ""
                                            )}
                                    </View>
                                );
                            })}

                        {/* <RelationContentCell /> */}
                    </View>

                    {properties && properties.length > 0 && properties_list &&
                        properties_list.length > 0 &&
                        properties.length !== properties_list.length ? (
                            <AddFunctionCell properties_list={properties_list} />
                        ) : (
                            <View></View>
                        )}

                    {/* <NewBuilders />
                <CommentCell />
                <CommentBox content={content_Id} /> */}

                    <View className={indexStyles.custom_field_interval}></View>



                    {fields &&
                        fields.map((item, key) => {
                            const {
                                field_content = {},
                                field_value,
                            } = item;
                            const { name, items, field_type, field_set = {}, } = field_content;

                            const { date_field_code, } = field_set

                            // 1 单选字段
                            // 2 多选字段
                            // 3 日期字段
                            // 4 数字字段
                            // 5 文本字段
                            // 6 文件字段
                            // 7 评分字段
                            // 8 成员-单人
                            // 8 成员-多人

                            //field_type 字段类型 1=单选 2=多选 3=日期 4=数字 5=文本 6=文件 7=评价(评分) 8=成员

                            return (
                                <View key={key}>
                                    <View className={indexStyles.custom_field_interval}></View>
                                    {field_type == "1" ? (
                                        <ProjectNameCell
                                            title={name}
                                            data={this.getCustomFieldSingleChoiceValue(
                                                field_value,
                                                items
                                            )}
                                            boardId={board_id}
                                            items={items}
                                            field_value={field_value}
                                            field_item_id={item.id}
                                            // propertyId={id}
                                            // cardId={card_id}
                                            type="6"
                                            item_id={item.id}
                                        />
                                    ) : (
                                            ""
                                        )}
                                    {field_type == "2" ? (
                                        <MultipleSelectionField
                                            title={name}
                                            data={items}
                                            fieldValue={field_value}
                                            type="7"
                                            item_id={item.id}
                                            onClickAction={this.onClickAction}
                                        />
                                    ) : (
                                            ""
                                        )}
                                    {field_type == "3" ? (
                                        <ProjectNameCell
                                            title={name}
                                            data={{ name: timestampToDateTime(field_value, date_field_code,) }}
                                            boardId={board_id}
                                            items={items}
                                            field_value={field_value}
                                            type="8"
                                            item_id={item.id}
                                            fieldSet={field_set}
                                        />
                                    ) : (
                                            ""
                                        )}
                                    {field_type == "4" ? (
                                        <ProjectNameCell
                                            title={name}
                                            data={{ name: field_value }}
                                            boardId={board_id}
                                            items={items}
                                            field_value={field_value}
                                            type="9"
                                            item_id={item.id}
                                        />
                                    ) : (
                                            ""
                                        )}
                                    {field_type == "5" ? (
                                        <ProjectNameCell
                                            title={name}
                                            data={{ name: field_value }}
                                            boardId={board_id}
                                            items={items}
                                            field_value={field_value}
                                            type="10"
                                            item_id={item.id}
                                        />
                                    ) : (
                                            ""
                                        )}
                                    {field_type == "6" && tasksDetailDatas.board_id ? (
                                        <FileFields
                                            title={name}
                                            data={{ name: field_value }}
                                            boardId={tasksDetailDatas.board_id}
                                            items={items}
                                            field_value={field_value}
                                            type="11"
                                            item_id={item.id}
                                            onLoadTasksDetail={this.loadTasksDetail.bind(
                                                board_id,
                                                card_id
                                            )}
                                        />
                                    ) : (
                                            ""
                                        )}

                                    {field_type == "8" ? (
                                        <ProjectNameCell
                                            title={name}
                                            data={field_value}
                                            boardId={board_id}
                                            items={items}
                                            field_value={field_value}
                                            type="12"
                                            item_id={item.id}
                                            fieldSet={field_set}
                                            onClickAction={this.onClickAction}
                                        />
                                    ) : (
                                            ""
                                        )}
                                </View>
                            );
                        })}
                    <ProjectNameCell
                        title="字段"
                        data={{ name: "更多" }}
                        boardId={board_id}
                        // propertyId={id}
                        cardId={card_id}
                        type="5"
                        onClickAction={this.onClickAction}
                    />
                </View>

                {folder_tree &&
                    folder_tree.child_data &&
                    folder_tree.child_data.length > 0 &&
                    isShowChoiceFolder == true ? (
                        <TaksChoiceFolder
                            folder_tree={folder_tree}
                            org_id={org_id}
                            board_id={board_id}
                            card_id={card_id}
                            onLoadTasksDetail={this.loadTasksDetail.bind(board_id, card_id)}
                        />
                    ) : (
                        <View></View>
                    )}
            </View>
        );
    }
}

taksDetails.defaultProps = {
    board_id: "", //项目 Id
    content_id: "", //任务Id
    back_icon: "", //显示返回箭头图标还是小房子图标
    flag: "", //对象类型(任务, 日程...)
    backIcon: "", //自定义导航栏里面的返回图标样式标识
};
