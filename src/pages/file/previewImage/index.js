import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import SearchBar from '../../../components/searchBar'
import { getFileInfo, getFileComment, setFileComment } from '../../../services/file/index'
import { transformTime } from '../../../utils/util'
import CustomNavigation from "../../acceptInvitation/components/CustomNavigation.js";
import {  PROJECT_FILES_FILE_DOWNLOAD,PROJECT_FILES_FILE_DELETE } from "../../../gloalSet/js/constant";
import {  judgeJurisdictionProject } from '../../../utils/basicFunction'

@connect(({
  chat: { isUserInputHeightChange },
  file: { current_custom_message, current_custom_comment, load_custom_file_msg },
  im: { userUID, currentGroup }
}) => ({
  current_custom_message,
  current_custom_comment,
  load_custom_file_msg,
  userUID,
  currentGroup,
  isUserInputHeightChange
}))
export default class nowOpen extends Component {
  config = {
    navigationStyle: 'custom',
  }
  state = {
    currentImage:'',
    current_custom_comment:[]
  }
  componentDidMount() {
    this.setState({
      currentImage:JSON.parse(this.$router.params.imageData)
    },()=>{
      this.getCommentList()
    })
  }
  componentDidShow() {
    this.setState({
      currentImage:JSON.parse(this.$router.params.imageData)
    },()=>{
      this.getCommentList()
    })
  }
  /**
   * 获取评论数据
   */
  getCommentList = () => {
    let {  dispatch } = this.props;
    const {currentImage = {}} = this.state;
    let { id } = currentImage;
    let param = {
      id: currentImage.id,
      flag: 0
    }
    let header = this.setHeader();
    getFileComment(param, header).then(res => {
      // console.log(res)
      if (res.code == 0) {
        
        let list = this.restructureComment(res.data);

        // console.log(list)
        list = list.sort((a, b) => a.time - b.time);
        let new_list = list.filter(item=>{
          return item.text.length > 0
        })
        this.setState({
          current_custom_comment: new_list.slice(-2)
        })
      }
    })
  }
 
  restructureComment(data) {
    if (!data || !data.length) {
      return [];
    }
    let arr = [];
    data.forEach((item, index) => {
      let { creator } = item;
      if (item.message_type == 2) {
        let content = {
          method: 'newActivity',
          data: {
            d: JSON.stringify({ ...item })
          }
        }
        // 动态通知
        let obj = {
          ...this.baseObj(creator, item, index),
          content: content
        }
        arr.push(obj);
      }
      else if (item.message_type == 1) {
        // 评论内容
        let obj = {
          ...this.baseObj(creator, item, index),
          type: "text",
          text: item.text
        }
        arr.push(obj)
      }
    })
    return arr;
  }
  baseObj = (creator, item) => {
    const {currentImage = {}} = this.state;
    const {userUID} = this.props;
    // 基础的文件消息数据
    let defaultObj = {
      idServer: Math.floor(Math.random() * 100000) + 1,
      type: 'custom',
      from: creator.id,
      flow: creator.id == userUID ? "out" : "in",
      fromNick: creator.name,
      avatar: creator.avatar,
      isRead: "true",
      scene: 'team',
      target: item.board_id,
      time: item.update_time ? (item.update_time.length == 10 ? item.update_time + '000' : item.update_time) : (item.create_time.length == 10 ? item.create_time + '000' : item.create_time),
      text: "",
      fileType: currentImage.actionType,
      id: item.id,
      isFileComment: true
    }
    return defaultObj;
  }

