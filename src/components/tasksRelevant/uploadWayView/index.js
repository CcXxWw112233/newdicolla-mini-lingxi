import Taro, { Component } from '@tarojs/taro'
import { View, Picker,RichText } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../gloalSet/styles/globalStyles.scss'
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
        } else if(mold == 'describeTasks' || mold == 'file') {
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
    if(index == 0) {
        // 文件上传
        typeof this.props.uploadFile == "function" &&
        this.props.uploadFile();
    } else if(index == 1) {
        // 微信上传
        typeof this.props.uploadWXFile == "function" &&
        this.props.uploadWXFile();
    } else if(index == 2) {
        // 删除(子任务弹窗)
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
    /**
     * 编辑子任务
     */
    editSubTask() {
        typeof this.props.onClickAction == "function" &&
        this.props.editSubTask();
    }
    render() {
        const { singleList = [], } = this.state
        const {title,mold} = this.props
        return (
            <View className={indexStyles.index} onTouchMove={(e) => {e.stopPropagation()}} onClick={this.cancelSelect}>
                   <View className={indexStyles.content_view} onClick={(e) => {e.stopPropagation()}}>
                    <View className={indexStyles.content_topline_view}></View>
                    <View className={indexStyles.content_title_view}>
                       <View className={indexStyles.content_title_left}>
                        {
                            mold =='subTask' ? (
                                <View className={`${globalStyle.global_iconfont} ${indexStyles.iconfont}`}>&#xe867;</View>
                            ):(
                                <View className={`${globalStyle.global_iconfont} ${indexStyles.iconfont}`}>&#xe6a8;</View>
                            )
                        }
                          <View className={indexStyles.content_title_text}>{title}</View>
                       </View>
                       {
                           mold =='subTask' && <View className={indexStyles.content_confirm} onClick={this.editSubTask}>编辑</View>
                       }
                       
                    </View>
                    <ScrollView className={indexStyles.scrollview} scrollY scrollWithAnimation>
                       {
                           singleList && singleList.map((item,key)=>{
                               return (
                                <View className={`${indexStyles.content_item}`} onClick={this.selectItem.bind(this,key)}>
                                    <View className={indexStyles.content_title_left}>
                                        <RichText className={`${globalStyle.global_iconfont} ${indexStyles.list_item_icon}`} nodes={item.icon}></RichText>
                                        <View className={`${indexStyles.content_item_name}`}>{item.text}</View>
                                    </View>
                                </View>
                               )
                           })
                       }
                    </ScrollView>
                    <View className={indexStyles.cencel_View} onClick={this.cancelSelect}>取消</View>
                </View>
            </View>
        )
    }
}

