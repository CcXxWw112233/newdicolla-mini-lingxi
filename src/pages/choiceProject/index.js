import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import globalStyles from '../../../../gloalSet/styles/globalStyles.scss'
import TaskaPublicList from './components/TaskaPublicList.js'

export default class choiceProject extends Component {
    constructor() {
        super(...arguments)
        this.state = {
            title: '',
        }
    }
    componentWillReceiveProps(nextProps) { }

    componentWillUnmount() { }

    componentDidMount() {
        const { title } = this.$router.params
        this.setState({
            title: title,
        })
    }

    componentDidShow() { }

    componentDidHide() { }
    
    render() {
        const { title } = this.state
        return (
            <View>
                <TaskaPublicList title={title}/>
            </View>
        )
    }
}
