import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import indexStyles from './customNavigation.scss';
import icon_home_normal from '../../../asset/Invitation/icon_home_normal.png';
import globalStyle from '../../../gloalSet/styles/globalStyles.scss'

class CustomNavigation extends Component {
    state = {};

    goToHomePages = () => {
        Taro.reLaunch({ url: `../../pages/calendar/index` })
    }

    render() {

        const SystemInfo = Taro.getSystemInfoSync()
        const screen_Width = SystemInfo.screenWidth
        const statusBar_Height = SystemInfo.statusBarHeight
        const navBar_Height = SystemInfo.platform == 'ios' ? 44 : 48
        const { backIcon } = this.props

        let leftIcon = backIcon == 'arrow_icon' ? <Text className={`${globalStyle.global_iconfont}`}>&#xe646;</Text> : <Text className={`${globalStyle.global_iconfont}`}>&#xe7c6;</Text>

        return (
            <View className={indexStyles.CustomNavigation_Scss} style={{ height: statusBar_Height + navBar_Height + 'px' }}>
                <View className={indexStyles.statusBar_Scss} style={{ height: statusBar_Height + 'px' }}></View>
                <View className={indexStyles.navBar_Scss} style={{ height: navBar_Height + 'px' }}>
                    {
                        backIcon == 'arrow_icon' ? (<View className={indexStyles.back_Wapper} style={{ width: '80px', lineHeight: navBar_Height + 'px' }} onClick={this.goToHomePages}>
                            <View className={indexStyles.left_back_icon}>
                                {leftIcon}
                            </View>
                        </View>
                        ) : (<View className={indexStyles.home_Wapper} onClick={this.goToHomePages}>
                            <View className={indexStyles.left_home_icon}>
                                {leftIcon}
                            </View>
                        </View>)
                    }

                    <View style={{ width: '80px', display: 'inline-block', display: 'flex', justifyContent: 'center', color: '#FFFFFF' }}>
                        <Text>灵犀协作</Text>
                    </View>
                    <View style={{ width: '80px', display: 'inline-block' }}></View>
                </View>
            </View>
        );
    }
}

export default CustomNavigation;