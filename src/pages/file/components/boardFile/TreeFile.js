import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './TreeFile.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import Tree from './Tree'

@connect(({ }) => ({}))
export default class TreeFile extends Component {

    jsonToArray(nodes, arr = []) {
        var r = arr;
        if (nodes && nodes.length) {
            for (let i = 0; i < nodes.length; i++) {
                let item = nodes[i];
                r.push(item)
                if (item && item.child_data) {
                    this.jsonToArray(item.child_data, r)
                }
            }
        }
        return r;
    }

    render() {
        const { folderTree, boardId, orgId, boardName } = this.props

        const arr = this.jsonToArray(folderTree)

        return (
            <View>
                <Tree arr={arr} boardId={boardId} orgId={orgId} boardName={boardName} />
            </View>
        )
    }
}

TreeFile.defaultProps = {

}
