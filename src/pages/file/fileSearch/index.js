import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import SearchBar from '../../../components/searchBar'


export default class nowOpen extends Component {
  config = {
    navigationBarTitleText: '文件查询'
  }
  state = {
    list:['水专施工一改','百富源项目施工管理图百富源项目施工管理图百富源项目施工管理图'],
    delBtnWidth:100
  }
  searchMenuClick = value => {
      console.log('sssssssssss', value)
  }

  deleteFile = e => {
    var txtStyle =  "margin-left:0px";
    console.log('sssssss',e.currentTarget.id)

    //更新列表的状态
    this.setState({
      txtStyle:txtStyle
    });
  }


  touchS  (e) {
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

  render() {
    const {list,txtStyle,currentTargetId} = this.state;
    return (
      <View className={`${indexStyles.index}`} >
        <SearchBar searchMenuClick={(value) => this.searchMenuClick(value)}/>
        <View className={indexStyles.placeView}></View>
        {
         list && list.map((value, key) => {
           return (
             <View className={indexStyles.fileContant} key={key}>
              <View className={indexStyles.fileItem} id={key} style={currentTargetId == key ? txtStyle : ''} onTouchStart={this.touchS} onTouchMove={this.touchM} onTouchEnd={this.touchE}>
                <Image className={indexStyles.fileItem_image}></Image>
                <View className={indexStyles.fileItem_Text}>{key}</View>
              </View>
              <View  className={indexStyles.fileItem_innerDelete} onClick={this.deleteFile} id={key}>删除</View>
             </View>
           )
         })
        }
      </View>
    )
  }
}

