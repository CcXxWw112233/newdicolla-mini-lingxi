import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'

@connect(({ }) => ({}))
export default class PersonalCenter extends Component {

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

    render() {

        const SystemInfo = Taro.getSystemInfoSync()
        const screen_Height = SystemInfo.screenHeight
        const statusBar_Height = SystemInfo.statusBarHeight
        const navBar_Height = SystemInfo.platform == 'ios' ? 44 : 48

        const { account_info = {} } = this.props
        const { avatar, name, email, mobile, } = account_info

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
                                    <Text className={`${globalStyles.global_iconfont} ${indexStyles.avatar_image_style}`}>&#xe647;</Text>
                                )
                        }
                        <View className={indexStyles.nick_name_style}>{name}</View>
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
