import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './TaskaPublicList.scss'
import TopOption from '../../../components/tasksRelevant/TopOption/index'
// import OrganizationList from '../components/OrganizationList/index'
import Indexes from './Indexes/index'

export default class TaskaPublicList extends Component {
    constructor() {
        super(...arguments)
        this.state = {
            value: '',
            title: '',
        }
    }

    componentWillReceiveProps() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    topCurrencyDetermineChoice = () => {
        const { title } = this.props
        const { value } = this.state
        var pages = Taro.getCurrentPages()
        var prevPage = null
        if (pages.length >= 2) {
            prevPage = pages[pages.length - 2]
        }
        if (prevPage) {
            prevPage.setData({
                valueInfo: value,
                source: title,
            }, function () {
                Taro.navigateBack({})
            })
        }
    }

    callback = (callValue) => {
        this.setState({
            value: callValue
        })
    }

    render() {
        const { title } = this.props
        const titleName = title
        return (
            <View className={indexStyles.topStyle}>
                <TopOption topCurrencyDetermineChoice={() => this.topCurrencyDetermineChoice()} />
                {/* <OrganizationList/> */}
                <Indexes callback={(item) => this.callback(item)} titleName={titleName} />
            </View>
        )
    }
}
