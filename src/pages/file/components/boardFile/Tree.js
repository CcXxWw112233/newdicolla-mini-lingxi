import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './Tree.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'

@connect(({ file }) => ({ file }))
export default class Tree extends Component {

    selectionTreeFile = (item) => {

        const { dispatch, boardId, orgId } = this.props
        const { folder_id } = item

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
    }

    render() {
        const { arr } = this.props

        return (
            <View>
                {arr && arr.map(item => {
                    return (
                        <View class={indexStyles.folder_item_cell_style} data-itemid={item.folder_id} onClick={() => this.selectionTreeFile(item)}>

                            <View className={indexStyles.choice_folder_button_style}>
                                <Text className={`${globalStyle.global_iconfont} ${indexStyles.choice_folder_button_icon_style}`}>&#xe6df;</Text>
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
