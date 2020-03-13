import Taro, { Component } from '@tarojs/taro'
import { View,Text,Image, ScrollView ,RichText} from '@tarojs/components'
import styles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import { getFileInfo,getFileComment ,setFileComment} from '../../services/file/index'
import { transformTime } from '../../utils/util'
import { Base64 } from 'js-base64';
import ChatItem from '../chat/components/ChatItem'
import UserInput from '../chat/components/UserInput'

@connect(({
  file:{current_custom_message,current_custom_comment,load_custom_file_msg},
  im:{userUID,currentGroup,isUserInputHeightChange}
})=>({
  current_custom_message,
  current_custom_comment,
  load_custom_file_msg,
  userUID,
  currentGroup,
  isUserInputHeightChange
}))
export default class FilesChat extends Component {
  constructor(){
    super(...arguments);
    this.state = {
      imgSrc:"",
      imgTitle:"",
      imgSize:"",
      creator:"",
      imgUpdateTime: "",
      isIosHomeIndicator: false,  //是否iPhone X 及以上设备
      showContacts:false,
      selectedUser:"",
      scrollIntoViewEleId:"",
      loadPrev:false,
      fileTypeText:""
    }
    this.closeTime = null ;
    this.IsBottom = true;
    this.isLoading = false;
    this.fileExts =
      {
        pdf:"&#xe652;","3dm":"&#xe6e0;",
        "mp4":"&#xe6e1;","mp3":"&#xe6e2;",
        "rar":"&#xe6e4;","zip":"&#xe6e5;",
        "7z":"&#xe6e6;",gz:"&#xe6e7;",
        "skp":"&#xe6e8;","docx":"&#xe64c;",
        "dwg":"&#xe64d;","doc":"&#xe64e;",
        "key":"&#xe64f;","mb":"&#xe650;",
        "pptx":"&#xe651;",txt:"&#xe658;",
        ppt:"&#xe659;",iges:"&#xe65e;",
        obj:"&#xe660;","xlsx":"&#xe665;",
        "psd":"&#xe666;",xls:"&#xe667;",
        "ma":"&#xe668;"
      }
  }
  getCurrentDetail = ()=>{
    return new Promise((resolve,reject)=>{
      let {current_custom_message,dispatch} = this.props;
      // 文件类型
      // console.log(current_custom_message)
      if(current_custom_message.actionType == 'file'){
        let { id } = current_custom_message;
        let param = {
          id: id
        }
        let header = this.setHeader();
        // console.log(header)
        getFileInfo(param,header).then(res => {
          if(res.code == 0){
            let { data = {} } = res;
            let { base_info = {}, preview_info = {} , version_list = []} = data ;
            console.log(res)
            // 获取版本中的数据
            let imgMsg = this.getCurrentVersion(base_info.id, version_list) || {};
            let { update_time,file_size,creator } = imgMsg;
            let time = transformTime(update_time,'yyyy/MM/dd');
            let name = base_info.file_name;
            let ext = name.split('.');
            // 文件格式
            ext = ext[ext.length - 1];
            this.setState({
              imgSrc: preview_info.url,
              imgTitle: base_info.file_name,
              imgSize:file_size,
              creator:creator,
              imgUpdateTime: time,
              fileTypeText: ext && ext.toLowerCase()
            })
            // 更新到全局
            dispatch({
              type: 'file/updateDatas',
              payload: {
                load_custom_file_msg: data
              }
            })

            resolve(data)
          }else {
            reject(res)
            Taro.showToast({
              title: res.message,
              icon:"none",
              duration:2000
            })
            this.closeTime = setTimeout(()=>{
              Taro.navigateBack({delta:1});
            },2000)
          }
        })
      }
    })
  }
  componentWillUnmount(){
    clearTimeout(this.closeTime);
  }
  // 获取当前版本数据中的版本
  getCurrentVersion = (id,versions)=>{
    let version = versions.find(item => item.id == id);
    if(version){
      return version;
    }else{
      return {};
    }
  }
  // 预览图片
  previewPicture = ()=>{

    if(this.isImage()){
      let { imgSrc } = this.state;
      if(imgSrc){
        wx.previewImage({
          urls:[imgSrc],
          current:imgSrc
        })
      }
    }else{
      let { fileTypeText } = this.state;
      let { dispatch ,load_custom_file_msg = {}} = this.props;
      // console.log(current_custom_message)
      let { base_info = {} } = load_custom_file_msg;

      const parameter = {
        board_id:base_info.board_id,
        ids: base_info.file_resource_id,
        _organization_id: base_info.org_id,
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
            fileType: '.'+fileTypeText,
        },
      })
    }
  }

  restructureComment(data){
    if(!data || !data.length){
        return [];
    }
    let arr = [];

    data.forEach(( item, index ) => {
        let {creator} = item;
        if(item.message_type == 2){
            let content = {
                method:'newActivity',
                data:{
                    d:JSON.stringify({...item})
                }
            }
            // 动态通知
            let obj = {
                ...this.baseObj(creator,item,index),
                content:content
            }
            arr.push(obj);
        }
        else if(item.message_type == 1){
            // 评论内容
            let obj = {
                ...this.baseObj(creator,item,index),
                type:"text",
                text: item.text
            }
            arr.push(obj)
        }
    })
    return arr ;
  }

  setHeader = ()=>{
    let { load_custom_file_msg = {},current_custom_message} = this.props;
    let base64Data = {
      orgId:"0",
      boardId: current_custom_message.board_id ,
      aboutBoardOrganizationId: "0",
      contentDataType: current_custom_message.actionType,
      contentDataId: current_custom_message.id
    }
    // console.log(base64Data)
    let textJson = JSON.stringify(base64Data);
    // textJson = encodeURI(textJson);
    let header = {
        BaseInfo: base64Data
    }
    return header;
  }

  getCommentList = ()=>{
    let { current_custom_message,dispatch } = this.props;
    let { id } = current_custom_message;
    let param = {
      id: id,
      flag:0
    }
    let header = this.setHeader();
    // console.log(header)
    getFileComment(param,header).then(res => {
      // console.log(res)
      if(res.code == 0){
        let list = this.restructureComment(res.data);
        // console.log(list)
        list = list.sort((a,b)=> a.time - b.time);
        dispatch({
           type: 'file/updateDatas',
           payload: {
             current_custom_comment: list
           }
        })
        if(list.length)
        this.setCurrentIdServer(list[list.length - 1]);
        // console.log(list[list.length - 1])
      }
    })
  }

  baseObj = (creator,item) => {
    let { current_custom_message,userUID } = this.props;
    // 基础的文件消息数据
    let defaultObj = {
        idServer: Math.floor(Math.random() * 100000) + 1,
        type:'custom',
        from:creator.id,
        flow: creator.id == userUID ? "out" :"in",
        fromNick:creator.name,
        avatar: creator.avatar,
        isRead:"true",
        scene:'team',
        target: item.board_id,
        time: item.update_time ? (item.update_time.length == 10 ? item.update_time  +'000' : item.update_time) :(item.create_time.length == 10 ? item.create_time  +'000' : item.create_time) ,
        text:"",
        fileType:current_custom_message.actionType,
        id: item.id,
        isFileComment:true
    }
    return defaultObj ;
  }

  onScrolltoupper = ()=>{
    // this.loadPrev();
  }
  onScroll = ()=>{
    this.IsBottom = false;
  }
  onScrollToLower = ()=>{
    this.IsBottom = true;
  }

  isShouldShowTimestamp = (index, arr) => {
    //如果是消息队列中的第一条消息，那么显示时间戳
    if (index === 0) return true;
    //时间间隔 5 分钟
    const timeBetween = 1000 * 60 * 5;
    //如果本条消息的时间戳比上一条消息的时间戳大于 timeBetween 则显示
    const currentMsg = arr[index];
    const prevMsg = arr[index - 1];
    if (
      +currentMsg.time &&
      +prevMsg.time &&
      +currentMsg.time >= +prevMsg.time + +timeBetween
    ) {
      return true;
    }
    return false;
  };
  getAvatar = (val) => {
    let { currentGroup } = this.props;
    let { from } = val;
    let { users = [] } = currentGroup;
    for (let i = 0; i < users.length; i++) {
      let item = users[i];
      if (item.user_id == from) {
        return item.avatar;
      }
    }
    return "";
  }

  componentDidMount(){
    console.log(this.props.current_custom_message)
    this.getCurrentDetail().then(res => {
      this.getCommentList()
    });
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.current_custom_comment.length != this.props.current_custom_comment.length){
      let item = nextProps.current_custom_comment;
      if(item && item.length){
        this.setCurrentIdServer(item[item.length - 1 ]);
      }

    }
  }
  componentWillUnmount(){
    let { dispatch } = this.props;
    dispatch({
      type:"file/updateDatas",
      payload:{
        current_custom_message:{},
        current_custom_comment:[],
        load_custom_file_msg:{}
      }
    })
  }
  setCurrentIdServer = (data) => {
    let key = "";
    if (data) {
      key = 'item_' + data.idServer
    }
    this.setState({
      scrollIntoViewEleId: key
    })
  }
  onSend = (val)=>{
    let { current_custom_comment, currentGroup,dispatch,load_custom_file_msg} = this.props;
    let { base_info = {} } = load_custom_file_msg;
    let param = {
      file_id:base_info.id,
      board_id:base_info.board_id,
      type:"0",
      comment:val.trim()
    }

    let header = this.setHeader()
    setFileComment(param,header).then(res => {
      if(res.code == 0){
        let old = [...current_custom_comment];
        let {creator} = res.data;
        // console.log(old)
        let chat = {
          ...this.baseObj(creator,res.data),
          text: val.trim(),
          type:'text',
          content:"",
          from: creator.user_id,
          time: res.data.update_time +'000'
        }
        old.push(chat);
        // 更新列表
        dispatch({
          type:"file/updateDatas",
          payload:{
            current_custom_comment: old
          }
        })
      }else{
        Taro.showToast({
          title:"没有评论权限",
          icon:"none",
          duration: 2000
        })
      }

    })
  }


  // 检查这个文件是不是图片
  isImage = ()=>{
    let { fileTypeText } = this.state;
    if(fileTypeText){
      if(fileTypeText == 'jpeg' || fileTypeText == 'png' || fileTypeText == 'gif' || fileTypeText == 'jpg'){
        return true;
      }else{
        return false;
      }
    }
    return false
  }

  renderList = () => {
    let { current_custom_comment } = this.props;
    // let keys = [...Object.keys(this.props)];
    // // console.log(keys)
    // keys = keys.filter(item => item.indexOf(this.propsKey) != -1);
    // return keys;
    return [];
  }

  render(){
    let { imgSrc,imgTitle ,imgSize, imgUpdateTime, creator,
      scrollIntoViewEleId,isIosHomeIndicator,loadPrev,fileTypeText} = this.state;
    let { isUserInputHeightChange ,userUID,current_custom_comment} = this.props;
    return (
      <View>
        <View className={styles.fileChatComment}>
          <View className={styles.fileCommentHeader}>
            <View className={styles.fileViewBox}>
              { this.isImage() ? (
                <Image className={styles.fileImage} src={imgSrc} mode='scaleToFill'/>
              ) :(
                <View className={`${globalStyle.global_iconfont} ${styles.fileNameExt}`}>
                  <RichText className={globalStyle.global_iconfont} nodes={this.fileExts[fileTypeText]}/>
                </View>
              )}

              <View className={styles.fileDetail}>
                <View className={styles.fileDetailTitle}>
                  <Text>{imgTitle}</Text>
                </View>
                <View className={styles.updateDetail}>
                  <Text>{imgSize + ''}</Text>
                  <Text>{"" + creator + ''}</Text>
                  更新于
                  <Text>{ "" + imgUpdateTime + ''}</Text>
                </View>
              </View>
            </View>
            <View className={styles.showDetailBtn} onClick={this.previewPicture}>
              查看
            </View>
          </View>
          <ScrollView
          className={[styles.wrapper, isIosHomeIndicator === false ? styles.maxHeight : styles.minHeight].join(" ")}
          scrollY
          enableBackToTop
          scrollIntoView={scrollIntoViewEleId}
          scrollWithAnimation={true}
          onScrolltoupper={this.onScrolltoupper}
          upperThreshold={5}
          onScroll={this.onScroll}
          onScrollToLower={this.onScrollToLower}>
            {loadPrev && <View className={styles.loadMoreChat}>加载中...</View>}
            <View
            className={styles.contentWrapper}
            style={{
              paddingBottom: isUserInputHeightChange
                ? isUserInputHeightChange + 'px'
                : '0px'
            }}>
              {/* {this.renderList().map(mapkey => { */}
                {/* return ( */}
                  <View>
                    {current_custom_comment.map((i, index, arr) => {
                      return (
                        <View className={styles.chatItemWrapper} key={i.time} id={'item_' + i.idServer}>
                          {this.isShouldShowTimestamp(index, arr) && (
                            <ChatItem type='timestamp' time={i.time} />
                          )}
                          <ChatItem
                            fromType='file'
                            flow={i.flow}
                            fromNick={i.fromNick}
                            avatar={this.getAvatar(i)}
                            // avatar={i.avatar}
                            status={i.status}
                            time={i.time}
                            type={i.type}
                            text={i.text}
                            file={i.file}
                            content={i.content}
                            pushContent={i.pushContent}
                            groupNotification={i.groupNotification}
                            someMsg={i}
                          />
                        </View>
                      )
                    })}
                  </View>
                {/* ) */}
              {/* })} */}
            </View>
          </ScrollView>
          <UserInput onSend={this.onSend} hideVoice={true} hideAddition={true} fromPage='filesChat'/>
        </View>
      </View>
    )
  }
}
