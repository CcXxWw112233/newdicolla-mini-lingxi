import Taro, { Component } from '@tarojs/taro'
import { View,  Textarea, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'


@connect(({ tasks: { tasksDetailDatas = {}, }, }) => ({
    tasksDetailDatas,
}))
export default class index extends Component {
    config = {
        navigationBarTitleText: "任务说明",
    };
    state = {
        desText:''
    }
    /**
     * 开始输入
     * @param {*} e 
     */
    startPrint = e => {
        console.log(e.detail.value)
        this.setState({
            desText:e.detail.value
        })
    }
    /**
     * 确定添加
     */
    confirmadd () {
        const {desText} = this.state;
        const {dispatch,tasksDetailDatas} = this.props;
        if(desText) {
            dispatch({
                type: 'tasks/putCardBaseInfo',
                payload: {
                    card_id: tasksDetailDatas.card_id,
                    description: "<p>" + desText + "</p>",
                }
            }).then((res) => {
                Taro.navigateBack({
                    delta:1
                })
            })

        } else {
            Taro.showToast({
                title: '请输入文件说明',
                icon: 'none',
                duration: 2000
            })
        }
    }
    render() {
        const {desText} = this.state
        return (
            <View className={indexStyles.wapper}>
                <Textarea className={indexStyles.wapper_Textarea}  onInput={this.startPrint} autoFocus={true} placeholder='请输入任务说明'/>
                <View className={`${indexStyles.desrlbeTask} ${desText ? '':indexStyles.desrlbeTask_unuse}`}  onClick={this.confirmadd} >确认添加</View>
            </View>
        )
    }
}


