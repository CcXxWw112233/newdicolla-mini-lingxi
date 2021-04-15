import Taro, { Component,getCurrentInstance } from '@tarojs/taro'
import { View, Image, Button, Text,RichText,ScrollView } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import { filterFileFormatType } from './../../../utils/util';
import { getOrgIdByBoardId, setBoardIdStorage, setRequestHeaderBaseInfo, judgeJurisdictionProject } from '../../../utils/basicFunction'
import { BASE_URL, API_BOARD, PROJECT_FILES_FILE_DELETE, PROJECT_FILES_FILE_DOWNLOAD } from "../../../gloalSet/js/constant";
import NoDataSvg from "../../../asset/nodata.svg";

import SearchBar from '../../../components/searchBar'
@connect(({
  file: {
      file_list = [],
      isShowBoardList,
      header_folder_name,
      isShowChoiceFolder,
      selected_board_folder_info,
      unread_file_list = [],
      unvisited_file_list_count,
      verify_authority_list,
      current_previewImage,
      uploadNowList = [],
      search_file_list = []
  },
  im: {
      allBoardList,
      currentBoard,
  } }) => ({
      file_list,
      isShowBoardList,
      header_folder_name,
      isShowChoiceFolder,
      allBoardList,
      selected_board_folder_info,
      currentBoard,
      unread_file_list,
      unvisited_file_list_count,
      verify_authority_list,
      current_previewImage,
      uploadNowList,
      search_file_list
  }))
export default class nowOpen extends Component {
  config = {
    navigationBarTitleText: '文件查询'
  }

  state = {
    delBtnWidth:100
  }

  componentDidMount = e => {
    const {search_file_list} = this.props;
  }
// 开始检索
  searchMenuClick = value => {
    const {file_list,dispatch} = this.props
      console.log('sssssssssss', value)
      if(value) {
        let new_file_list =  file_list.filter(function(item){
          return item.file_name.indexOf(value) != -1;
        }); 
        dispatch({
          type: 'file/updateDatas',
          payload: {
            search_file_list: new_file_list,
          },
        })

      } else {
        dispatch({
          type: 'file/updateDatas',
          payload: {
            search_file_list: file_list,
          },
        })
      }
    }
    // 取消检索
    cancelSearchMenuClick = value => {
      const {file_list,dispatch} = this.props
      dispatch({
        type: 'file/updateDatas',
        payload: {
          search_file_list: file_list,
        },
      })
    }

