import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import im from '../../../../models/im'
import TreeFile from './TreeFile'
import { getOrgIdByBoardId, setBoardIdStorage, getOrgName } from '../../../../utils/basicFunction'

@connect(({ file: { folder_tree }, board: { v2_board_list, }, my: { org_list } }) => ({
    folder_tree, v2_board_list, org_list
}))
export default class BoardFile extends Component {

    state = {
        height: ''
    }

    setMaskHeight = () => {
        let systemInfo = wx.getSystemInfoSync()
        // px转换到rpx的比例
        let pxToRpxScale = 750 / systemInfo.windowWidth;
        // 状态栏的高度
        let ktxStatusHeight = systemInfo.statusBarHeight * pxToRpxScale
        // 导航栏的高度
        let navigationHeight = 44 * pxToRpxScale
        // window的宽度
        let ktxWindowWidth = systemInfo.windowWidth * pxToRpxScale
        // window的高度
        let ktxWindowHeight = systemInfo.windowHeight * pxToRpxScale
        // 屏幕的高度
        let ktxScreentHeight = systemInfo.screenHeight * pxToRpxScale
        // 底部tabBar的高度
        let tabBarHeight = ktxScreentHeight - ktxStatusHeight - navigationHeight - ktxWindowHeight

    }

    componentDidMount() {
        // const systemInfo = Taro.getSystemInfoSync()
        // const { windowHeight } = systemInfo
        // this.setState({
        //     height: windowHeight
        // })
        // console.log('sssss', systemInfo)
        const { dispatch } = this.props
        dispatch({
            type: 'board/v2BoardList',
            payload: {
                _organization_id: '0',
                contain_type: '0',
            },
        })
    }

    componentWillUnmount() {
        Taro.removeStorageSync('file_item_board_id')
    }

    selectedBoardItem = (org_id, board_id, file_id) => {

        //选中的那一行的board_id
        Taro.setStorageSync('file_item_board_id', board_id)

        this.props.selectedBoardFile(org_id, board_id, file_id)

        if (board_id) {
            const { dispatch } = this.props
            dispatch({
                type: 'file/getFolder',
                payload: {
                    board_id: board_id,
                },
            })
        }
    }

    closeBoardList = () => {
        this.props.closeBoardList()
    }

    selectionFile = (folderId) => {
        this.props.selectionFile(folderId)
    }

    render() {

        const { folder_tree, v2_board_list, org_list } = this.props
        const file_item_board_id = Taro.getStorageSync('file_item_board_id')
        const { height } = this.state
        return (
            <View className={indexStyles.choice_board_file_style} >

                <View className={indexStyles.whole_file_style}>
                    <View className={indexStyles.whole_file_hear_style} onClick={() => this.selectedBoardItem('0', '', '')}>
                        <Text className={`${globalStyle.global_iconfont} ${indexStyles.folder_Path_icon}`}>&#xe662;</Text>
                        <View style={{ marginLeft: 10 + 'px', fontSize: 18 + 'px' }}>全部文件</View>
                    </View>
                </View>

                <ScrollView>
                    <View >
                        {v2_board_list && v2_board_list.map(item => {
                            const org_id = getOrgIdByBoardId(item.board_id)
                            return (
                                <View className={indexStyles.tree_style}>
                                    <View className={indexStyles.board_item_style} onClick={() => this.selectedBoardItem('0', item.board_id, '')}>

                                        <View className={indexStyles.board_item_cell_style}>
                                            {
                                                file_item_board_id === item.board_id ? (
                                                    <Text className={`${globalStyle.global_iconfont} ${indexStyles.board_item_icon}`}>&#xe8ec;</Text>
                                                ) : (
                                                        <Text className={`${globalStyle.global_iconfont} ${indexStyles.board_item_icon}`}>&#xe8ed;</Text>
                                                    )
                                            }
                                            <View className={indexStyles.board_item_name}>{item.board_name}</View>
                                            {org_list && org_list.length > 0 ? (<View className={indexStyles.org_name_style}>
                                                {'#'}{getOrgName({ org_id, org_list })}
                                            </View>) : ''}
                                        </View>
                                    </View>

                                    {folder_tree && item.board_id === file_item_board_id ?
                                        <View className={indexStyles.folder_tree_view}>
                                            <TreeFile folderTree={folder_tree} boardId={item.board_id} orgId={item.org_id} />
                                        </View> : ''
                                    }
                                </View>
                            )
                        })
                        }
                    </View>
                </ScrollView>

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
