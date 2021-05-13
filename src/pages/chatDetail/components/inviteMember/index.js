import Taro, { Component, Canvas } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { View,ScrollView,Image } from "@tarojs/components";
import styles from "./index.scss";
import globalStyle from './../../../../gloalSet/styles/globalStyles.scss';
import { getAcatarlist,invitationMenberIntoOrg,invitationMenberIntoPrejoct } from '../../../../services/board/index'
import { isApiResponseOk } from "../../../../utils/request";
import defaultPhoto from "./../../../../asset/chat/defaultPhoto.png";

@connect(
  ({
    chat: { },
    file: { isShowFileComment },
    im: {
      allBoardList,
      sessionlist,
      currentBoardId,
      currentBoard,
      currentBoardImValid,
      rawMessageList,
      currentGroup,
      userUID,
      currentGroupSessionList,
      currentBoardDetail
    }
  }) => {
    return {
      isShowFileComment,
      allBoardList,
      sessionlist,
      currentBoardId,
      currentBoard,
      rawMessageList,
      currentBoardImValid,
      currentGroup,
      userUID,
      currentGroupSessionList,
      currentBoardDetail
    };
  },
 )
class Chat extends Component {
   config = {
        navigationBarTitleText: '邀请成员'
    }

  constructor(props) {
  }

