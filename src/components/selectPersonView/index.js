import Taro, { Component } from '@tarojs/taro'
import { View, Picker,RichText } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import { AtRadio } from 'taro-ui'

@connect(({ tasks: { tasksDetailDatas = {}, }, }) => ({
    tasksDetailDatas,
}))
export default class SingleChoicePicker extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            singleList : [
                {
                    icon:'&#xe84b;',
                    text:'上传文件',
                },
                {
                    icon:'&#xe846;',
                    text:'导入微信文件',
                },
                {
                    icon:'&#xe84a;',
                    text:'删除',
                }
            ]
        }
    }

   

    componentDidMount() {
        const { mold } = this.props;
        const { singleList=[] } = this.state;
        var currentSingleList = singleList;
        if(mold =='subTask') {
            currentSingleList[0].text = '上传交付物';
        } else if(mold == 'describeTasks') {
            currentSingleList.pop()
        }
        this.setState({
            singleList:currentSingleList
        })
    }
    /**
     * 选择
     * @param {*} item 
     */
  selectItem = (index) => {
    console.log(index)
    if(index == 0) {
        typeof this.props.uploadFile == "function" &&
        this.props.uploadFile();
    } else if(index == 1) {
        typeof this.props.uploadWXFile == "function" &&
        this.props.uploadWXFile();
    } else if(index == 2) {
        typeof this.props.deleteAction == "function" &&
        this.props.deleteAction();
    }
    typeof this.props.onClickAction == "function" &&
    this.props.onClickAction();
}

    /**
     * 取消选择
     */
    cancelSelect () {
        typeof this.props.onClickAction == "function" &&
        this.props.onClickAction();
    }
    render() {
        const { singleList = [] } = this.state
        const {title} = this.props
        return (
            <View className={indexStyles.index}>
                   <View className={indexStyles.content_view}>
                    <View className={indexStyles.content_topline_view}></View>
                    <View className={indexStyles.content_title_view}>
                       <View className={indexStyles.content_title_left}>
                          <View className={`${globalStyle.global_iconfont} ${indexStyles.iconfont}`}>&#xe6a8;</View>
                          <View className={indexStyles.content_title_text}>{title}</View>
                       </View>
                       <View className={indexStyles.content_confirm} onClick={this.confirmSelect}>确定</View>
                    </View>
                    <ScrollView className={indexStyles.scrollview} scrollY scrollWithAnimation>
                     
                    </ScrollView>
                    <View className={indexStyles.cencel_View} onClick={this.cancelSelect}>取消</View>
                </View>
            </View>
        )
    }
}

