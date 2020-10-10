
import Taro, { Component } from '@tarojs/taro'
import { View, Textarea } from '@tarojs/components'
import indexStyles from './index.scss'

export default class index extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            commentValue: '', //审批意见内容
        }
    }


    handleInput = e => {
        this.setState({
            commentValue: e.currentTarget.value
        });
    };

    //驳回
    onReject = () => {
        const { globalData: { store: { dispatch } } } = Taro.getApp();
        const { flow_instance_id, flow_node_instance_id, } = this.props
        const { commentValue } = this.state
        dispatch({
            type: 'workflow/putApprovalReject',
            payload: {
                flow_instance_id: flow_instance_id,
                flow_node_instance_id: flow_node_instance_id,
                message: commentValue,
            },
        })
    }

    //通过
    onAdopt = () => {
        const { globalData: { store: { dispatch } } } = Taro.getApp();
        const { flow_instance_id, flow_node_instance_id, } = this.props
        const { commentValue } = this.state
        dispatch({
            type: 'workflow/putApprovalComplete',
            payload: {
                flow_instance_id: flow_instance_id,
                flow_node_instance_id: flow_node_instance_id,
                message: commentValue,
            },
        })
    }

    render() {

        return (
            <View className={indexStyles.viewStyle}>

                <View className={indexStyles.line_cell}>
                    <View className={indexStyles.line_empty}></View>
                    <View className={indexStyles.line}></View>
                </View>

                <View className={indexStyles.content}>
                    <View className={indexStyles.content_padding}>
                        <Textarea className={indexStyles.textarea}
                            placeholder='填写审批意见'
                            onInput={this.handleInput}
                            value={commentValue}
                            auto-height={false}
                            show-confirm-bar={false}
                            adjust-position={true}
                        />

                        <View className={indexStyles.operation}>
                            <View className={`${indexStyles.opinion_button} ${indexStyles.reject}`} onClick={this.onReject}>驳回</View>
                            <View className={`${indexStyles.opinion_button} ${indexStyles.adopt}`} onClick={this.onAdopt}>通过</View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}


index.defaultProps = {
    flow_instance_id: '', //流程id
    flow_node_instance_id: '', //流程节点id
};
