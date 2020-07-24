
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../../../../gloalSet/styles/globalStyles.scss'
import { checkDecimal, validateTwoDecimal, clearNoNum, } from '../../../../../../utils/verify';

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

    loadFindAssignees = (assignees = []) => {
        const account_info_string = Taro.getStorageSync('account_info')
        const account_info = JSON.parse(account_info_string)
        const { id } = account_info
        //判断当前等登录用户 在不在审批人assignees当中
        //不在就返回false
        //在当中根据processed状态为1,返回true,不在为返回false
        var currntAssignees = assignees.find(item => item.id == id);
        if (currntAssignees) {
            const { processed } = currntAssignees
            if (processed == '1') {
                return true
            } else {
                return false
            }
        }
        else {
            return false;
        }
    }

    clickScoreView = (id, assignees = [], status) => {

        //先查询状态是不是进行中, 在查看用户在不在审批人中
        if (((status && status === '1') && (this.loadFindAssignees(assignees)))) {
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
            processed_status = `${value + ' ' + '分'}`
        }
        return processed_status;
    }


    //失去焦点
    // checkSocreInpit = (e) => {
    //     let value = e.target.value;
    //     console.log('value=====', value);
    // }

    //失去焦点
    bindblur = (e, obj) => {
        let value = e.target.value;
        const { score_items } = this.props

        var currntItems = score_items.find(item => item.id == obj.id);
        currntItems.value = value;

        this.setState({
            score_items: score_items,
        })
    }

    //实时监测输入
    inputSocreInpit = (e) => {
        let value = e.target.value;
        if (value > 100.0 || validateTwoDecimal(value)) {
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
        if (!isSocreInpit) {
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
        }
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
                            {score_items && score_items.map((item, key) => {
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
                                                    placeholder={item.value}
                                                    // onBlur={this.checkSocreInpit}
                                                    // onConfirm={this.checkSocreInpit}
                                                    onInput={this.inputSocreInpit}
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
                            return (
                                <View key={id} className={indexStyles.average}>
                                    {
                                        avatar ? (
                                            <Image className={indexStyles.avatar_image_style} src={avatar}></Image>
                                        ) : (
                                                <Text className={`${globalStyles.global_iconfont} ${indexStyles.avatar_image_style}`}>&#xe647;</Text>)
                                    }
                                    <View className={indexStyles.rater_name}>{name}</View>
                                    <View className={indexStyles.average_number}>{this.loadProcessedState(processed, score_items && score_items[score_items.length - 1]['value'])}</View>
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