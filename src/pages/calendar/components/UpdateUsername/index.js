import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Input } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import defaultPhoto from "../../../../asset/chat/defaultPhoto.png";
import cofirm from "../../../../asset/login/cofirm.png";
import edit from "../../../../asset/login/edit.png";
import { checkStrng } from "../../../../utils/verify";

@connect(({ }) => ({}))
export default class PersonalCenter extends Component {
    state = {
        newNickName: ""
    }
    //关闭个人中心
    closePersonalCenter = () => {
        this.props.closeUpateUseername()
    }

    // 开始输入
    onNicknNameInput(e) {
        this.setState({
            newNickName: e.detail.value
        })
    }
    // 确定更改昵称
    confirmNickName() {

        const { account_info = {} } = this.props
        const { name, } = account_info
        var { newNickName } = this.state;

        if (name != newNickName) {
            if (newNickName.length == 0) {
                Taro.showToast({
                    title: '昵称不能为空',
                    duration: 1000
                })
            } else {
                if (checkStrng(newNickName)) {
                    Taro.showToast({
                        title: "带有特殊字符",
                        icon: "none",
                        duration: 2000,
                    });
                } else {
                    this.updateName(newNickName);
                }
            }
        }
    }

    updateName(newNickName) {
        const parmas = {
            name: newNickName,
        }
        const { dispatch } = this.props
        dispatch({
            type: 'accountInfo/updateNickName',
            payload: {
                ...parmas
            }
        })
        dispatch({
            type: 'accountInfo/updateDatas',
            payload: {
                is_mask_show_personalCenter: true
            }
        })
        this.closePersonalCenter()
        Taro.showToast({
            title: "更改成功",
            icon: "none",
            duration: 1000,
        });
    }

    componentDidMount() {
        const { account_info = {} } = this.props;
        const { name, } = account_info;
        this.setState({
            newNickName: name
        })

    }

    render() {

        const SystemInfo = Taro.getSystemInfoSync()
        const screen_Height = SystemInfo.screenHeight
        const statusBar_Height = SystemInfo.statusBarHeight
        const navBar_Height = SystemInfo.platform == 'ios' ? 44 : 48

        const { account_info = {} } = this.props
        const { avatar, name, email, mobile, } = account_info
        const { disabled } = this.state;
        return (
            <View className={indexStyles.mask} style={{ height: screen_Height - (statusBar_Height + navBar_Height) + 'px', marginTop: statusBar_Height + navBar_Height + 'px' }}>
                <View className={indexStyles.personal_center_style}>
                    <View className={indexStyles.personal_center_Title}>欢迎加入灵犀协作</View>
                    <View className={indexStyles.close_button_style} onClick={this.closePersonalCenter}>
                        <Text className={`${globalStyles.global_iconfont}`}>&#xe7fc;</Text>
                    </View>


                    <View className={indexStyles.personal_center_content}>

                        <View className={indexStyles.nick_name_style}>
                            <View className={indexStyles.nickNameTitle}>你的昵称</View>
                            <Input className={indexStyles.nick_name_input} disabled={disabled} value={name} onInput={this.onNicknNameInput}></Input>
                        </View>

                        <View className={indexStyles.confirm_button_style} onClick={this.confirmNickName}>确定</View>
                    </View>
                </View>
            </View>
        )
    }
}

PersonalCenter.defaultProps = {
    account_info: {}, //用户信息
}
