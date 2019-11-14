import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './TreeFile.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'

@connect(({ }) => ({}))
export default class Tree extends Component {

    render() {
        const { arr, boardId } = this.props

        return (
            <View>
                {arr && arr.map(item => (
                    <View class={indexStyles.li_item} data-itemid={item.folder_id}>
                        {item.folder_name}
                    </View>
                ))
                }
            </View>
        )
    }
}

Tree.defaultProps = {

}
