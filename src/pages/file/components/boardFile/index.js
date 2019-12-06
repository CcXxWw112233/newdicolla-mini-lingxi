import Taro, { Component } from '@tarojs/taro'
import { View, Text, } from '@tarojs/components'
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
        all_file_text: '全部文件'
    }

    componentDidMount() {
        const { dispatch } = this.props

        Promise.resolve(
            // 获取组织列表
            dispatch({
                type: 'my/getOrgList',
                payload: {}
            })
        ).then(res => {
            //获取项目列表
            dispatch({
                type: 'board/v2BoardList',
                payload: {
                    _organization_id: '0',
                    contain_type: '0',
                },
            })
        })
    }

    selectedBoardItem = (org_id, board_id, file_id, value) => {
        const { dispatch } = this.props
        this.props.selectedBoardFile(org_id, board_id, file_id)
        const { all_file_text } = this.state
        const titleText = value === all_file_text ? all_file_text : value.board_name
        dispatch({
            type: 'file/updateDatas',
            payload: {
                header_folder_name: titleText,
                isShowBoardList: false,
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

        const { all_file_text } = this.state
        const { folder_tree, v2_board_list, org_list } = this.props

        return (
            <View className={indexStyles.choice_board_file_style} >
                <View className={indexStyles.whole_file_style}>
                    <View className={indexStyles.whole_file_hear_style} onClick={() => this.selectedBoardItem('0', '', '', all_file_text)}>
                        <Text className={`${globalStyle.global_iconfont} ${indexStyles.folder_Path_icon}`}>&#xe662;</Text>
                        <View style={{ marginLeft: 10 + 'px', fontSize: 18 + 'px' }}>{all_file_text}</View>
                    </View>
                </View>

                {v2_board_list && v2_board_list.map(item => {
                    const org_id = item.org_id
                    return (
                        <View className={indexStyles.board_item_style} hoverClass={indexStyles.board_item_hover_style} onClick={() => this.selectedBoardItem('0', item.board_id, '', item)}>

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
                    )
                })
                }

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
