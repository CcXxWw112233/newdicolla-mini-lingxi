import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import indexStyles from './customNavigation.scss';
import globalStyle from '../../gloalSet/styles/globalStyles.scss'

class CustomNavigation extends Component {

    state = {
        isHideLeftIcom: false,        //是否显示左上角backIcon图标
        backIcon: 'arrow_icon',       //左上角图标, arrow_icon = 返回箭头, 否则为小房子图标
        customNavigationTitle: '灵犀协作', //导航栏title
    }

    goToHomePages = () => {
        const { backIcon } = this.props
        if (backIcon == 'arrow_icon') {  //返回图标, 返回上一页 
            Taro.navigateBack({
                delta: 1,
            })
        } else {  //小房子图标, 返回首页
            Taro.reLaunch({ url: `../../pages/calendar/index` })
        }
    }

    componentDidMount() {
        const { is_HideLeftIcom, back_Icon, custom_NavigationTitle } = this.props
        console.log(back_Icon, 'ssss11');
        this.setState({
            isHideLeftIcom: is_HideLeftIcom,
            backIcon: back_Icon,
            CustomNavigationTitle: custom_NavigationTitle,
        })
    }

    render() {

        const SystemInfo = Taro.getSystemInfoSync()
        const statusBar_Height = SystemInfo.statusBarHeight
        const navBar_Height = SystemInfo.platform == 'ios' ? 44 : 48

        const { isHideLeftIcom, backIcon, customNavigationTitle } = this.state
        console.log(backIcon, 'ssss');

        let leftIcon = backIcon !== 'home_icon' ? <Text className={`${globalStyle.global_iconfont}`}>&#xe646;</Text> : <Text className={`${globalStyle.global_iconfont}`}>&#xe7c6;</Text>

        return (
            <View className={indexStyles.CustomNavigation_Scss} style={{ height: statusBar_Height + navBar_Height + 'px' }}>
                <View className={indexStyles.statusBar_Scss} style={{ height: statusBar_Height + 'px' }}></View>
                <View className={indexStyles.navBar_Scss} style={{ height: navBar_Height + 'px' }}>
                    {isHideLeftIcom == 'ture' ? '' :
                        <View className={indexStyles.homeWapper} style={{ width: '80px', lineHeight: navBar_Height + 'px' }} onClick={this.goToHomePages}>
                            <View className={indexStyles.left_home_icon}>
                                {leftIcon}
                            </View>
                        </View>
                    }
                    <View style={{ width: '80px', display: 'inline-block', display: 'flex', justifyContent: 'center', color: '#FFFFFF' }}>
                        <Text>{customNavigationTitle}</Text>
                    </View>
                    <View style={{ width: '80px', display: 'inline-block' }}></View>
                </View>
            </View>
        );
    }
}

export default CustomNavigation;