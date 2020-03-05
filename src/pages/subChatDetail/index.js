import Taro, { Component } from '@tarojs/taro'
import { View, Text ,ScrollView} from '@tarojs/components';
import styles from './index.scss';
import { connect } from '@tarojs/redux';
import ChatHeader from '../chat/components/ChatHeader'
import { getImHistory } from '../../services/im'
import ChatItem from '../chat/components/ChatItem'
import UserInput from '../chat/components/UserInput'
import Contacts from '../Contacts'

@connect(({
  im: { currentSubChat = {} ,userUID},
  im,
  chat: { isUserInputFocus, isUserInputHeightChange }
  }) => {
  let keys = Object.keys(im).filter(item => item.indexOf('historySub_') != -1);
    let obj = {}
    keys.forEach(item => {
      obj[item] = im[item]
    })
  return {
    currentSubChat,
    userUID,
    isUserInputFocus,
    isUserInputHeightChange,
    ...obj
  }
})
export default class SubChatDetail extends Component {
  constructor(){
    super(...arguments);
    this.pageParams = {
      id: "",
      page_size: 10,
      page_number: 1
    }
    this.propsKey = "historySub_";
    this.state = {
      isIosHomeIndicator: false,  //是否iPhone X 及以上设备
      showContacts:false,
      selectedUser:"",
      scrollIntoViewEleId:"",
      loadPrev:false
    }
    this.IsBottom = true;
    this.isLoading = false;
  }
  tapName = ()=>{
    let { currentSubChat ,dispatch} = this.props;
    dispatch({
      type:"im/updateStateFieldByCover",
      payload:{
        currentBoardDetail:currentSubChat
      }
    })
    Taro.navigateTo({
      url: `/pages/chatDetail/index`
    })
  }
  // 获取历史记录，设置分段加载
  setChatHistory = ()=>{
    return new Promise((resolve,reject) => {
      let { dispatch, userUID } = this.props;
      this.getHistory().then(res => {
        // 查询所有已存在的列表
        let readyKey = Object.keys(this.props).filter(item => item.indexOf(this.propsKey) != -1);
        let readyList = [];
        // 组合成一个数据
        readyKey.forEach(item => {
          readyList = readyList.concat([...this.props[item]]);
        })
        // 去重新数组
        let arr = [];
        let data = res.records;
        // 去重对象- key => true
        let obj = {}
        readyList.forEach(item => {
          if (!obj[item.idServer]) {
            obj[item.idServer] = true;
          }
        })

        // promise resolve返回数据

        data.forEach(item => {
          // 更新数据流方向
          if ((item.from == userUID && (item.type == 'custom' && JSON.parse(item.content).type == 3))||(item.from == userUID && item.type != 'custom') ) {
            item.flow = 'out'
          }
          if (item.type == 'custom') {
            if (item.content && typeof item.content === 'string') {
              item.content = JSON.parse(item.content);
            }
          }
          // 如果不存在，就push进去，去重
          if (!obj[item.idServer]) {
            arr.push(item);
          }

        })
        // 设定props的key
        let key = this.propsKey + new Date().getTime();
        let newArr = arr.sort((a, b) => a.time - b.time)

        if(!newArr.length){
          reject(newArr);
          return ;
        }else
        resolve(newArr);

        dispatch({
          type:"im/updateStateFieldByCover",
          payload:{
            [key]:newArr
          }
        })
        this.isLoading = false;
      })
    })

  }

