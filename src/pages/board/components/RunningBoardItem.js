import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'
import Avatar from '../../../components/avatar'
import { RESPONSE_DATA_CODE_DATA } from '../../../gloalSet/js/constant'
import {getOrgName} from "../../../utils/basicFunction";
import { connect } from '@tarojs/redux'

@connect(({ my: { org_list }, im: { allBoardList, sessionlist } }) => ({
  org_list, allBoardList, sessionlist
}))
class RuningBoardItem extends Component {

  componentWillReceiveProps (nextProps) {

  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  gotoBoardDetail = (board_id) => {
    Taro.navigateTo({
      url: `/pages/boardDetail/index?boardId=${board_id}`
    })
  }

  //显示红点
  isBoardShouldShowNewMsgDot = (board_id = '') => {
    //需要拿到 model - im 中的:
    //allBoardList
    //sessionlist

    //1. 拿到当前项目的 im info object
    let currentBoardImInfo = allBoardList.find(i => i.board_id === board_id);
    if (!currentBoardImInfo) return false;

    //2. 拿到当前项目的 im_id 及其所有子群的 im_id
    const currentBoardImIdAndChildsId = [currentBoardImInfo.im_id].concat(
      currentBoardImInfo.childs
        ? currentBoardImInfo.childs.map(i => i.im_id)
        : []
    );

    //3. 所有属于当前项目及其子群的对话中，是否有未读的消息，
    // 如果有，返回 true,
    // 如果没有，返回 false

    return sessionlist
      .filter(i => currentBoardImIdAndChildsId.find(id => id === i.to))
      .some(i => i.unread);
  };


  render () {
    const starlist = []
    const tagList = []
    const { board_item = {}, org_list } = this.props
    const { board_id, board_name, relize_quantity, residue_quantity, org_id } = board_item
    const users = board_item[RESPONSE_DATA_CODE_DATA] || []
    return (
      <View >
        <View className={`${globalStyles.global_card_out} ${indexStyles.card_content}`} onClick={this.gotoBoardDetail.bind(this,board_id)}>
          <View className={`${indexStyles.card_content_top}`}>
            <Text className={`${indexStyles.card_title}`}>{board_name}</Text>
            <Text className={`${indexStyles.organize}`}>{getOrgName({org_id, org_list})}</Text>
            <Text className={`${indexStyles.star_list}`}>
              {starlist.map((value, key) => {
                return (
                  <Text key={key} className={`${globalStyles.global_iconfont} ${indexStyles.star}`}>&#xe64b;</Text>
                )
              })}
            </Text>
          </View>
          <View  className={`${indexStyles.card_content_middle}`}>
            <View  className={`${indexStyles.card_content_middle_left}`}>
              <View  className={`${indexStyles.avata_area}`}>
                <Avatar avartarTotal={'multiple'} userList={users}/>
              </View>
            </View>
            <View  className={`${indexStyles.card_content_middle_right}`}>
              <View  className={`${indexStyles.task_1}`}>剩余任务 <Text>{residue_quantity}</Text></View>
              <View  className={`${indexStyles.task_2}`}>已完成  <Text>{relize_quantity || 0}</Text></View>
            </View>
          </View>
          <View  className={`${indexStyles.card_content_bott}`}>
            <View  className={`${indexStyles.taglist}`}>
              {tagList.map((value, key) => {
                const rgb = '123,104,238'
                return (
                  <Text className='tag'
                        className={`${indexStyles.tag}`}
                        key={key}
                        style={{color: `rgba(${rgb},1)`, backgroundColor: `rgba(${rgb},.4)`, border: `1px solid rgba(${rgb},1)`}}
                  >{'标签名'}</Text>
                )
              })}
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default RuningBoardItem
