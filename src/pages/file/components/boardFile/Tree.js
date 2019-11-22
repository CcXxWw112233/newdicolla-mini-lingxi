import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './Tree.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'

@connect(({ file }) => ({ file }))
export default class Tree extends Component {

    selectionTreeFile = (folder_id, folder_name) => {

        const { dispatch, boardId, orgId } = this.props
        dispatch({
            type: 'file/getFilePage',
            payload: {
                _organization_id: orgId,
                board_id: boardId,
                folder_id: folder_id,
                page_number: '',
                page_size: '',
            },
        })

        dispatch({
            type: 'file/updateDatas',
            payload: {
                isShowBoardList: false,
                header_folder_name: folder_name
            },
        })
    }

    render() {
        const { arr } = this.props

        return (
            <View>
                {arr && arr.map(item => {
                    return (
                        <View class={indexStyles.li_item} data-itemid={item.folder_id} onClick={() => this.selectionTreeFile(item.folder_id, item.folder_name)}>
                            {/* <Text className={`${globalStyle.global_iconfont} ${indexStyles.open_item_icon}`}>&#xe8ed;</Text> */}
                            <Text className={`${globalStyle.global_iconfont} ${indexStyles.folder_Path_icon}`}>&#xe662;</Text>
                            <View className={indexStyles.file_item_name}>{item.folder_name}</View>
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
