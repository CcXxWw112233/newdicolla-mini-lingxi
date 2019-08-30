import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import globalStyles from '../../../../gloalSet/styles/globalStyles.scss'
import TaskaPublicList from './components/TaskaPublicList.js'

export default class choiceProject extends Component {

    componentWillReceiveProps(nextProps) { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }
    
    render() {

        return (
            <View>
                <TaskaPublicList />
            </View>
        )
    }
}
