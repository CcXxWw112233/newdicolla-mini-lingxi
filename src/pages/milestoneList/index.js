import Taro, { Component } from '@tarojs/taro'
import { View, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import { AtAccordion, AtList, AtListItem } from 'taro-ui'

@connect(({ tasks: { milestone_list = [], }, }) => ({
    milestone_list,
}))
export default class milestoneList extends Component {
    config = {
        navigationBarTitleText: '里程碑'
    }

    constructor() {
        super(...arguments)
        this.state = {
            open: false,
        }
    }
    handleClick(value) {
        this.setState({
            open: value
        })
    }

    // componentDidMount() {

    //     const { contentId, listId } = this.$router.params

    //     this.setState({
    //         card_id: contentId,
    //         value: listId,
    //     })

    //     const { group_list = [] } = this.props

    //     group_list.forEach(item => {
    //         item['label'] = item.list_name
    //         item['value'] = item.list_id
    //     })

    //     this.setState({
    //         groupList: group_list,
    //     })
    // }

    render() {

        const { milestone_list = [] } = this.props

        return (
            <View className={indexStyles.viewStyle}>

                {milestone_list.map((value, key) => {
                    const { board_id, id, milestone_chird = [], name, } = value
                    return (
                        <View key={key}>
                            <AtAccordion
                                open={true}
                                onClick={this.handleClick.bind(this)}
                                title={name}
                            >
                                {
                                    milestone_chird.map((item, key) => {
                                        return (
                                            <View key={key}>
                                                <AtList hasBorder={false}>
                                                    <AtListItem
                                                        title={item.name}
                                                        arrow='right'
                                                    />
                                                </AtList>
                                            </View>
                                        )
                                    })
                                }
                            </AtAccordion>
                        </View>
                    )
                })}
            </View>
        )
    }
}

milestoneList.defaultProps = {

};