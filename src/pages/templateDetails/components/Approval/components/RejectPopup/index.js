import Taro, { Component } from '@tarojs/taro'
import { View, Button, Textarea } from '@tarojs/components'
import indexStyles from './index.scss'




export default class RejectPopup extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            rejectText: ''
        }
    }

    componentDidMount() { }

    componentDidShow() { }

    cancel() {
        typeof this.props.cancelAction == "function" &&
            // eslint-disable-next-line taro/this-props-function
            this.props.cancelAction();
    }
    handleInput(e) {
        this.setState({
            rejectText: e.detail.value
        })
    }
    confirm() {
        const { rejectText } = this.state;
        typeof this.props.onClickAction == "function" &&
            this.props.onClickAction(rejectText);
    }
    render() {
        const { popupTitle } = this.props;
        return (
            <View className={indexStyles.fieldSelectionView}>

                <View className={indexStyles.index}>
                    <View className={indexStyles.titleView}>{popupTitle}</View>

                    <View >
                        <Textarea className={indexStyles.textarea} placeholder='填写审批意见' onInput={this.handleInput} showConfirmBar='false' adjust-position='true' />
                    </View>
                    <View className={`${indexStyles.login_footer}`}>
                        <Button className={`${indexStyles.login_btn_normal} ${indexStyles.login_btn} ${indexStyles.cencel_btn}`} onClick={this.cancel}>取消</Button>
                        <Button className={`${indexStyles.login_btn_normal} ${indexStyles.login_btn}`} type='primary' onClick={this.confirm}>确定</Button>

                    </View>
                </View>
            </View>
        )
    }
}


RejectPopup.defaultProps = {

};