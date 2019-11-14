import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './TreeFile.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import Tree from './Tree'

@connect(({ }) => ({}))
export default class TreeFile extends Component {

    state = {
        open: false,     //是否展开
        isBranch: false, //是否有子级
    }

    selectionFile = (folderId) => {
        this.props.selectionFile(folderId)
    }

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

    renderTree = (item) => {

        const arr = this.jsonToArray([item])
        return (
            <Tree arr={arr} />
        )
    }

    render() {
        const { folderTree } = this.props
        const arr = this.jsonToArray(folderTree)
        return (
            <View>
                <Tree arr={arr} selectionFile={(folderId) => this.selectionFile(folderId)} />
            </View>
        )
    }
}

TreeFile.defaultProps = {

}