  touchS (e) {
    if (e.touches.length == 1) {
      this.setState({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX,
        currentTargetId:e.currentTarget.id
      });
    }
  }
  touchM (e) {
    var that = this
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.state.startX - moveX;
      var delBtnWidth = this.state.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "margin-left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "margin-left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "margin-left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项
      // var index = e.target.dataset.index;
      // var list = this.state.list;
      // list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setState({
        txtStyle:txtStyle
      });
    }
  }
 
  touchE (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.state.startX - endX;
      var delBtnWidth = this.state.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "margin-left:-" + delBtnWidth + "px" : "margin-left:0px";
      //获取手指触摸的是哪一项
      // var index = e.target.dataset.index;
      // var list = this.state.list;
      // list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setState({
        txtStyle:txtStyle
      });
    }
  }
  //获取元素自适应后的实际宽度
  getEleWidth (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应
      // console.log(scale);
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  }
   //预览文件详情
   goFileDetails = (value, fileName) => {
    Taro.setStorageSync('isReloadFileList', 'is_reload_file_list')
    const { id, board_id, org_id } = value
    const { dispatch } = this.props
    setBoardIdStorage(board_id)
    const fileType = fileName.substr(fileName.lastIndexOf(".")).toLowerCase();
    const img_type_arr = ['.bmp', '.jpg', '.png', '.gif',]  //文件格式
    // 判断是否是图片
    if(img_type_arr.indexOf(fileType.toLowerCase()) != -1) {
        console.log('图片')
        Taro.navigateTo({
            url: '/pages/file/previewImage/index?imageData=' + JSON.stringify(value),
        })
        return;
    }
    const parameter = {
        board_id,
        file_ids: id,
        _organization_id: getOrgIdByBoardId(board_id) ? getOrgIdByBoardId(board_id) : org_id,
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
            downLoadAuto: judgeJurisdictionProject(board_id, PROJECT_FILES_FILE_DOWNLOAD),
            fileName: fileName,
        },
    })
}
// 更多 圈子  删除
showMoreMenu = value => {
  var that = this;
  Taro.showActionSheet({
    itemList: ['删除', '进入圈子'],
    success: function (res) {
      console.log(res.tapIndex)
      if(res.tapIndex == 0) {
        Taro.showModal({
          title: '温馨提示',
          content: '确定删除文件?',
          success: function (res) {
              if (res.confirm) {
                that.deleteFile(value)
              } else if (res.cancel) {
                  console.log('用户点击取消')
              }
          }
      })
      } else {
        that.goFileChat(value)
      }
    },
    fail: function (res) {
      console.log(res.errMsg)
    }
  })
}
// 删除文件
deleteFile = value => {
  // var txtStyle =  "margin-left:0px";
  //更新列表的状态
  // this.setState({
  //   txtStyle:txtStyle
  // });
  const {search_file_list,file_list,dispatch} = this.props
  let selectFiles = [{
    type:'2',
    id  :value.id
  }]
  Promise.resolve(dispatch({
    type: 'file/deleteFiles',
    payload: {
        board_id: value.board_id,
        arrays: JSON.stringify(selectFiles),
    },
})
).then(() => {
    let new_search_file_list =  search_file_list.filter(function(item){
      return item.id != value.id;
    }); 
    let new_file_list = file_list.filter(function(item){
      return item.id != value.id;
    }); 
    // file_list
    dispatch({
      type: 'file/updateDatas',
      payload: {
        search_file_list: new_search_file_list,
        file_list: new_file_list,
      },
    })
  })
}
// 进入圈子
goFileChat = value => {
  let { dispatch } = this.props;
  let obj = {
      id: value.id,
      actionType: "file",
      board_id: value.board_id
  }

  dispatch({
      type: "file/updateDatas",
      payload: {
          current_custom_message: obj
      }
  })
  setTimeout(() => {
      Taro.navigateTo({
          url: "/pages/filesChat/index"
      })
  }, 50)
} 

  render() {
    const {txtStyle,currentTargetId} = this.state;
    const {search_file_list} = this.props;

    return (
      <View className={`${indexStyles.index}`} >
        <SearchBar searchMenuClick={(value) => this.searchMenuClick(value)} cancelSearchMenuClick={(value) => this.cancelSearchMenuClick(value)}/>
        <View className={indexStyles.placeView}></View>
        {
          search_file_list && search_file_list.length > 0 ? (
        <ScrollView className={indexStyles.search_file_list_view} scrollY={true} >
        {
          search_file_list.map((value, key) => {
          const fileType = filterFileFormatType(value.file_name);
          const { thumbnail_url, msg_ids, visited } = value
           return (
             <View className={indexStyles.fileContant} key={key}>
              <View className={indexStyles.fileItem} onClick={this.goFileDetails.bind(this, value, value.file_name)} onTouchStart={this.touchS} onTouchMove={this.touchM} onTouchEnd={this.touchE}>
               {
                 thumbnail_url && thumbnail_url.length > 0 ? (<Image className={indexStyles.fileItem_image} src={thumbnail_url}></Image>) : 
                 (
                  <View className={indexStyles.fileItem_image}>
                    <RichText className={`${globalStyle.global_iconfont} ${indexStyles.folder_type_icon}`} nodes={fileType} />
                  </View>
                 )
               } 
                <View className={indexStyles.fileItem_Text}>{value.file_name}</View>
              </View>
              <View className={`${globalStyle.global_iconfont} ${indexStyles.folder_more_icon}`} onClick={this.showMoreMenu.bind(this,value)}>&#xe63f;</View>
              {/* <View  className={indexStyles.fileItem_innerDelete} onClick={this.deleteFile} id={key}>删除</View> */}
             </View>
           )
         })
        }
        </ScrollView>) : (
          
            <View className={indexStyles.noDataView}>
                <Image className={indexStyles.noDataImage} src={NoDataSvg}></Image>
                <View className={indexStyles.noDataText}>未找到符合条件的文件</View>
            </View> 
        )}
        
       
      </View>
    )
  }
}

