import Taro, { Component, hideToast, pageScrollTo } from '@tarojs/taro'
import { View, Text, Image, RichText } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import SearchAndMenu from '../board/components/SearchAndMenu'
import { filterFileFormatType } from './../../utils/util';
import file_list_empty from '../../asset/file/file_list_empty.png'
import BoardFile from './components/boardFile/index.js'
import { getOrgIdByBoardId, setBoardIdStorage, setRequestHeaderBaseInfo } from '../../utils/basicFunction'
import { request, } from "../../utils/request";


@connect(({ file: { file_list = [], isShowBoardList, header_folder_name, is_show_album_camera, } }) => ({
    file_list, isShowBoardList, header_folder_name, is_show_album_camera,
}))
export default class File extends Component {
    config = {
        navigationBarTitleText: '文件',
    }
    state = {
        is_tips_longpress_file: false,  //是否显示长按文件前往圈子的提示
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

        // const { dispatch } = this.props
        // dispatch({
        //     type: 'file/getFilePage',
        //     payload: {
        //         _organization_id: org_id,
        //         board_id: board_id,
        //         folder_id: file_id,
        //         page_number: '',
        //         page_size: '',
        //     },
        // })

        const { dispatch } = this.props
        Promise.resolve(
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
        ).then(res => {
            Taro.pageScrollTo({
                scrollTop: 100000,
                duration: 100,
            })
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
                            //console.log('清除成功', res)
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

        //是否显示长按文件前往圈子的提示
        const tips_longpress_file = Taro.getStorageSync('tips_longpress_file')
        if (!tips_longpress_file) {
            Taro.setStorageSync('tips_longpress_file', 'tips_longpress_file')
            this.setState({
                is_tips_longpress_file: true
            })
        }
    }


    onSearch = (value, board_id, file_id) => {
        const { dispatch } = this.props
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

        dispatch({
            type: 'file/updateDatas',
            payload: {
                header_folder_name: '全部文件',
            },
        })
    }

    //长按进入圈子
    longPress = (board_id) => {
        Taro.navigateTo({
            url: `/pages/chat/index`
        })
    }

    closeTips = () => {
        this.setState({
            is_tips_longpress_file: false
        })
    }

    // 拍照/选择图片上传
    fileUploadAlbumCamera = () => {
        let that = this;
        Taro.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success(res) {
                let tempFilePaths = res.tempFilePaths; // 返回选定照片的本地路径列表 
                that.fileUpload(tempFilePaths);
            }
        })
    }

    //上传到后端
    fileUpload = (path) => {
        Taro.showToast({ icon: "loading", title: "正在上传..." });
        //开发者服务器访问接口，微信服务器通过这个接口上传文件到开发者服务器
        Taro.uploadFile({
            url: 'https://lingxi.di-an.com/api/projects/file/upload', //后端接口
            filePath: path[0],
            name: 'file',
            header: {
                "Content-Type": "multipart/form-data"
            },
            header: { ...Headers, ...setRequestHeaderBaseInfo({ data, headers: Headers }) },
            formData: { //上传POST参数信息
                board_id: '1200340152833150976',
                folder_id: '1200340152858316802',
                file: path,
            },
            success(res) {
                console.log(res, '上传文件res');
                if (res.statusCode != 200) {
                    Taro.showModal({ title: '提示', content: '上传失败', showCancel: false });
                    return;
                } else {
                    console.log(res, "上传成功！ 可对返回的值进行操作，比如：存入imgData；");
                }
            },
            fail(error) {
                Taro.showModal({ title: '提示', content: '上传失败', showCancel: false });
                console.log('上传错误:', error)
            },
            complete() {
                Taro.hideToast();
            }
        })
        // uploadTask.onProgressUpdate((res) => {
        //     console.log('上传进度', res.progress)
        //     console.log('已经上传的数据长度', res.totalBytesSent)
        //     console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
        // })

        // const { dispatch } = this.props
        // dispatch({
        //     type: 'file/uploadFile',
        //     payload: {
        //         board_id: '1196728085744062464',
        //         folder_id: '1196728085777616896',
        //         file: tempFilePaths,
        //     },
        // })
    }

    render() {

        const { file_list, isShowBoardList, header_folder_name, is_show_album_camera, } = this.props
        const { is_tips_longpress_file, } = this.state

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
                    <View className={indexStyles.hear_function}>
                        <View className={indexStyles.folderPath} onClick={() => this.choiceBoard(true)}>
                            <Text className={`${globalStyle.global_iconfont} ${indexStyles.folder_Path_icon}`}>&#xe6c6;</Text>
                            <Text className={indexStyles.header_folder_name_style}>{header_folder_name}</Text>
                        </View>

                        {
                            is_show_album_camera === true ? (
                                <View className={indexStyles.files_album_camera_view_style}>
                                    <View className={indexStyles.files_album_camera_button_style} onClick={this.fileUploadAlbumCamera}><Text className={`${globalStyle.global_iconfont} ${indexStyles.files_album_camera_icon_style}`}>&#xe664;</Text></View>
                                    <View className={indexStyles.files_album_camera_button_style} onClick={this.fileUploadAlbumCamera}><Text className={`${globalStyle.global_iconfont} ${indexStyles.files_album_camera_icon_style}`}>&#xe663;</Text></View>
                                </View>
                            ) : ''
                        }
                    </View>
                </View>
                {
                    file_list.length !== 0 ? (<View className={indexStyles.grid_style}>
                        {file_list.map((value, key) => {
                            const { thumbnail_url } = value
                            const fileType = filterFileFormatType(value.file_name)
                            return (
                                <View className={indexStyles.lattice_style} onClick={this.goFileDetails.bind(this, value, value.file_name)} onLongPress={this.longPress.bind(this, value.board_id)}>
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
                {
                    is_tips_longpress_file === true ? (<View className={indexStyles.tips_view_style}>
                        <View className={indexStyles.tips_style}>
                            <View className={indexStyles.tips_cell_style}>
                                <Text className={`${globalStyle.global_iconfont} ${indexStyles.tips_icon_style}`}>&#xe848;</Text>
                                <View className={indexStyles.tips_text_style}>长按文件可以进入圈子交流</View>
                                <View onClick={this.closeTips}>
                                    <Text className={`${globalStyle.global_iconfont} ${indexStyles.tips_close_style}`}>&#xe7fc;</Text>
                                </View>
                            </View>
                        </View>
                    </View>) : ''
                }
            </View>
        )
    }
}

