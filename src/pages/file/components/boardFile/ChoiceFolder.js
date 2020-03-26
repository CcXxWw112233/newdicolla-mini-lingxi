
import Taro, { Component, getApp } from '@tarojs/taro'
import { View, Text ,Image} from '@tarojs/components'
import indexStyles from './ChoiceFolder.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import { getOrgIdByBoardId, getOrgName } from '../../../../utils/basicFunction'
import TreeFile from './TreeFile'
import EXIF from 'exif-js'  //第三方库获取图片exif信息
import QQMapWX from '../../../../utils/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js'
import { QQMAPSDK_KEY } from "../../../../gloalSet/js/constant";

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
        thumb_image_info: [], //图片略缩图
        addressName:"正在获取中...",// 转换好的中文地址
        address:{
          longitude:"",
          latitude:""
        }
    }

    componentDidMount() {
        this.loadBoardList()
        this.getChoiceImageThumbnail()

    }

    getChoiceImageThumbnail = () => {
        const { choiceImageThumbnail = [], } = this.props
        let array = []
        choiceImageThumbnail.map((item, index) => {
            let obj = {}
            obj['index'] = index
            obj['filePath'] = item
            array.push(obj)
        })
        // let promise = [];
        // console.log(array)
        this.setState({
          thumb_image_info: array
        })
        this.getLocation()
        // array.forEach(item => {
        //     promise.push(this.getImageExifInfo(item))
        // })
        // Promise.all(promise).then(resp => {
        //     this.setState({
        //         thumb_image_info: resp
        //     })
        // }).catch(e => console.log('error: ' + e));
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
                    app_type: '4',
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
        let { address :{ longitude,latitude } } = this.state;
        this.props.fileUpload && this.props.fileUpload({latitude,longitude})
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


        // 清除缓存文件
        Taro.getSavedFileList({
            success(res) {
                for (let i = 0; i < res.fileList.length; i++) {
                    Taro.removeSavedFile({
                        filePath: res.fileList[i].filePath,
                        complete(res) {
                            // console.log('清除成功', res)
                        }
                    })
                }
            }
        })
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

    //EXIF坐标转换
    exifGPSCoordinateTransformation = (LatitudeArry) => {
        const longLatitude =
            LatitudeArry[0].numerator / LatitudeArry[0].denominator +
            LatitudeArry[1].numerator / LatitudeArry[1].denominator / 60 +
            LatitudeArry[2].numerator / LatitudeArry[2].denominator / 3600;
        const Latitude = longLatitude.toFixed(6);

        return Latitude;
    }
    GETWXSDKGEO({latitude, longitude}){
      return new Promise((resolve,reject) => {
        var demo = new QQMapWX({
          key: QQMAPSDK_KEY,
        })
        demo.reverseGeocoder({
            location: {
                latitude: latitude,
                longitude: longitude,
            },
            success: function (res) {
                resolve({ address: res.result.address , latitude, longitude})
            },
            fail: function (res) {
                console.log('读取失败: ', res);
                reject(res)
            },
            complete: function (res) {
                console.log('读取完成: ', res);
            }
        });
      })
    }
    getLocation = ()=>{
      let that = this;
      // return new Promise((resolve,reject) => {
        Taro.getLocation({
          type:"gcj02",
          success(resp){
            // console.log(res)
            let { latitude, longitude } = resp;
            that.GETWXSDKGEO({latitude,longitude}).then(res => {
              that.setState({
                addressName: res.address,
                address:{
                  latitude,longitude
                }
              })
            })
          }
        })
      // })
    }
    // 选择位置
    choosePosition = ()=>{
      let that = this;
      wx.chooseLocation({
        success:(val)=>{
          // console.log(val)
          let { latitude ,longitude ,address,name} = val;
          that.setState({
            addressName: address + name,
            address:{
              latitude,longitude
            }
          })
        }
      })
    }

    //获取图片Exif信息
    getImageExifInfo = (tempFilePaths) => {
        return new Promise((resolve, reject) => {
            const { filePath, index, } = tempFilePaths
            let that = this
            wx.getFileSystemManager().readFile({
                filePath,
                success: res => {
                    EXIF.getData(res.data, img => {

                        const LatitudeArry = EXIF.getTag(res.data, 'GPSLatitude')
                        const LongitudeArry = EXIF.getTag(res.data, 'GPSLongitude')

                        if ((!LatitudeArry && LatitudeArry === undefined) || (!LongitudeArry && LongitudeArry === undefined)) {
                            resolve({ id: index, filePath: filePath, address: '暂无地址', })
                            return
                        }

                        const longLatitude = that.exifGPSCoordinateTransformation(LatitudeArry)
                        const longLongitude = that.exifGPSCoordinateTransformation(LongitudeArry)
                        var demo = new QQMapWX({
                            key: QQMAPSDK_KEY,
                        })
                        demo.reverseGeocoder({
                            location: {
                                latitude: longLatitude,
                                longitude: longLongitude,
                            },
                            success: function (res) {
                                resolve({ id: index, filePath: filePath, address: res.result.address, })
                            },
                            fail: function (res) {
                                console.log('读取失败: ', res);
                            },
                            complete: function (res) {
                                console.log('读取完成: ', res);
                            }
                        });
                    })
                }
            })
        })
    }

    render() {

        const { folder_tree, org_list, upload_folder_name, choice_board_folder_id, choice_board_id, current_selection_board_id, current_board_open, } = this.props
        const { child_data = [], } = folder_tree
        const { is_show_board_list, thumb_image_info = [], addressName} = this.state

        const SystemInfo = Taro.getSystemInfoSync()
        const { windowHeight } = SystemInfo
        const scrollHeight = (windowHeight - (80 * 2) - 47 - 18 - 56 - 10) + 'px'
        const contentHeight = (windowHeight - (80 * 2) - 47) + 'px'
        const contentCenterHeight = (windowHeight - (80 * 2) - 47 - 56) + 'px'
        let board_list = this.filterSelectBoard();

        return (

            <View className={indexStyles.choice_folder_modal_mask} >
                <View className={indexStyles.choice_folder_modal_view_style} style={{
                    position: 'absolute',
                    top: 80 + 'px',
                    right: 32 + 'px',
                    left: 32 + 'px',
                    bottom: 80 + 'px',
                }}>
                    {is_show_board_list === false ? (
                        <View style={{ height: contentHeight, width: '100%' }}>
                            <View className={indexStyles.modal_content_style}>
                                <View className={indexStyles.modal_content_top_style} style={{ height: 56 + 'px' }}>
                                    <View className={indexStyles.modal_tips_text_style}>上传到:</View>
                                </View>

                                <View className={indexStyles.modal_content_center_style} style={{ height: contentCenterHeight }}>
                                    <View className={indexStyles.choice_folder_button_style} onClick={this.choiceFolder}>{upload_folder_name}</View>
                                    <ScrollView
                                        scrollX
                                        scrollWithAnimation
                                        className={indexStyles.thumbnail_view_style}
                                    >
                                        {thumb_image_info && thumb_image_info.map((item, key) => {
                                            const { filePath } = item
                                            return (
                                                <Image mode='aspectFill' className={indexStyles.choice_image_thumbnail_style} src={filePath}>
                                                    {/* {address ? (<View className={indexStyles.position_style}>
                                                        <Text className={`${globalStyle.global_iconfont} ${indexStyles.position_icon_style}`}>&#xe790;</Text>
                                                        <Text className={indexStyles.position_text_style}>
                                                            {address}
                                                        </Text>
                                                    </View>) : ''} */}
                                                </Image>
                                            )
                                        })}
                                    </ScrollView>
                                    <View className={indexStyles.addressBox}>
                                      <View className={`${indexStyles.addressText} ${globalStyle.global_iconfont}`}
                                      onClick={this.choosePosition}>
                                        &#xe790; {addressName}
                                      </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ) : (
                            <View className={indexStyles.choice_board_view_style}>
                                <View className={indexStyles.modal_content_top_style} style={{ height: 56 + 'px' }}>
                                    <View className={indexStyles.modal_tips_text_style} onClick={this.backHideBoardList}>{'< '}返回</View>
                                    <View className={indexStyles.folder_name_style}>{upload_folder_name}</View>
                                </View>
                                <ScrollView
                                    scrollY
                                    scrollWithAnimation
                                    className={indexStyles.board_list_view_style} style={{ height: scrollHeight }}>
                                    {board_list && board_list.map(item => {
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


                    <View className={indexStyles.modal_botton_style} style={{ height: 47 + 'px', lineHeight: 47 + 'px' }}>
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
