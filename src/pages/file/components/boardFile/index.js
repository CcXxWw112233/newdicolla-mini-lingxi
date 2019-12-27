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

        Promise.resolve(
            dispatch({
                type: 'file/updateDatas',
                payload: {
                    header_folder_name: titleText,
                    isShowBoardList: false,
                    current_selection_board_id: board_id,
                    current_board_open: true,

                    //切换了项目, 重置弹框里面之前重则的文件夹信息
                    choice_board_folder_id: '',
                    choice_board_id: '',
                    selected_board_folder_info: {},
                    upload_folder_name: '选择文件夹',
                },
            })
        ).then(res => {
            //当选择了项目, 也把上传文件弹框的当个项目的树形也调出来
            //全部文件没有树形, 也不需要调
            if (board_id) {
                dispatch({
                    type: 'file/getFolder',
                    payload: {
                        board_id: board_id,
                    },
                })
            }
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
        const { v2_board_list, org_list } = this.props

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

        return (
            <View className={indexStyles.choice_board_file_style} >
                <View className={indexStyles.whole_file_style}>
                    <View className={indexStyles.whole_file_hear_style} onClick={() => this.selectedBoardItem('0', '', '', all_file_text)}>
                        <Text className={`${globalStyle.global_iconfont} ${indexStyles.folder_Path_icon}`}>&#xe662;</Text>
                        <View style={{ marginLeft: 10 + 'px', fontSize: 18 + 'px' }}>{all_file_text}</View>
                    </View>
                </View>

                {filter_board_list && filter_board_list.map(item => {
                    const org_id = item.org_id
                    return (
                        <View className={indexStyles.board_item_style} hoverClass={indexStyles.board_item_hover_style} onClick={() => this.selectedBoardItem(org_id, item.board_id, '', item)}>

                            <View className={indexStyles.board_item_cell_style}>

                                <Text className={`${globalStyle.global_iconfont} ${indexStyles.board_item_icon}`}>&#xe662;</Text>

                                <View className={indexStyles.board_item_name}>{item.board_name}</View>
                                {org_list && org_list.length > 0 ? (<View className={indexStyles.org_name_style}>
                                    {'#'} {item.name}
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
