import Taro, { Component, stopBeaconDiscovery } from '@tarojs/taro'
import { View, Text, RichText, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { AtActionSheet, AtActionSheetItem } from "taro-ui"
import { connect } from '@tarojs/redux'
import { getOrgIdByBoardId, setBoardIdStorage,setRequestHeaderBaseInfo, } from '../../../../utils/basicFunction'
import { BASE_URL, API_BOARD } from "../../../../gloalSet/js/constant";

@connect(({ tasks: { tasksDetailDatas = {}, }, }) => ({
    tasksDetailDatas,
}))
export default class index extends Component {

    state = {
        file_isOpen: false,
        song_task_id: '',
        file_option_isOpen: false,
        file_id: '',
        file_item_id: '',

        file_resource_id: '',
        board_id: '',
        fileName: '',
    }

    handleCancel = () => {
        this.setFileOpen()
    }

    handleClose = () => {
        this.setFileOpen()
    }

    setFileOpen = () => {
        this.setState({
            file_isOpen: false,
        })
    }

    tasksOption = (cardId) => {

        this.setState({
            file_isOpen: true,
            song_task_id: cardId,
        })
    }

    uploadFileFieldsFiels = () => {
      this.setFileOpen()
        this.getAuthSetting()
    }

    // 获取授权
    getAuthSetting = (imageSourceType) => {
        let that = this;
        this.getLocationAuth().then(msg => {
            Taro.getSetting({
                success(res) {
                    if (!res.authSetting['scope.writePhotosAlbum']) { //获取相册权限
                        Taro.authorize({
                            scope: 'scope.writePhotosAlbum',
                            success() {
                                // console.log('授权成功')
                                that.fileUploadAlbumCamera(imageSourceType)
                            }, fail() {
                                Taro.showModal({
                                    title: '提示',
                                    content: '尚未进行授权，部分功能将无法使用',
                                    showCancel: false,
                                    success(res) {
                                        if (res.confirm) {
                                            Taro.openSetting({
                                                success: (res) => {
                                                },
                                                fail: function () {
                                                    console.log("授权设置相册失败");
                                                }
                                            })
                                        } else if (res.cancel) {
                                            console.log('用户点击取消')
                                        }
                                    }
                                })
                            }
                        })
                    } else {
                        that.fileUploadAlbumCamera(imageSourceType)
                    }
                },
                fail(res) {

                }
            })
        }).catch(err => {
            Taro.showModal({
                title: '提示',
                content: '尚未进行授权，部分功能将无法使用',
                showCancel: false,
                success(res) {
                    if (res.confirm) {
                        Taro.openSetting({
                            success: (res) => {

                            },
                            fail: function () {
                                console.log("授权设置相册失败");
                            }
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        })
    }

    //拍照/选择图片上传
    fileUploadAlbumCamera = (imageSourceType) => {
        Taro.setStorageSync('isReloadFileList', 'is_reload_file_list')

        let that = this;
        Taro.chooseImage({
            // count: 9 - that.state.choice_image_temp_file_paths.length,
            count: 1,
            sizeType: ['original'],
            sourceType: [imageSourceType],
            success(res) {
                console.log(res)
                let tempFilePaths = res.tempFilePaths;
                that.setFileOptionIsOpen()
                // that.setState({
                //     makePho: imageSourceType,
                //     choice_image_temp_file_paths: tempFilePaths,
                // })

                that.fileUpload(tempFilePaths)
            }
        })
    }

    getLocationAuth() {
        return new Promise((resolve, reject) => {
            Taro.getSetting({
                success(res) {
                    if (!res.authSetting['scope.userLocation']) {
                        Taro.authorize({
                            scope: 'scope.userLocation',
                            success(val) {
                                resolve(val)
                            }, fail(err) {
                                reject(err)
                            }
                        })
                    } else {
                        resolve(res)
                    }
                }, fail(err) {
                    // reject(err)
                }
            })
        })
    }

      //文件字段文件
      fileUpload = (tempFilePaths) => {

        const { boardId, } = this.props

        //上传
        let that = this;
        const authorization = Taro.getStorageSync('access_token')
        const data = {
            board_id: boardId,
            source_type: 0,
            file:tempFilePaths[0],
        }
        const base_info = setRequestHeaderBaseInfo({ data, headers: authorization })
        // let num = 1;
        Taro.showToast({ icon: "loading", title: `正在上传...` });
        // 统一上传
        let promise = [];
        //开发者服务器访问接口，微信服务器通过这个接口上传文件到开发者服务器
        for (var i = 0; i < tempFilePaths.length; i++) {
            promise.push(this.addSendPromise(tempFilePaths[i], data, authorization, base_info, boardId,))
        }

        Promise.all(promise).then(res => {
            //重新掉列表接口, 刷新列表
            Taro.showToast({
                icon: "success",
                title: "上传完成"
            })

            const resData = JSON.parse(res[0].data)
            var dict = resData.data

            const { dispatch, tasksDetailDatas, item_id,} = this.props
            const { fields = [] } = tasksDetailDatas
            
            fields.forEach(item => {
                if (item['id'] == item_id) {
                  item['field_value'].push(dict)
                }
            })      

          Promise.resolve(

              this.putBoardFieldRelation(fields)

          ).then(res => {
  
            dispatch({
              type: 'tasks/updateDatas',
              payload: {
                  tasksDetailDatas: {
                      ...tasksDetailDatas,
                      ...{ fields: fields },
                  }
              }
          })
        })

        }).catch(err => {
            console.log(err)
            Taro.showModal({ title: '提示', content: "上传失败,请重试", showCancel: false });
        })

    }

    putBoardFieldRelation = (fields = []) => {

      const {dispatch, item_id,} = this.props

      let array = []
      fields.forEach(item => {
        if (item['id'] == item_id) {

           item['field_value'].map(x => {
            array.push(x.id)
       }) // 生成数组
        }
    })  
          
      let valueText = array.join(',')
      
      dispatch({
        type: 'tasks/putBoardFieldRelation',
        payload: {
            id: item_id,
            field_value: valueText,
        }
      })
    }

    addSendPromise = (filePath, data, authorization, base_info, board_id, ) => {
      return new Promise((resolve, reject) => {
          Taro.uploadFile({
              url: BASE_URL + API_BOARD + '/file/upload/common?'
                  + 'board_id=' + `${board_id}`
                  + '&source_type=0', //后端接口
              board_id: board_id,
              source_type: '0',
              filePath: filePath,
              name: 'file',
              header: {
                  "Content-Type": "multipart/form-data; charset=utf-8",
                  "Accept-Language": "zh-CN,zh;q=0.9",
                  "Accept-Encoding": "gzip, deflate",
                  "Accept": "*/*",
                  Authorization: authorization,
                  ...base_info,
              },
              formData: data, //上传POST参数信息
              success(res) {
                  // console.log(res)
                  if (res.statusCode === 200) {
                      let d = JSON.parse(res.data);
                      if (d.code == 0)
                          resolve(res);
                      else {
                          reject(res)
                      }
                  } else {
                      // Taro.showModal({ title: '提示', content: `${'第' + i + '张' + '上传失败'}`, showCancel: false });
                      reject(res)
                  }
              },
              fail(error) {
                  reject(error)
                  // Taro.showModal({ title: '提示', content: `${'第' + i + '张' + '上传失败'}`, showCancel: false });
              },
              complete() {
                  // Taro.hideToast();
              }
          })
      })
  }

    deleteDescribeTasks = () => {

      this.setFileOpen()

        const { dispatch, item_id } = this.props

        dispatch({
          type: 'tasks/deleteBoardFieldRelation',
          payload: {
              id: item_id,
              callBack: this.deleteBoardFieldRelation(item_id),
          },
      })

    }

    deleteBoardFieldRelation = (item_id) => {

      const { dispatch, tasksDetailDatas, } = this.props
      const { fields = [], } = tasksDetailDatas

      let new_array = []
      fields.forEach(element => {

          if (element.id !== item_id) {
              new_array.push(element)
          }
      });

      dispatch({
          type: 'tasks/updateDatas',
          payload: {
              tasksDetailDatas: {
                  ...tasksDetailDatas,
                  ...{ fields: new_array },
              }
          }
      })
  }

    fileOption = (id, file_resource_id, board_id, fileName, file_id) => {

        this.setState({
            file_option_isOpen: true,
            file_id: id,

            file_resource_id: file_resource_id,
            board_id: board_id,
            fileName: fileName,
            file_item_id: file_id,
        })

        const { cardId, dispatch, } = this.props
        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                song_task_id: cardId,
                tasks_upload_file_type: 'describeTasks',
            }
        })
    }

    previewFile = () => {

        const { dispatch } = this.props

        const { file_resource_id, board_id, fileName, } = this.state

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


        this.setFileOptionIsOpen()
    }

    deleteFile = () => {

        const { dispatch, item_id,} = this.props
        const { file_id, } = this.state

        Promise.resolve(
          dispatch({
            type: 'tasks/deleteFileFieldsFileRemove',
            payload: {
                id: file_id,
                // calback: this.deleteFileFieldsFileRemove(),
            }
        })
      ).then(res => {

        const {field_value = [],} = this.props
        let array = []
        field_value.map(x => {
          if (x.id !== file_id) {
             array.push(x.id)
             return array
          }
        }) // 生成数组

        let valueText = array.join(',')
        dispatch({
          type: 'tasks/putBoardFieldRelation',
          payload: {
              id: item_id,
              field_value: valueText,
              calback: this.deleteFileFieldsFileRemove(),
          }
        })
      })

        this.setFileOptionIsOpen()
    }

    deleteFileFieldsFileRemove = () => {

        const { dispatch, tasksDetailDatas, item_id,} = this.props
        const { fields = [] } = tasksDetailDatas
        const {file_id} = this.state
        let new_array = []
        fields.forEach(item => {
            if (item['id'] == item_id) {
              item['field_value'].map(obj=>{                                
                if (obj['id'] !== file_id) {
                  console.log(obj, 'ssssss');
                  new_array.push[obj]
                }
              })
              console.log(new_array, 'ppppppp2222');
              item['field_value'] = new_array
            }
        })

        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                tasksDetailDatas: {
                    ...tasksDetailDatas,
                    ...{ fields: fields },
                }
            }
        })
    }

    fileHandleCancel = () => {

        this.setFileOptionIsOpen()
    }

    setFileOptionIsOpen = () => {
        this.setState({
            file_option_isOpen: false,
        })
    }
    fileHandleClose = () => {

        this.setFileOptionIsOpen()
    }

    deleteCardProperty = () => {

        const { dispatch, cardId } = this.props
        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                song_task_id: cardId,
                tasks_upload_file_type: 'describeTasks',
            }
        })

        this.setState({
            file_isOpen: true,
        })
    }

    deleteTasksFieldRelation = (propertyId) => {

        const { dispatch, tasksDetailDatas, } = this.props
        const { properties = [], } = tasksDetailDatas

        let new_array = []
        properties.forEach(element => {

            if (element.id !== propertyId) {
                new_array.push(element)
            }
        });

        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                tasksDetailDatas: {
                    ...tasksDetailDatas,
                    ...{ properties: new_array },
                }
            }
        })
    }

    render() {
        const { field_value = [] } = this.props
        const title = this.props.title || ''        
// console.log('field_value=====', field_value)
        return (

            <View className={indexStyles.wapper}>

                {/* <View className={indexStyles.list_item} onClick={this.gotoChangeChoiceInfoPage.bind(this,)}> */}
                <View className={indexStyles.list_item}>
                    <View className={`${indexStyles.list_item_left_iconnext}`}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe7f5;</Text>
                    </View>
                  
                    <View className={indexStyles.list_item_name}>{title}</View>

                    <View className={`${indexStyles.list_item_iconnext}`} onClick={this.deleteCardProperty}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe63f;</Text>
                    </View>

                </View>

                {
                    field_value && field_value.map((item, key) => {
                        const { id, file_resource_id, board_id, file_id, file_name} = item
                        return (
                            <View key={key} className={indexStyles.song_tasks_file}>
                                <View className={`${indexStyles.list_item_file_iconnext}`}>
                                    <Text className={`${globalStyle.global_iconfont}`}>&#xe669;</Text>
                                </View>
                                <View className={indexStyles.song_tasks_file_name} onClick={() => this.fileOption(id, file_resource_id, board_id, file_name, file_id)}>{file_name}</View>
                            </View>
                        )
                    })
                }


                <AtActionSheet isOpened={this.state.file_isOpen} cancelText='取消' onCancel={this.handleCancel} onClose={this.handleClose}>
                    <AtActionSheetItem onClick={this.uploadFileFieldsFiels}>
                        上传文件
                    </AtActionSheetItem>
                    <AtActionSheetItem onClick={this.deleteDescribeTasks}>
                        删除字段
                    </AtActionSheetItem>
                </AtActionSheet>

                <AtActionSheet isOpened={this.state.file_option_isOpen} cancelText='取消' onCancel={this.fileHandleCancel} onClose={this.fileHandleClose}>
                    <AtActionSheetItem onClick={this.previewFile}>
                        预览文件
                    </AtActionSheetItem>
                    <AtActionSheetItem onClick={this.deleteFile}>
                        删除文件
                    </AtActionSheetItem>
                </AtActionSheet>

            </View>
        )
    }
}


