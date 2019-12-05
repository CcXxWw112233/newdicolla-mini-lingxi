import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './Tree.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'

@connect(({ file: { selected_board_folder_id, }, }) => ({ selected_board_folder_id, }))
export default class Tree extends Component {

    selectionTreeFile = (item) => {

        const { dispatch, boardId, orgId, selected_board_folder_id } = this.props
        const { folder_id, folder_name } = item

        const boardFolderInfo = {
            org_id: orgId,
            board_id: boardId,
            folder_id: folder_id,
            current_folder_name: folder_name,
        }

        if (folder_id && selected_board_folder_id === folder_id) {
            dispatch({
                type: 'file/updateDatas',
                payload: {
                    selected_board_folder_id: '',
                    back_click_name: true,
                },
            })
        } else {
            //记录选中的那一行的folder_id, 
            //记录被选中文件夹信息, 
            //更新上方title显示名称,
            //更新项目更目录的选中状态
            //更新右上角显示文案
            dispatch({
                type: 'file/updateDatas',
                payload: {
                    selected_board_folder_id: folder_id,
                    selected_board_folder_info: boardFolderInfo,
                    upload_folder_name: folder_name,
                    back_click_name: false,
                },
            })
        }

        dispatch({
            type: 'file/updateDatas',
            payload: {
                choice_board_id: '',
            },
        })
    }

    render() {
        const { arr, selected_board_folder_id } = this.props

        return (
            <View>
                {arr && arr.map(item => {
                    return (
                        <View class={indexStyles.folder_item_cell_style} data-itemid={item.folder_id} onClick={() => this.selectionTreeFile(item)}>
                            <View className={indexStyles.choice_folder_button_style}>
                                {
                                    selected_board_folder_id === item.folder_id ? (
                                        <Text className={`${globalStyle.global_iconfont} ${indexStyles.choice_folder_button_icon_style}`}>&#xe844;</Text>
                                    ) : (
                                            <Text className={`${globalStyle.global_iconfont} ${indexStyles.choice_folder_button_icon_style}`}>&#xe6df;</Text>
                                        )
                                }
                            </View>

                            <View className={indexStyles.choice_folder_view_style}>
                                <Text className={`${globalStyle.global_iconfont} ${indexStyles.choice_folder_icon_style}`}>&#xe662;</Text>
                            </View>

                            <View className={indexStyles.folder_item_name_cell}>{item.folder_name}</View>

                        </View>
                    )
                })
                }
            </View>
        )
    }
}

Tree.defaultProps = {

}
