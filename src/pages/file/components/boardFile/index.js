import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import im from '../../../../models/im'
import TreeFile from './TreeFile'

@connect(({ file: { folder_tree }, board: { v2_board_list, } }) => ({
    folder_tree, v2_board_list
}))
export default class BoardFile extends Component {

    componentDidMount() {
        const { dispatch } = this.props
        dispatch({
            type: 'board/v2BoardList',
            payload: {
                _organization_id: '0',
                contain_type: '0',
            },
        })
    }

    wholeFile = () => {

    }

    selectedBoardItem = (boardId) => {
        this.props.selectedBoardFile(boardId)

        const { dispatch } = this.props
        dispatch({
            type: 'file/getFolder',
            payload: {
                board_id: boardId,
            },
        })
    }

    closeBoardList = () => {
        this.props.closeBoardList()
    }

    selectionFile = (folderId) => {
        this.props.selectionFile(folderId)
    }

    render() {

        const SystemInfo = Taro.getSystemInfoSync()
        const screen_Height = SystemInfo.screenHeight
        const statusBar_Height = SystemInfo.statusBarHeight
        const navBar_Height = SystemInfo.platform == 'ios' ? 44 : 48

        const { folder_tree, v2_board_list } = this.props

        return (
            <View className={indexStyles.choice_board_file_style}>

                <View className={indexStyles.whole_file_style}>
                    <View className={indexStyles.whole_file_hear_style} onClick={() => this.selectedBoardItem('')}>
                        <Text className={`${globalStyle.global_iconfont} ${indexStyles.folder_Path_icon}`}>&#xe662;</Text>
                        <View style={{ marginLeft: 10 + 'px', fontSize: 18 + 'px' }}>全部文件</View>
                    </View>
                </View>

                <View >
                    {v2_board_list && v2_board_list.map(item => (

                        <View className={indexStyles.board_item_style} onClick={() => this.selectedBoardItem(item.board_id)}>

                            <View className={indexStyles.board_item_cell_style}>
                                <Text className={`${globalStyle.global_iconfont} ${indexStyles.board_item_icon}`}>&#xe8ed;</Text>
                                <View className={indexStyles.board_item_name}>{item.board_name}</View>
                            </View>

                            {folder_tree ?
                                <View className={indexStyles.folder_tree_view}>
                                    <TreeFile folderTree={folder_tree} selectionFile={(folderId) => this.selectionFile(folderId)} boardId={item.board_id} />
                                </View> : ''
                            }
                        </View>
                    ))
                    }
                </View>

                <View className={indexStyles.close_view_style}>
                    <View className={indexStyles.close_button_style} onClick={this.closeBoardList}>
                        <Text className={`${globalStyle.global_iconfont} ${indexStyles.close_button_icon_style}`}>&#xe7fc;</Text>
                    </View>
                </View >

            </View >
        )
    }
}

BoardFile.defaultProps = {

}
