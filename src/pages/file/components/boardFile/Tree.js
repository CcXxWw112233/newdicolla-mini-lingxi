import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './TreeFile.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'

@connect(({ }) => ({}))
export default class Tree extends Component {

    selectionFile = (folderId) => {
        console.log(folderId, '是是是');

        this.props.selectionFile(folderId)
    }

    render() {
        const { arr } = this.props
        return (
            <View>
                {arr.map(item => (
                    <View>
                        <View>{item.value}</View>
                        <View class={indexStyles.ul}>
                            <View class={indexStyles.li_item} onClick={() => this.selectionFile(item.folder_id)} data-itemid={item.folder_id}>
                                <Text>{item.folder_name}</Text>
                            </View>
                        </View>
                    </View>
                ))
                }
            </View>
        )
    }
}

Tree.defaultProps = {

}
