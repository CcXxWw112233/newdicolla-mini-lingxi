import Taro, { Component, hideToast } from '@tarojs/taro'
import { View, Text, Image, RichText } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import file_head_background from '../../asset/file/file_head_background.png'
import { connect } from '@tarojs/redux'
import SearchAndMenu from '../board/components/SearchAndMenu'
import { filterFileFormatType } from './../../utils/util';
import file_list_empty from '../../asset/file/file_list_empty.png'
import BoardFile from './components/boardFile/index.js'
import { getOrgIdByBoardId, setBoardIdStorage } from '../../utils/basicFunction'

@connect(({ file: { file_list = [], isShowBoardList } }) => ({
    file_list, isShowBoardList
}))
export default class File extends Component {
    config = {
        navigationBarTitleText: '文件',
    }
    componentDidMount() { }

    componentDidShow() {
        const org_id = '0'
        const board_id = ''
        const file_id = ''

        const is_reload_file_list = Taro.getStorageSync('isReloadFileList')
        if (is_reload_file_list === 'is_reload_file_list') {
            Taro.removeStorageSync('isReloadFileList')
        } else {
            this.getFilePage(org_id, board_id, file_id)
        }
    }

    componentDidHide() { }

    componentWillReceiveProps() { }

    componentWillUnmount() { }

    getFilePage = (org_id, board_id, file_id) => {

        const { dispatch } = this.props
        dispatch({
            type: 'file/getFilePage',
            payload: {
                _organization_id: org_id,
                board_id: board_id,
                folder_id: file_id,
                page_number: '',
                page_size: '',
            },
        })
    }

    onSelectType = ({ show_type }) => {
        this.setState({
            show_card_type_select: show_type,
            search_mask_show: show_type
        })
    }

    //显示关闭项目列表
    choiceBoard = (e) => {
        const { dispatch } = this.props
        dispatch({
            type: 'file/updateDatas',
            payload: {
                isShowBoardList: e,
            },
        })
    }

    goFileDetails = (value, fileName) => {

        Taro.setStorageSync('isReloadFileList', 'is_reload_file_list')

        const { file_resource_id, board_id } = value
        const { dispatch } = this.props
        setBoardIdStorage(board_id)
        const fileType = fileName.substr(fileName.lastIndexOf(".")).toLowerCase();

        const parameter = {
            board_id,
            ids: file_resource_id,
            _organization_id: getOrgIdByBoardId(board_id),
        }

        // 清除缓存文件
        Taro.getSavedFileList({
            success(res) {
                if (res.fileList.length > 0) {
                    Taro.removeSavedFile({
                        filePath: res.fileList[0].filePath,
                        complete(res) {
                            console.log('清除成', res)
                        }
                    })
                }
            }
        })

        dispatch({
            type: 'file/getDownloadUrl',
            payload: {
                parameter,
                fileType: fileType,
            },
        })
    }


    onSearch = (value, board_id, file_id) => {

        const { dispatch } = this.props

        // const queryConditions = []
        // if (board_id) {
        //     const board = { id: '1135447108158099461', value: board_id }
        //     queryConditions.push(board)
        //     if (file_id) {
        //         const file = { id: '1192646538984296448', value: 'file_id' }
        //         queryConditions.push(file)
        //     }
        // }

        dispatch({
            type: 'global/globalQuery',
            payload: {
                _organization_id: '0',
                page_number: '1',
                page_size: '5',
                // query_conditions: queryConditions,
                search_term: value, //关键字
                search_type: '6',  //文件 type = 6
            },
        })
    }

    render() {

        const { file_list, isShowBoardList, } = this.props

        return (
            <View className={indexStyles.index}>
                {
                    isShowBoardList === true ?
                        <BoardFile closeBoardList={() => this.choiceBoard(false)} selectedBoardFile={(org_id, board_id, file_id) => this.getFilePage(org_id, board_id, file_id)} />
                        : ''
                }

                <View style={{ position: 'sticky', top: 0 + 'px', left: 0 }}>
                    <SearchAndMenu onSelectType={this.onSelectType} search_mask_show={'0'} onSearch={(value) => this.onSearch(value)} isDisabled={false} />
                </View>

                <View className={indexStyles.head_background}>
                    <Image src={file_head_background} className={indexStyles.image_head_background} />

                    <View className={indexStyles.hear_function}>
                        <View className={indexStyles.folderPath} onClick={() => this.choiceBoard(true)}>
                            <Text className={`${globalStyle.global_iconfont} ${indexStyles.folder_Path_icon}`}>&#xe6c6;</Text>
                            <View>全部文件</View>
                        </View>
                    </View>
                </View>
                {
                    file_list.length !== 0 ? (<View className={indexStyles.grid_style}>
                        {file_list.map((value, key) => {
                            const { thumbnail_url } = value
                            const fileType = filterFileFormatType(value.file_name)
                            return (
                                <View className={indexStyles.lattice_style} onClick={this.goFileDetails.bind(this, value, value.file_name)} >
                                    {
                                        thumbnail_url ?
                                            (<Image mode='aspectFill' className={indexStyles.img_style} src={thumbnail_url}>
                                            </Image>)
                                            :
                                            (<View className={indexStyles.other_icon_style}>
                                                <RichText className={`${globalStyle.global_iconfont} ${indexStyles.folder_type_icon}`} nodes={fileType} />
                                                <View className={indexStyles.other_name_style}>{value.file_name}</View>
                                            </View>)
                                    }

                                </View>
                            )
                        })}
                    </View>
                    ) : (
                            <View className={indexStyles.contain1}>
                                <Image src={file_list_empty} className={indexStyles.file_list_empty} />
                            </View>
                        )
                }

            </View>
        )
    }
}