  componentDidMount(){
    this.setChatHistory().then( data =>{
      if(data.length){
        this.setCurrentIdServer(data[data.length - 1])
      }
    });
    Taro.getSystemInfo({
      success: (res) => {
        if (res.model.indexOf('iPhone X') > -1 || res.model.indexOf('iPhone 11') > -1) {
          this.setState({
            isIosHomeIndicator: true
          })
        }
      }
    })
  }
  componentWillUnmount(){
    const {
      globalData: {
        store: { dispatch, getState }
      }
    } = Taro.getApp();

    const {
      im: state,
      im: { nim }
    } = getState();

    let tempState = { ...state };
    let keys = Object.keys(tempState).filter(item => item.indexOf(this.propsKey) != -1);
    keys.forEach(item => {
      delete tempState[item]
    })
    tempState.historySub_newSession = [];
    tempState.currentSubChat = {};
    // 删除存在的历史记录--防止数据量过大报错
    dispatch({
      type: 'im/updateStateByReplace',
      state: { ...tempState },
      desc: 'update sessions'
    });
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

  getHistory = ()=>{
    let { currentSubChat } = this.props;
    this.pageParams.id = currentSubChat.im_id
    return new Promise((resolve,reject) => {
      getImHistory(this.pageParams).then(res => {
        this.pageParams.page_number += 1;
        if(res.code == 0){
          resolve(res.data);
        }else{
          reject(res)
        }
      })
    })
  }
  getAvatar = (val) => {
    let { currentSubChat } = this.props;
    let { from } = val;
    let { users = [] } = currentSubChat;
    for (let i = 0; i < users.length; i++) {
      let item = users[i];
      if (item.user_id == from) {
        return item.avatar;
      }
    }
    return "";
  }

  componentWillReceiveProps(nextProps){
    let { historySub_newSession, userUID } = nextProps;
    if (historySub_newSession.length) {
      let obj = historySub_newSession[historySub_newSession.length - 1];
      if (this.IsBottom || obj.from === userUID)
        this.setCurrentIdServer(obj);
      else if (!this.IsBottom && obj.from != userUID && (this.props.history_newSession.length != history_newSession.length)) {
        this.setState({
          newMsg: true
        })
      }
    }
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
  renderList = () => {
    let keys = [...Object.keys(this.props)];
    // console.log(keys)
    keys = keys.filter(item => item.indexOf(this.propsKey) != -1);
    return keys;
  }

  // 输入了艾特符号
  onPrefix = (val)=>{
    let {currentSubChat,userUID } = this.props;
    if(currentSubChat.users.filter(item => item.user_id != userUID).length >= 1)
    this.setState({
      showContacts:true
    })
  }
  // 关闭回调
  contactsClose = ()=>{
    // 动画完成后关闭
    setTimeout(()=>{
      this.setState({
        showContacts:false
      })
    },350)
  }
  // 选择了艾特别人
  selectContacts = (val) => {
    this.setState({
      selectedUser: val
    })
  }
  // 发送按钮
  onSend = ()=>{
    this.setState({
      selectedUser:""
    })
  }
  onScrolltoupper = ()=>{
    this.loadPrev();
  }
  // 加载下一页数据
  loadPrev = () => {
    if (!this.isLoading) {
      this.setState({
        loadPrev:true
      })
      this.isLoading = true;
      let keys = Object.keys(this.props).filter(item => item.indexOf(this.propsKey) != -1);
      let data = keys[keys.length - 1];
      this.setChatHistory().then(_ => {
        // console.log(_)
        // let current = this.props[data][this.props[data].length - 1 ];
        if(_.length){
          let current = _[_.length - 1]
          this.setCurrentIdServer(current);
        }
        this.setState({
          loadPrev:false
        })
      }).catch(err => {
          Taro.showToast({
            title: '没有更多数据了',
            icon: 'none',
            duration: 2000
          });
          this.setState({
            loadPrev:false
          })
      });
    }

  }
  onScroll = ()=>{
    this.IsBottom = false;
  }
  onScrollToLower = ()=>{
    this.IsBottom = true;
  }

  render(){
    let { currentSubChat ,isUserInputHeightChange,userUID} = this.props;
    let { isIosHomeIndicator,selectedUser ,showContacts,scrollIntoViewEleId,loadPrev} = this.state;
    return (
      <View className={styles.chatBox}>
        <ChatHeader onTapBoardName={this.tapName} currentProject={currentSubChat} hideSubList={true}/>
        <ScrollView
        className={[styles.wrapper, isIosHomeIndicator === false ? styles.maxHeight : styles.minHeight].join(" ")}
        scrollY
        enableBackToTop
        scrollIntoView={scrollIntoViewEleId}
        scrollWithAnimation={true}
        onScrolltoupper={this.onScrolltoupper}
        upperThreshold={5}
        onScroll={this.onScroll}
        onScrollToLower={this.onScrollToLower}
        >
          {loadPrev && <View className={styles.loadMoreChat}>加载中...</View>}
          <View
          className={styles.contentWrapper}
          style={{
            paddingBottom: isUserInputHeightChange
              ? isUserInputHeightChange + 'px'
              : '0px'
          }}>
            {this.renderList().map(mapkey => {
              return (
                <View key={mapkey}>
                  {this.props[mapkey].map((i, index, arr) => {
                    return (
                      <View className={styles.chatItemWrapper} key={i.time} id={'item_' + i.idServer}>
                        {this.isShouldShowTimestamp(index, arr) && (
                          <ChatItem type='timestamp' time={i.time} />
                        )}
                        <ChatItem
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
              )
            })}
          </View>
        </ScrollView>
        <View>
          <UserInput onPrefix={this.onPrefix} prefixUser={selectedUser} onSend={this.onSend} im_id={currentSubChat.im_id}/>
        </View>
        { showContacts && <Contacts onClose={this.contactsClose} users={currentSubChat.users.filter(item => item.user_id != userUID)} onSelect={this.selectContacts}/>}
      </View>
    )
  }
}