  setHeader = () => {
    const {currentImage} = this.state;
    let base64Data = {
      orgId: "0",
      boardId: currentImage.board_id,
      aboutBoardOrganizationId: "0",
      contentDataType: currentImage.actionType,
      contentDataId: currentImage.id
    }
    let header = {
      BaseInfo: base64Data
    }
    return header;
  }
  /**
   * 长按图片 删除  保存到相册 
   */
  onLongClick = () => {
    var that = this;
    Taro.showActionSheet({
      itemList: ['保存到相册', '删除'],
      success: function (res) {
        console.log(res.tapIndex)
        if(res.tapIndex == 0) {
          that.saveToAlbum()
        } else if(res.tapIndex == 1) {
          that.deleteFile()
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })    
  }
  /**
   * 保存到相册
   * @returns 
   */
   saveToAlbum = () => {
      const {currentImage = {}} = this.state;

      if(!judgeJurisdictionProject(currentImage.board_id, PROJECT_FILES_FILE_DOWNLOAD)) {
        Taro.showToast({
          title: '您没有该文件的下载权限',
          icon: 'none',
          duration: 2000
        })  
        return;  
      }
      this.authUserJuris()

   }
  /**
   *  获取用户授权信息
   * */  
   authUserJuris() {
     var that = this;
    wx.getSetting({
      success(res) {
        console.log(res);
        if (res.authSetting['scope.writePhotosAlbum']) {
          // 用户已授权
          that.saveImage();
        } else if (res.authSetting['scope.writePhotosAlbum'] !== undefined){
          // 用户首次进入还未调起权限相关接口
          that.openSetting();
       } else {
         // 用户首次进入
         that.saveImage();
       }
      },
      fail(err) {
        showToast('获取授权信息失败')
        console.log(err);
      }
    })
}

   /**
    * 保存图片授权页
    */
  openSetting() {
    wx.showModal({
      title: '提示',
      content: '请先授权同意保存图片到相册',
      confirmText: '确定授权',
      success(res){
        if (res.confirm) {
          wx.openSetting({
            fail(err) {
              showToast('打开授权设置页面失败');
            }
          });
        }
      }
    })
  }
  /**
   * 保存图片到相册
   * @returns 
   */
   saveImage = () => {
     const {currentImage} = this.state
    wx.getImageInfo({
      src: currentImage.thumbnail_url,
      success(res) {
        const { path } = res;
        if (path) {
          wx.saveImageToPhotosAlbum({
            filePath: path,
            success(res) {
              showToast('保存成功');
              successFn && successFn();
            },
            fail() {
              showToast('保存失败');
              failFn && failFn();
            }
          })
        }
      },
      fail(err) {
        showToast('获取图片地址失败');
      }
    });
   }
/**
 * 删除
 * @returns 
 */
 deleteFile = () => {
  const {currentImage = {}} = this.state;
  const { dispatch } = this.props;

  if(!judgeJurisdictionProject(currentImage.board_id, PROJECT_FILES_FILE_DELETE)) {
    Taro.showToast({
      title: '您没有该文件的删除权限',
      icon: 'none',
      duration: 2000
    })  
    return;  
  }

  Taro.showModal({
    title: '温馨提示',
    content: '确定删除文件?',
    success: function (res) {
        if (res.confirm) {
          let selectFiles = [{
            type:'2',
            id  :currentImage.id
          }]
          Promise.resolve(dispatch({
              type: 'file/deleteFiles',
              payload: {
                  board_id: currentImage.board_id,
                  arrays: JSON.stringify(selectFiles),
              },
          })
          ).then(() => {
            Taro.navigateBack({
              delta: 1
            })            
          })
          } else if (res.cancel) {
              console.log('用户点击取消')
          }
      }
  })
 }
 goFileChat = value => {
  const {dispatch} = this.props
  const {currentImage = {}} = this.state;

  let obj = {
      id: currentImage.id,
      actionType: "file",
      board_id: currentImage.board_id
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
    const {currentImage,current_custom_comment=[]} = this.state;
    return (
      <View className={`${indexStyles.index}`} >
        <CustomNavigation  className={indexStyles.customNavigation} backIcon='arrow_icon' title={currentImage.file_name} pop = 'previous' bgColor='rgba(33, 36, 52, 0.65)'/>
        <View className={indexStyles.comment_view}>
          <Image className={indexStyles.content_image} src={currentImage.thumbnail_url} onLongPress={this.onLongClick.bind(this)} mode='aspectFit'></Image>
          <View className={indexStyles.comment_list_view}>
            {
              current_custom_comment && current_custom_comment.map((item,key)=> {
                return   item.flow == 'out' ? (
                  <View className={`${indexStyles.comment_list_item} ${key == 0 ? indexStyles.comment_list_item_first:''}`} key={key} onClick={this.goFileChat}>
                    <View className={`${indexStyles.comment_list_item_text} ${indexStyles.comment_list_item_text_out}`} >{item.text}</View>
                    <Image className={indexStyles.comment_list_item_avatar} src='https://newdi-test-public.oss-cn-beijing.aliyuncs.com/2021-01-08/f352cc3b98b0438b8544d4f07a778f7d.jpg'></Image>
                  </View>
                ):(
                  <View className={`${indexStyles.comment_list_item} ${key == 0 ? indexStyles.comment_list_item_first:''}`} key={key} onClick={this.goFileChat}>
                    <Image className={indexStyles.comment_list_item_avatar}  src='https://newdi-test-public.oss-cn-beijing.aliyuncs.com/2021-01-08/f352cc3b98b0438b8544d4f07a778f7d.jpg'></Image>
                    <View className={indexStyles.comment_list_item_text}>{item.text}</View>
                  </View>
                )
              })
            }
          </View>
        </View>
      </View>
    )
  }
}

