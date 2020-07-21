import Taro, { Component } from '@tarojs/taro'
import { View, Text, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import RelevantPersonnel from './../CommonComponents/RelevantPersonnel/index'
import OtherCell from './../CommonComponents/OtherCell/index'
import Enclosure from './components/Enclosure/index'
import OnlineTable from './components/OnlineTable/index'

export default class index extends Component {

    constructor() {
        super(...arguments)
        this.state = {
        }
    }

    render() {

        const { recipients, assignees, last_complete_time } = this.props

        return (
            <View className={indexStyles.viewStyle}>

                <View className={indexStyles.other_cell}>
                    <RelevantPersonnel recipients={recipients} assignees={assignees} last_complete_time={last_complete_time} />
                </View>

                <View className={indexStyles.other_cell}>
                    <OtherCell />
                </View>

                <View className={indexStyles.other_cell}>
                    <OtherCell />
                </View>

                <View className={indexStyles.other_cell}>
                    <OtherCell />
                </View>

                <View className={indexStyles.other_cell}>
                    <OtherCell />
                </View>

                <View className={indexStyles.other_cell}>
                    <Enclosure />
                </View>

                <View className={indexStyles.other_cell}>
                    <OnlineTable />
                </View>

            </View>
        )
    }
}
