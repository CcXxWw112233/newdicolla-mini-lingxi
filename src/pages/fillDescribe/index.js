import Taro, { Component, getApp } from '@tarojs/taro'
import { View } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../../gloalSet/styles/globalStyles.scss'
import { AtTextarea } from 'taro-ui'
import TopOption from '../../components/tasksRelevant/TopOption/index'


export default class fillDescribe extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: ''
        }
    }

    componentWillReceiveProps() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    topCurrencyDetermineChoice = () => {
        const { value } = this.state
        var pages = Taro.getCurrentPages()
        var prevPage = null
        if (pages.length >= 2) {
            prevPage = pages[pages.length-2]
        }
        if (prevPage) {
            prevPage.setData({
                describeInfo: value,
            }, function(){
                Taro.navigateBack({})
            })
        }
    }

    handleChange(event) {
        this.setState({
            value: event.target.value
        })
    }
    render() {

        return (
            <View className={indexStyles.viewStyle}>
                <TopOption topCurrencyDetermineChoice={() => this.topCurrencyDetermineChoice()}/>
                <AtTextarea value={this.state.value}
                    onChange={this.handleChange.bind(this)}
                    placeholder='项目描述...'
                    count={false}
                    height={200}>
                </AtTextarea>
            </View>
        )
    }
}
