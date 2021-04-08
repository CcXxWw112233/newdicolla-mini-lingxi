import Taro, { Component } from '@tarojs/taro';
import { View, Image, Input } from '@tarojs/components';
import indexStyles from './customNavigation.scss';
import globalStyle from '../../../gloalSet/styles/globalStyles.scss'
import defaultPhoto from "../../../asset/chat/defaultPhoto.png";

class CustomNavigation extends Component {
    state = {
        isShowDeleteIcon:false
    }
    goToHomePages = () => {
        const { pop } = this.props;

        if (pop == 'previous') {
            Taro.navigateBack({
                delta: 1,

                fail: function () {
                    Taro.switchTab({ url: `../../pages/calendar/index` })

                }
            })
        } else {
            Taro.switchTab({ url: `../../pages/calendar/index` })
        }
    }

    goToPersonalCenter = () => {
        const { pop } = this.props;
        if (pop == 'previous') {
            Taro.navigateBack({
                delta: 1
            })

        } else {
            this.props.showPersonalCenter()

        }
    }
    // 搜索跳转
    searchClick = e => {
        this.props.searchMenuClick(e.detail.value)
    }
      // 监控是否输入
  startPrint = e => {
    console.log("开始输入",e)
    if(e.detail.value.length > 0) {
      this.setState({
        isShowDeleteIcon:true,
      })
    } else {
        this.setState({
            isShowDeleteIcon:false,
        })
        this.props.cancelSearchMenuClick('')
    }
  }
  formReset = e => {
    this.setState({
      isShowDeleteIcon:false,
    })
    this.props.cancelSearchMenuClick('')
  }
    render() {

        const SystemInfo = Taro.getSystemInfoSync()
        const screen_Width = SystemInfo.screenWidth
        const statusBar_Height = SystemInfo.statusBarHeight
        const navBar_Height = SystemInfo.platform == 'ios' ? 44 : 48
        const { backIcon, home_personal_center, personal_center_image, title,isSearch } = this.props
        const {isShowDeleteIcon} = this.props;
        const navTitle = title ? title : '聆悉'
        return (
            <View className= {`${indexStyles.CustomNavigation_Scss} ${isSearch ? indexStyles.CustomNavigation_white:''}`} style={{ height: statusBar_Height + navBar_Height + 'px' }}>
                <View className={indexStyles.statusBar_Scss} style={{ height: statusBar_Height + 'px' }}></View>
                <View className={indexStyles.navBar_Scss} style={{ height: navBar_Height + 'px' }}>
                    {home_personal_center === 'homePersonalCenter' ?
                        (<View className={indexStyles.home_Wapper} onClick={this.goToPersonalCenter}>
                            {
                                personal_center_image ? (
                                    <Image src={personal_center_image} className={indexStyles.left_home_icon}></Image>
                                ) :
                                    (
                                        // <Text className={`${globalStyle.global_iconfont} ${indexStyles.left_home_icon}`}>&#xe647;</Text>
                                        <Image src={defaultPhoto} className={`${globalStyle.global_iconfont} ${indexStyles.left_home_icon}`}></Image>
                                    )
                            }
                        </View>)
                        :
                        (backIcon === 'arrow_icon' ?
                            (<View className={indexStyles.back_Wapper} style={{  lineHeight: navBar_Height + 'px' }} onClick={this.goToHomePages}>
                                <View className={`${indexStyles.left_back_icon}`}>
                                    <Text className={`${globalStyle.global_iconfont}  ${isSearch ? indexStyles.iconColor:''}`}>&#xe646;</Text>
                                </View>
                            </View>)
                            :
                            (<View className={indexStyles.home_Wapper} onClick={this.goToHomePages}>
                                <View className={indexStyles.left_home_icon}>
                                    <Text className={`${globalStyle.global_iconfont}`}>&#xe7c6;</Text>
                                </View>
                            </View>)
                        )
                    }
                    {
                        isSearch ? (
                            <Form  className={indexStyles.searchForm} onReset={this.formReset}>
                              <View className={indexStyles.searchBarView}>
                                <Text className={`${globalStyle.global_iconfont} ${indexStyles.searchIcon}`} >&#xe643;</Text>
                                <Input placeholder='搜索' onInput={this.startPrint}  placeholderClass={indexStyles.searchBarInput_placeholderStyle} onInput={this.startPrint} className={indexStyles.searchBarInput} onConfirm={this.searchClick}></Input>
                                {
                                  isShowDeleteIcon &&  <Button className={`${globalStyle.global_iconfont} ${indexStyles.deleteIcon}`} formType='reset'  >&#xe639;</Button>
                                }
                              </View>
                            </Form>
                        ):(
                            <View style={{ width: '250px', display: 'inline-block', display: 'flex', justifyContent: 'center', color: '#FFFFFF' }} className={indexStyles.navTitle}>
                                <Text>{navTitle}</Text>
                            </View>
                        )
                    }
                   
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
    title: '聆悉',  // 导航栏title
}
