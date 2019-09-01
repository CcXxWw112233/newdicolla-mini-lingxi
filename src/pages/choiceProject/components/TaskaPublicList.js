import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './TaskaPublicList.scss'
import TopOption from '../../../components/tasksRelevant/TopOption/index'
// import OrganizationList from '../components/OrganizationList/index'
import Indexes from './Indexes/index'

export default class TaskaPublicList extends Component {

    componentWillReceiveProps() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

  
    render() {
        return (
            <View className={indexStyles.topStyle}>
                <TopOption />
                {/* <OrganizationList/> */}
                <Indexes />
            </View>
        )
    }
}
