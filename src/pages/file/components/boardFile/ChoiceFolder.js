
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './ChoiceFolder.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import { getOrgIdByBoardId, setBoardIdStorage, getOrgName } from '../../../../utils/basicFunction'
import { isApiResponseOk } from '../../../../utils/request'
import TreeFile from './TreeFile'
@connect(({
    file: {
        isShowChoiceFolder,
        folder_tree,
    },
    board: { v2_board_list, },
    my: { org_list },
}) => ({
    isShowChoiceFolder,
    folder_tree,
    v2_board_list,
    org_list,
}))
export default class ChoiceFolder extends Component {
    state = {
        current_selection_board_id: '',  //当前选中项目的id
        current_selection_board_status: false, //当前项目选中状态
        is_show_board_list: false, //是否显示项目列表
    }

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

    selectedBoardItem = (org_id, board_id, file_id, value) => {

        const { current_selection_board_id } = this.state
        if (board_id && current_selection_board_id === board_id) {
            this.setState({ current_selection_board_id: '' })
        } else {
            //记录选中的那一行的board_id
            this.setState({ current_selection_board_id: board_id })
            if (board_id) {
                this.getFolder(board_id, '')
            }
        }
    }

    //选择当前项目的根目录
    selectionBoardRootDirectory = (boardId, org_id) => {
        this.getFolder(boardId, org_id)
        this.setState({
            current_selection_board_status: !this.state.current_selection_board_status
        })
    }

    getFolder = (boardId, orgId) => {

        const { dispatch } = this.props
        Promise.resolve(
            dispatch({
                type: 'file/getFolder',
                payload: {
                    board_id: boardId,
                },
            })
        ).then(res => {
            const { folder_tree } = this.props
            const { folder_id } = folder_tree

            const boardFolderInfo = {
                org_id: orgId,
                board_id: boardId,
                folder_id: folder_id
            }
            dispatch({
                type: 'file/updateDatas',
                payload: {
                    selected_board_folder_info: boardFolderInfo,
                },
            })
        })
    }

    handleCancel = () => {
        this.hideChoiceFolder()
    }

    handleConfirm = () => {
        this.props.fileUpload()
        this.hideChoiceFolder()
    }

    hideChoiceFolder = () => {
        const { dispatch } = this.props
        dispatch({
            type: 'file/updateDatas',
            payload: {
                isShowChoiceFolder: false,
            },
        })

        this.hideBoardList()
    }

    choiceFolder = () => {
        this.setState({
            is_show_board_list: !this.state.is_show_board_list
        })
    }

    backHideBoardList = () => {
        this.hideBoardList()
    }

    hideBoardList = () => {
        this.setState({
            is_show_board_list: false
        })
    }

    render() {

        const { folder_tree, v2_board_list, org_list, choiceImageThumbnail, } = this.props
        const { child_data = [] } = folder_tree
        const { current_selection_board_id, current_selection_board_status, is_show_board_list } = this.state

        return (

            <View className={indexStyles.choice_folder_modal_mask} >
                <View className={indexStyles.choice_folder_modal_view_style}>

                    {is_show_board_list === false ? (
                        <View className={indexStyles.modal_content_style}>
                            <View className={indexStyles.modal_content_top_style}>
                                <View className={indexStyles.modal_tips_text_style}>上传到:</View>
                            </View>

                            <View className={indexStyles.modal_content_center_style}>
                                <View className={indexStyles.choice_folder_button_style} onClick={this.choiceFolder}>选择文件夹</View>
                                <View className={indexStyles.thumbnail_view_style}>
                                    <Image mode='aspectFill' className={indexStyles.choice_image_thumbnail_style} src={choiceImageThumbnail}></Image>
                                </View>
                            </View>
                        </View>
                    ) : (
                            <View className={indexStyles.choice_board_view_style}>
                                <View className={indexStyles.modal_content_top_style}>
                                    <View className={indexStyles.modal_tips_text_style} onClick={this.backHideBoardList}>{'< '}返回</View>
                                    <View className={indexStyles.folder_name_style}>选择文件夹</View>
                                </View>
                                <ScrollView
                                    scrollY
                                    scrollWithAnimation
                                    className={indexStyles.board_list_view_style}>
                                    {v2_board_list && v2_board_list.map(item => {
                                        const org_id = getOrgIdByBoardId(item.board_id)
                                        return (
                                            <View className={indexStyles.board_item_style} >

                                                <View className={indexStyles.board_item_cell_style}>
                                                    <View className={indexStyles.choice_button_style} onClick={() => this.selectionBoardRootDirectory(item.board_id, org_id)}>

                                                        {
                                                            current_selection_board_status === true ? (
                                                                <Text className={`${globalStyle.global_iconfont} ${indexStyles.choice_button_icon_style}`}>&#xe844;</Text>
                                                            ) : (
                                                                    <Text className={`${globalStyle.global_iconfont} ${indexStyles.choice_button_icon_style}`}>&#xe6df;</Text>
                                                                )
                                                        }

                                                    </View>

                                                    <View className={indexStyles.board_item_cell_content_style} onClick={() => this.selectedBoardItem('0', item.board_id, '', item)}>

                                                        <View className={indexStyles.board_folder_view_style}>
                                                            <Text className={`${globalStyle.global_iconfont} ${indexStyles.board_folder_icon_style}`}>&#xe662;</Text>
                                                        </View>

                                                        <View className={indexStyles.board_item_cell_content_top_style}>
                                                            <View className={indexStyles.board_item_name}>{item.board_name}</View>

                                                            {org_list && org_list.length > 0 ? (<View className={indexStyles.org_name_style}>
                                                                {'#'}{getOrgName({ org_id, org_list })}
                                                            </View>) : ''}
                                                        </View>

                                                        <View className={indexStyles.board_item_open_view_style}>
                                                            <Text className={`${globalStyle.global_iconfont} ${indexStyles.board_item_open_icon_style}`}>&#xe642;</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                {child_data && item.board_id === current_selection_board_id ?
                                                    <View className={indexStyles.folder_tree_view}>
                                                        <TreeFile folderTree={child_data} boardId={item.board_id} orgId={item.org_id} />
                                                    </View> : ''
                                                }
                                            </View>
                                        )
                                    })
                                    }
                                </ScrollView>
                            </View>
                        )
                    }



                    <View className={indexStyles.modal_botton_style}>
                        <View className={indexStyles.cancel_button_style} onClick={this.handleCancel}>取消</View>
                        <View className={indexStyles.confirm_button_style} onClick={this.handleConfirm}>上传</View>
                    </View>

                </View>

            </View>
        )
    }
}

ChoiceFolder.defaultProps = {
    choiceImageThumbnail: '',  //从相册中选中图片传过来当做略缩图
}
