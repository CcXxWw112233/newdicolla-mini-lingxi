
import Taro, { Component, getApp } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './ChoiceFolder.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import { getOrgIdByBoardId, getOrgName } from '../../../../utils/basicFunction'
import TreeFile from './TreeFile'

@connect(({
    file: {
        isShowChoiceFolder,
        folder_tree,
        upload_folder_name,
        choice_board_folder_id,
        choice_board_id,
        current_selection_board_id,
    },
    board: { v2_board_list, },
    my: { org_list },
}) => ({
    isShowChoiceFolder,
    folder_tree,
    v2_board_list,
    org_list,
    upload_folder_name,
    choice_board_folder_id,
    choice_board_id,
    current_selection_board_id,
}))
export default class ChoiceFolder extends Component {
    state = {
        is_show_board_list: false, //是否显示项目列表
    }

    componentDidMount() {
        this.loadBoardList()
    }

    loadBoardList = () => {

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
        const { dispatch, current_selection_board_id } = this.props
        const { board_name } = value
        dispatch({
            type: 'file/updateDatas',
            payload: {
                choice_board_folder_id: '',
            },
        })
        if (board_id && current_selection_board_id === board_id) {
            dispatch({
                type: 'file/updateDatas',
                payload: {
                    current_selection_board_id: '',
                    current_board_open: false,
                },
            })
        } else {
            //记录选中的那一行的board_id
            if (board_id) {
                this.getFolder(board_id, '', '')
            }
            dispatch({
                type: 'file/updateDatas',
                payload: {
                    upload_folder_name: board_name,
                    current_selection_board_id: board_id,
                    current_board_open: true,
                },
            })
        }
    }


    //选择当前项目的根目录
    selectionBoardRootDirectory = (value, org_id) => {
        const { board_id, board_name } = value
        const { dispatch, choice_board_id } = this.props
        dispatch({
            type: 'file/updateDatas',
            payload: {
                choice_board_folder_id: '',
            },
        })
        if (board_id && choice_board_id === board_id) {
            dispatch({
                type: 'file/updateDatas',
                payload: {
                    choice_board_id: '',
                    current_selection_board_id: ''
                },
            })
        } else {
            //获取根目录
            this.getFolder(board_id, org_id, board_name)
            //记录选中的那一行的board_id
            dispatch({
                type: 'file/updateDatas',
                payload: {
                    choice_board_id: board_id,
                    upload_folder_name: board_name,
                    current_selection_board_id: board_id,
                },
            })
        }
    }

    getFolder = (boardId, orgId, board_name) => {

        const { dispatch } = this.props
        Promise.resolve(
            dispatch({
                type: 'file/getFolder',
                payload: {
                    board_id: boardId,
                },
            })
        ).then(res => {

            if (board_name) {
                const { folder_tree } = this.props
                const { folder_id } = folder_tree

                const boardFolderInfo = {
                    org_id: orgId,
                    board_id: boardId,
                    folder_id: folder_id,
                    current_folder_name: board_name,
                }

                dispatch({
                    type: 'file/updateDatas',
                    payload: {
                        selected_board_folder_info: boardFolderInfo,
                    },
                })
            }
        })
    }

    handleCancel = () => {
        this.hideChoiceFolder()
        this.resetCurrentSelection()
    }

    handleConfirm = () => {
        this.props.fileUpload()
        this.hideChoiceFolder()
        // this.resetCurrentSelection()
    }

    //下次进入选中状态重置
    resetCurrentSelection = () => {
        const { dispatch } = this.props
        dispatch({
            type: 'file/updateDatas',
            payload: {
                choice_board_folder_id: '',
                choice_board_id: '',
                selected_board_folder_info: {},
                upload_folder_name: '选择文件夹',
                current_board_open: false,
            },
        })
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

        this.loadBoardList()
    }

    backHideBoardList = () => {

        this.hideBoardList()
    }

    hideBoardList = () => {
        this.setState({
            is_show_board_list: false
        })
    }

