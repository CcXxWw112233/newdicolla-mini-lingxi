import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import indexStyles from './customNavigation.scss';
import icon_home_normal from '../../../asset/Invitation/icon_home_normal.png';
import globalStyle from '../../../gloalSet/styles/globalStyles.scss'

class CustomNavigation extends Component {
    state = {};

    goToHomePages = () => {
        Taro.switchTab({ url: `../../pages/calendar/index` })
    }

    goToPersonalCenter = () => {
        this.props.showPersonalCenter()
    }

    render() {

        const SystemInfo = Taro.getSystemInfoSync()
        const screen_Width = SystemInfo.screenWidth
        const statusBar_Height = SystemInfo.statusBarHeight
        const navBar_Height = SystemInfo.platform == 'ios' ? 44 : 48
        const { backIcon, home_personal_center, personal_center_image, } = this.props

        return (
            <View className={indexStyles.CustomNavigation_Scss} style={{ height: statusBar_Height + navBar_Height + 'px' }}>
                <View className={indexStyles.statusBar_Scss} style={{ height: statusBar_Height + 'px' }}></View>
                <View className={indexStyles.navBar_Scss} style={{ height: navBar_Height + 'px' }}>
                    {home_personal_center === 'homePersonalCenter' ?
                        (<View className={indexStyles.home_Wapper} onClick={this.goToPersonalCenter}>
                            <Image src={personal_center_image} className={indexStyles.left_home_icon}></Image>
                        </View>)
                        :
                        (backIcon == 'arrow_icon' ?
                            (<View className={indexStyles.back_Wapper} style={{ width: '80px', lineHeight: navBar_Height + 'px' }} onClick={this.showPersonalCenter}>
                                <View className={indexStyles.left_back_icon}>
                                    <Text className={`${globalStyle.global_iconfont}`}>&#xe646;</Text>         </View>
                            </View>)
                            :
                            (<View className={indexStyles.home_Wapper} onClick={this.goToHomePages}>
                                <View className={indexStyles.left_home_icon}>
                                    <Text className={`${globalStyle.global_iconfont}`}>&#xe7c6;</Text>
                                </View>
                            </View>)

                        )
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

CustomNavigation.deafultProps = {
    home_personal_center: '', //自定义导航栏首页左侧是否显示个人中心图标, homePersonalCenter string 是,
    backIcon: '', //自定义导航左侧图标显示back icon 还是 home icon, arrow_icon string 是,
    personal_center_image: '', //个人中心头像
    showPersonalCenter: '',  // 显示个人中心事件
}
