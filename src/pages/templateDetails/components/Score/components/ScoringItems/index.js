
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, ScrollView, Image, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../../../../gloalSet/styles/globalStyles.scss'
import { validateTwoDecimal, } from '../../../../../../utils/verify';
import { loadFindAssignees, } from '../../../../../../utils/basicFunction';
import defaultPhoto from "../../../../../../asset/chat/defaultPhoto.png"

export default class index extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            isSocreInpit: false,  //是否可以输入
            inputWarning: false,  //输入错误警告
            selectInputId: '', //当前选中输入框的id
            commentValue: '', //审批意见内容
        }
    }


    handleInput = e => {
        this.setState({
            commentValue: e.currentTarget.value,
        });
    };

    clickScoreView = (id, assignees = [], status) => {

        //先查询状态是不是进行中, 在查看用户在不在审批人中
        if (((status && status === '1') && (loadFindAssignees(assignees)))) {
            //是否可编辑
            const { isSocreInpit } = this.state
            if (isSocreInpit) {
                this.setState({
                    isSocreInpit: false,
                })
            } else {
                this.setState({
                    isSocreInpit: true,
                    selectInputId: id,
                })
            }
        }
    }

    loadProcessedState = (processed, value) => {
        let processed_status
        if (processed == '0') {
            processed_status = '未评分'
        } else if (processed == '1') {
            processed_status = '评分中'
        } else if (processed == '2') {
            if (value) {
                processed_status = `${value + ' ' + '分'}`
            } else {
                processed_status = '超时自动通过'
            }
        }
        return processed_status;
    }

    //失去焦点
    bindblur = (e, obj) => {
        let value = e.target.value;
        console.log("********************")
        console.log(value)
        if (value && value.length > 0) {
            const { score_items } = this.props
            var currntItems = score_items.find(item => item.id == obj.id);
            currntItems.value = value;
            this.setState({
                score_items: score_items,
            })
        } else {
            this.setState({
                isSocreInpit: false,
                selectInputId: ''
            })
        }
    }

    //实时监测输入
    inputSocreInpit = (e, max_score) => {
        let value = e.target.value;
        if (value > max_score || validateTwoDecimal(value)) {
            this.setState({
                inputWarning: true,
            })
        } else {
            this.setState({
                inputWarning: false,
            })
        }
    }

    //完成
    complete = () => {
        const { score_items } = this.props
        // 使用map()生成数组
        let new_arr = score_items.map(obj => { return { 'field_id': obj.id, 'field_value': obj.value } })

        const { commentValue, isSocreInpit, } = this.state

        // if (!isSocreInpit) {
        const { globalData: { store: { dispatch } } } = Taro.getApp();
        const { flow_instance_id, flow_node_instance_id, } = this.props
        dispatch({
            type: 'workflow/putApprovalComplete',
            payload: {
                flow_instance_id: flow_instance_id,
                flow_node_instance_id: flow_node_instance_id,
                message: commentValue,
                content_values: new_arr,
            },
        })
        // }
    }

    getNewScoreItems = (score_items) => {
        let new_array = []
        score_items.forEach(element => {
            if (element['is_total'] == '0') {
                new_array.push(element)
            }
        });

        return new_array;
    }

    render() {
        const { assignees, score_items, status, } = this.props
        const { isSocreInpit, inputWarning, selectInputId } = this.state
        return (
            <View className={indexStyles.viewStyle}>

                <View className={indexStyles.line_cell}>
                    <View className={indexStyles.line_empty}></View>
                    <View className={indexStyles.line}></View>
                </View>

                <View className={indexStyles.content_cell}>

                    <ScrollView scrollX >
                        <View className={indexStyles.scoring_input}>
                            {score_items && this.getNewScoreItems(score_items).map((item, key) => {

                                const { id, max_score, title, value } = item
                                return (
                                    <View key={id} className={indexStyles.scoring_items}>
                                        <View className={indexStyles.scoring_items_title}>{title}</View>
                                        {
                                            ((selectInputId == id) &&
                                                isSocreInpit && status == '1') || item.value ?
                                                (<Input
                                                    className={indexStyles.score_view_input}
                                                    type='digit'
                                                    maxLength='5'
                                                    // placeholder={item.value}
                                                    value={item.value}
                                                    onInput={(e) => this.inputSocreInpit(e, max_score)}
                                                    onblur={(e) => this.bindblur(e, item)}
                                                // disabled={true}
                                                ></Input>)
                                                :
                                                (<View className={indexStyles.score_view} onClick={() => this.clickScoreView(id, assignees, status)}>
                                                    <View className={indexStyles.score_view_title}>最高</View>
                                                    <View className={indexStyles.score_view_double}>{max_score}</View>
                                                    <View className={indexStyles.score_view_title}>分</View>
                                                </View>)
                                        }
                                        {
                                            (selectInputId == id) && inputWarning ? (<View className={indexStyles.input_warning}>输入有误</View>) : (<View></View>)
                                        }
                                    </View>
                                )
                            })}
                        </View>
                    </ScrollView>

                    <View className={indexStyles.assignees}>
                        {assignees && assignees.map((value, key) => {
                            const { id, avatar, name, processed, score_items, comment } = value
                            const average_auto = score_items && score_items.length;

                            return (

                                <View key={id} className={indexStyles.score_cell_style}>

                                    <View className={indexStyles.average}>
                                        {
                                            avatar ? (
                                                <Image className={indexStyles.avatar_image_style} src={avatar}></Image>
                                            ) : (
                                                    // <Text className={`${globalStyles.global_iconfont} ${indexStyles.avatar_image_style}`}>&#xe647;</Text>
                                                    <Image src={defaultPhoto} className={`${globalStyles.global_iconfont} ${indexStyles.avatar_image_style}`}></Image>

                                                )
                                        }


                                        <View className={indexStyles.rater_name}>{name}</View>
                                        <View className={`${indexStyles.average_number} ${average_auto ? '' : indexStyles.average_auto}`}>{this.loadProcessedState(processed, score_items && score_items[score_items.length - 1]['value'])}</View>
                                    </View>

                                    <View className={indexStyles.score_comment}>{comment}</View>

                                </View>

                            )
                        })}
                    </View>

                    <View class={indexStyles.opinion_cell}>
                        <View class={indexStyles.opinion_title}>意见</View>
                        <View class={indexStyles.opinion_content}>
                            <Textarea className={indexStyles.textarea}
                                placeholder='填写意见'
                                onInput={this.handleInput}
                                value={commentValue}
                                auto-height={false}
                                show-confirm-bar={false}
                                adjust-position={true}
                                disabled={!isSocreInpit}
                            />
                        </View>
                    </View>
                    <View class={indexStyles.complete}>
                        <View class={`${indexStyles.button} ${isSocreInpit ? indexStyles.complete_button_disabled : indexStyles.complete_button}`} onClick={this.complete}>完成</View>
                    </View>
                </View>
            </View>
        )
    }
}

index.defaultProps = {
    recipients: [], //填写人array
    assignees: [], //抄送人array
    score_items: [], //评分数组   
    status: '', //当前节点进度 0未进行 1进行中 2完成
    flow_instance_id: '', //流程id
    flow_node_instance_id: '', //流程节点id
};
