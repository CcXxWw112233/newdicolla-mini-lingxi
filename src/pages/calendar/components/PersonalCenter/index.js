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
        isfouce: false,
        disabled: true,
        newNickName: ""
    }
    //关闭个人中心
    closePersonalCenter = () => {
        this.props.closePersonalCenter()
    }

    //退出账户
    changeAccount = () => {
        let access_token = Taro.getStorageSync('access_token')
        let refresh_token = Taro.getStorageSync('refresh_token')
        const parmas = {
            accessToken: access_token,
            refreshToken: refresh_token,
        }
        const { dispatch } = this.props
        dispatch({
            type: 'accountInfo/changeOut',
            payload: {
                ...parmas
            }
        })

        const { globalData: { store: { getState } } } = Taro.getApp();
        const { im: { nim } } = getState();
        nim.destroy();

        dispatch({
            type: 'im/updateStateFieldByCover',
            payload: {
                nim: null
            }
        });

        dispatch({
            type: 'accountInfo/updateDatas',
            payload: {
                is_mask_show_personalCenter: false
            }
        })

        wx.hideTabBarRedDot({
            index: 1
        })
    }
    // 开始更改昵称
    editNickName() {
        this.setState({
            disabled: false,
            isfouce: true
        })
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
                    this.setState({
                        disabled: false,
                    })
                } else {
                    this.updateName(newNickName);
                    this.setState({
                        disabled: true,
                    })
                }
            }
        } else {
            this.setState({
                disabled: true
            })
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

                    <View className={indexStyles.close_button_style} onClick={this.closePersonalCenter}>
                        <Text className={`${globalStyles.global_iconfont}`}>&#xe7fc;</Text>
                    </View>
                    <View className={indexStyles.personal_center_content}>
                        {
                            avatar ? (
                                <Image className={indexStyles.avatar_image_style} src={avatar}></Image>
                            ) : (
                                    // <Text className={`${globalStyles.global_iconfont} ${indexStyles.avatar_image_style}`}>&#xe647;</Text>
                                    <Image src={defaultPhoto} className={`${globalStyles.global_iconfont} ${indexStyles.avatar_image_style}`}></Image>
                                )
                        }

                        <View className={indexStyles.nick_name_style}>
                            <Input className={indexStyles.nick_name_input} disabled={disabled} focus={!disabled} value={name} onInput={this.onNicknNameInput}></Input>
                            {
                                disabled ? (<Image className={indexStyles.nick_name_edit} src={edit} onClick={this.editNickName}></Image>) : (<Image className={indexStyles.nick_name_edit} onClick={this.confirmNickName} src={cofirm}></Image>)
                            }

                        </View>

                        <View className={indexStyles.account_style}>
                            <Text>{email}\n{mobile}</Text>
                        </View>
                        <View className={indexStyles.logout_button_style} onClick={this.changeAccount}>退出登录</View>
                    </View>
                </View>
            </View>
        )
    }
}

PersonalCenter.defaultProps = {
    account_info: {}, //用户信息
}