    filterSelectBoard = () => {
        const { v2_board_list = [], current_selection_board_id, org_list } = this.props

        //根据org_id把org_list合并到v2_board_list
        org_list.forEach(function (o, d) {
            for (var k in o) {
                v2_board_list.forEach(function (t) {
                    for (var key in t) {
                        if (t.org_id == o.id) {
                            t[k] = o[k];
                        }

                    }
                })
            }
        });

        // 根据org的payment_status过滤未付费的项目
        const filter_board_list = v2_board_list.filter((item, index) => {
            if (item && item.payment_status === '1') {
                return item
            }
        })


        let new_v2_board_list = [...filter_board_list]

        if (current_selection_board_id) {
            new_v2_board_list = new_v2_board_list.filter(item => item.board_id == current_selection_board_id)
        }

        return new_v2_board_list
    }

    render() {

        const { folder_tree, v2_board_list, org_list, choiceImageThumbnail, upload_folder_name, choice_board_folder_id, choice_board_id, current_selection_board_id, current_board_open, uploadImageAddress, } = this.props
        const { child_data = [], } = folder_tree
        const { is_show_board_list, } = this.state

        return (

            <View className={indexStyles.choice_folder_modal_mask} >
                <View className={indexStyles.choice_folder_modal_view_style}>

                    {is_show_board_list === false ? (
                        <View className={indexStyles.modal_content_style}>
                            <View className={indexStyles.modal_content_top_style}>
                                <View className={indexStyles.modal_tips_text_style}>上传到:</View>
                            </View>

                            <View className={indexStyles.modal_content_center_style}>
                                <View className={indexStyles.choice_folder_button_style} onClick={this.choiceFolder}>{upload_folder_name}</View>
                                <View className={indexStyles.thumbnail_view_style}>
                                    <Image mode='aspectFill' className={indexStyles.choice_image_thumbnail_style} src={choiceImageThumbnail}></Image>
                                </View>
                                <View className={indexStyles.image_address_style}>{uploadImageAddress}</View>
                            </View>
                        </View>
                    ) : (
                            <View className={indexStyles.choice_board_view_style}>
                                <View className={indexStyles.modal_content_top_style}>
                                    <View className={indexStyles.modal_tips_text_style} onClick={this.backHideBoardList}>{'< '}返回</View>
                                    <View className={indexStyles.folder_name_style}>{upload_folder_name}</View>
                                </View>
                                <ScrollView
                                    scrollY
                                    scrollWithAnimation
                                    className={indexStyles.board_list_view_style}>
                                    {this.filterSelectBoard() && this.filterSelectBoard().map(item => {
                                        const org_id = item.org_id
                                        return (
                                            <View key={item.board_id} className={indexStyles.board_item_style} >

                                                <View className={indexStyles.board_item_cell_style}>
                                                    <View className={indexStyles.choice_button_style} onClick={() => this.selectionBoardRootDirectory(item, org_id)}>
                                                        {
                                                            item.board_id === choice_board_id ? (
                                                                <Text className={`${globalStyle.global_iconfont} ${indexStyles.choice_button_icon_style}`}>&#xe844;</Text>
                                                            ) : (
                                                                    <Text className={`${globalStyle.global_iconfont} ${indexStyles.un_choice_button_icon_style}`}>&#xe6df;</Text>
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
                                                            {
                                                                item.board_id === current_selection_board_id && current_board_open === true ? (
                                                                    <Text className={`${globalStyle.global_iconfont} ${indexStyles.board_item_open_icon_style}`}>&#xe653;</Text>
                                                                ) : (
                                                                        <Text className={`${globalStyle.global_iconfont} ${indexStyles.board_item_open_icon_style}`}>&#xe642;</Text>
                                                                    )
                                                            }

                                                        </View>
                                                    </View>
                                                </View>
                                                {child_data && item.board_id === current_selection_board_id ?
                                                    <View className={indexStyles.folder_tree_view}>
                                                        <TreeFile folderTree={child_data} boardId={item.board_id} orgId={item.org_id} boardName={item.board_name} />
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
                        {
                            choice_board_id != '' || choice_board_folder_id != '' ? (
                                <View className={indexStyles.confirm_button_style} onClick={this.handleConfirm}>上传</View>
                            ) : (
                                    <View className={indexStyles.un_confirm_button_style}>上传</View>
                                )
                        }
                    </View>
                </View>
            </View>
        )
    }
}

ChoiceFolder.defaultProps = {
    choiceImageThumbnail: '',  //从相册中选中图片传过来当做略缩图
}