  state = {
    isShowDeleteIcon:false,
    selectAcatarlist:[]
  };
  componentDidMount() {

  }
  /**
   * 校验头像网址
   */
  isValidImgUrl = url => {
    return /^http[s]?:/.test(url);
  };
  // 确认检索
  searchClick = e => {
    this.allAcatarlist(e.detail.value,true)
  }
// 监控是否输入
startPrint = e => {
  if(e.detail.value.length > 0) {
  
    this.allAcatarlist(e.detail.value)
    this.setState({
      isShowDeleteIcon:true,
    })
  } else {
    this.setState({
      isShowDeleteIcon:false,
    })
  }
}
/**
 * 模糊检索用户
 * @param {*} key 
 */
allAcatarlist (key,isshowToast) {
  const {currentBoardDetail = {}} = this.props;
  const {org_id,board_id} = currentBoardDetail;
  var param= {
    associate_param:key,
    _organization_id:org_id,
    type:1
  }
  getAcatarlist(param).then(res=>{
    if (isApiResponseOk(res)) {
      if(res.data) {
        this.setState({
          allAcatarlist:res.data
        })
      } else {
        if (isshowToast) {
          Taro.showToast({
            title: '没检索到相关成员',
            icon: 'none',
            duration: 2000
          }) 
        }
      }
    }
  })
}

// 选择检索到的
addacatarItem = ( item)=>{
  const {currentBoardDetail = {},dispatch} = this.props;
  var users = currentBoardDetail.users;
  var {selectAcatarlist} = this.state;
  var isExist = users.some(value => {
    return  value.mobile == item.mobile;
  }) 
  if(isExist) {
    Taro.showToast({
      title: '该成员已在项目里',
      icon: 'none',
      duration: 2000
    })    
    this.formReset()
    return;
  }
  var isfind = selectAcatarlist.some(value => {
    return  value.mobile == item.mobile;
  }) 
  if(isfind) {
    this.formReset()
    return;
  } 
  var acatar = item;
  item['image'] = acatar['avatar'],
  item['value'] = acatar['value'],
  selectAcatarlist.push(item);
  this.setState({
    selectAcatarlist:selectAcatarlist,
  })
  this.formReset()
}
//确认邀请
acatarInvate(){
  const {currentBoardDetail = {},dispatch} = this.props;
  const {org_id,board_id} = currentBoardDetail;
  var {selectAcatarlist} = this.state;
  if(selectAcatarlist.length > 0) {
    var users = selectAcatarlist.map(item=>{
      return item.id
    })
    var userList = selectAcatarlist.map(item=>{
      return {
        avatar    :item.avatar,
        full_name : item.full_name,
        name: item.name,
        user_id:item.id,
        mobile: item.mobile,
        we_chat:"",
      }
    })

    var param = {
       type: "1",
       users: users,
       _organization_id: org_id
    }
    invitationMenberIntoOrg(param).then(res=>{
      if (isApiResponseOk(res)) {
        var params = {
          id: board_id,
          role_id: res.data.role_id,
          type: "1",
          users: res.data.users,
        }
        invitationMenberIntoPrejoct(params).then(res=>{
          if (isApiResponseOk(res)) {
            var currentGroup = currentBoardDetail;
            var users = currentGroup.users;
            currentGroup["users"] = users.concat(userList);
            dispatch({
              type: "im/updateStateFieldByCover",
              payload: {
                currentBoardDetail: currentGroup
              }
            })
            Taro.navigateBack({
                  delta: 1
            })   
          }
        })
      } else {
        Taro.showToast({
          title: '邀请失败',
          icon: 'none',
          duration: 2000
        })    
      }
    })
  } else {
    Taro.showToast({
      title: '请先检索要邀请的成员',
      icon: 'none',
      duration: 2000
    })    
  }
  
}
// 取消
formReset = e => {
  this.setState({
    isShowDeleteIcon:false,
    inputValue:'',
    allAcatarlist:[]
  })
}
  render() {
    const {inputValue,isShowDeleteIcon,allAcatarlist=[],selectAcatarlist} = this.state
    const canAdd =  selectAcatarlist && selectAcatarlist.length > 0;
    return (
      <View  className={styles.wrapper}>
        <Form  className={styles.searchForm} onReset={this.formReset}>
            <View className={styles.content_View}>
              <Input placeholder='请输入手机号' value={inputValue} placeholderClass={styles.searchBarInput_placeholderStyle} onInput={this.startPrint} className={styles.searchBarInput} onConfirm={this.searchClick}></Input>
              {
                isShowDeleteIcon && <Button className={`${globalStyle.global_iconfont} ${styles.deleteIcon}`} formType='reset'  >&#xe639;</Button>
              }
            </View>
            <View className={styles.line}></View>
        </Form>
        <View className={`${styles.selectAcatarlist}`}>

        {selectAcatarlist && selectAcatarlist.map((item, index) => {
          return (
            <View
              key={item.id}
              className={`${styles.avatarItemWrapper} ${(index + 1) % 5 === 0
                ? styles.avatarItemWrapperWithNoMargin
                : ''
                }`}
            >
                {this.isValidImgUrl(item.avatar) ?  (
                      <Image
                        className={styles.avatarItemAvatar}
                        src={item.avatar}
                        mode='aspectFill'
                      />
                ) : (
                  <View className={`${globalStyle.global_iconfont} ${styles.content_avatar}`}>&#xe878;</View>
                  )
                }
                <Text className={styles.avatarItemName}>
                    {item.name || item.mobile}
                </Text>
        
            </View>
          );
        })}
       </View>
        {
          allAcatarlist && allAcatarlist.length > 0 && 
          <ScrollView  className={styles.scrollView}
          scrollY
          scrollWithAnimation>
            {
              allAcatarlist.map((item,key)=> {
                return (
                  <View className={styles.acatar_item_View} onClick={this.addacatarItem.bind(this,item)}>
                     {this.isValidImgUrl(item.avatar) ?  (
                      <Image
                        className={styles.acatar_item_image}
                        src={item.avatar}
                        mode='aspectFill'
                      />
                ) : (
                  <View className={`${globalStyle.global_iconfont} ${styles.acatar_item_image}`}>&#xe878;</View>
                  )
                }
                {/* <Text className={styles.avatarItemName}> */}
                    {item.name} 
                {/* </Text> */}
                    {/* <Image className={styles.acatar_item_image} src={item.avatar}></Image>
                    {item.nickname} */}
                  </View>
                )
              })
            }
          
          </ScrollView> }
        <View className={`${styles.acatar_invite_View} ${canAdd ? '':styles.acatar_invite_unuse_View}`} onClick={this.acatarInvate}>发出邀请</View>
      </View>
    );
  }
}

export default Chat;
