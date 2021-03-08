
import Taro, { Component } from '@tarojs/taro'
import { View, Textarea } from '@tarojs/components'
import indexStyles from './index.scss'
import RejectPopup from '../RejectPopup'

export default class index extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            commentValue: '', //审批意见内容,
            isRejectPopup: false
        }
    }


    handleInput = e => {
        this.setState({
            commentValue: e.currentTarget.value
        });
    };

    //驳回
    onReject = () => {
        this.setState({
            isRejectPopup: true,
            popupTitle: '驳回意见'
        })
    }
    onAdopt = () => {
        this.setState({
            isRejectPopup: true,
            popupTitle: '通过意见'
        })
    }
    // 取消
    cancelAction = () => {
        this.setState({
            isRejectPopup: false,
        })
    }
    onRejectAction(e) {
        const { popupTitle } = this.state;
        if (popupTitle == '通过意见') {
            this.onAdoptHandle(e)
            this.cancelAction()
        } else {
            if (e.length > 0 && e) {
                this.rejectHandle(e);
                this.cancelAction();
            } else {
                Taro.showToast({
                    title: '请输入' + popupTitle,
                    icon: 'none',
                    duration: 2000
                })
            }
        }
    }

    rejectHandle(e) {
        const { globalData: { store: { dispatch } } } = Taro.getApp();
        const { flow_instance_id, flow_node_instance_id, } = this.props
        dispatch({
            type: 'workflow/putApprovalReject',
            payload: {
                flow_instance_id: flow_instance_id,
                flow_node_instance_id: flow_node_instance_id,
                message: e,
            },
        })
    }

    //通过
    onAdoptHandle = (e) => {
        const { globalData: { store: { dispatch } } } = Taro.getApp();
        const { flow_instance_id, flow_node_instance_id, } = this.props
        dispatch({
            type: 'workflow/putApprovalComplete',
            payload: {
                flow_instance_id: flow_instance_id,
                flow_node_instance_id: flow_node_instance_id,
                message: e,
            },
        })
    }
    render() {
        const { isRejectPopup, popupTitle } = this.state;
        return (
            <View className={indexStyles.viewStyle}>

                <View className={indexStyles.line_cell}>
                    <View className={indexStyles.line_empty}></View>
                    <View className={indexStyles.line}></View>
                </View>

                <View className={indexStyles.content}>
                    <View className={indexStyles.content_padding}>
                        {/* <Textarea className={indexStyles.textarea} */}
                        {/* placeholder='填写审批意见' */}
                        {/* onInput={this.handleInput} */}
                        {/* value={commentValue} */}
                        {/* auto-height={false} */}
                        {/* show-confirm-bar={false} */}
                        {/* adjust-position={true} */}
                        {/* /> */}



                        <View className={indexStyles.operation}>
                            <View className={`${indexStyles.opinion_button} ${indexStyles.reject}`} onClick={this.onReject}>驳回</View>
                            <View className={`${indexStyles.opinion_button} ${indexStyles.adopt}`} onClick={this.onAdopt}>通过</View>
                        </View>
                    </View>
                </View>
                {
                    isRejectPopup ? (
                        <RejectPopup onClickAction={(e) => this.onRejectAction(e)} cancelAction={() => this.cancelAction()} popupTitle={popupTitle}></RejectPopup>) : (null)
                }

            </View>
        )
    }
}


index.defaultProps = {
    flow_instance_id: '', //流程id
    flow_node_instance_id: '', //流程节点id
};
