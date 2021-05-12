import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import jumpPlaceImage from '../../asset/meeting/jumpPlaceImage.jpg'
import { connect } from "@tarojs/redux";
import { isApiResponseOk, } from "../../utils/request";
import MilestoneDetailTop from "./milestoneDetailTop/index";
import RelevanceTask from "./relevanceTask/index";
import SubmileStone from "./submileStone/index";





@connect(({ milestone: { mileStone_detail } }) => ({
    mileStone_detail
}))
export default class milestoneDetail extends Component {
  config = {
    navigationBarTitleText: '里程碑详情',
  }
  state = {}
 
  componentWillMount() {
    const {  boardId, contentId } = this.$router.params;

   this.getMileStoneDetail(contentId)
   this.setState({
    contentId:contentId
   })
  }

  getMileStoneDetail(contentId) {
    const {dispatch} = this.props;
    if(!contentId) {
        contentId = this.state.contentId
    }
    var that = this;
    Promise.resolve(
        dispatch({
            type: 'milestone/getMilestoneDetail',
            payload: {
                id: contentId,
            },
        })
    ).then((res) => {
    });
  }

  /**
   * 修改任务状态
   * @param {*} timeInfo 
   * @param {*} type 
   */
  tasksDetailsRealizeStatus = (timeInfo) => {
    const { dispatch } = this.props;
    let isRealize;
    if (timeInfo.isRealize === "1") {
        isRealize = 0;
    } else if (timeInfo.isRealize === "0") {
        isRealize = 1;
    }   
    dispatch({
        type: "tasks/setTasksRealize",
        payload: {
            card_id: timeInfo.cardId,
            is_realize: isRealize,
            board_id:timeInfo.board_id
        },
    }).then(()=>{
        this.getMileStoneDetail()

    })
    
    
};
/**
 * 修改里程碑状态
 */
mileStoneRealizeStatus(info) {
    const {dispatch} = this.props
        dispatch({
            type: "milestone/updateMilestone",
            payload: {
                id:info.id,
                is_finished:info.is_finished,
                board_id:info.board_id
            },
        }).then(()=>{
            this.getMileStoneDetail()
        })
    }
    
  render() {
    const {mileStone_detail = {}} = this.props
    const {board_id,board_name,content_list=[],id,parent_id,is_finished,progress_percent,chird_list=[],deadline} = mileStone_detail;
    const name = mileStone_detail['name'];
    var ishasChild = content_list.length > 0 && chird_list.length > 0;
    var isHasTaskNoFinish =  content_list.length > 0 && content_list[0].data.some(item=>{
           return item.is_completed == '0'
        })
    var isHasTaskFinish =  content_list.length > 0 && content_list[0].data.some(item=>{
           return item.is_completed == '1'
    })
    var isAllChirdNoFinish =  content_list.length > 0 && content_list[0].data.some(item=>{
           return item.is_completed == '0'
    })
    var isAllChirdFinish =  content_list.length > 0 && content_list[0].data.some(item=>{
           return item.is_completed == '1'
    })
    var isHasNoFinish = isAllChirdNoFinish && isHasTaskNoFinish;
    var isHasFinish = isHasTaskFinish && isAllChirdFinish;
    return (
        <View>
            <View className={indexStyles.topbg_View}></View>
            <ScrollView className={indexStyles.tasks_contant} 
                scrollY
                scrollWithAnimation
            >
                <MilestoneDetailTop ishasChild={ishasChild} isHasNoFinish={isHasNoFinish} isHasFinish={isHasFinish} deadline={deadline} mileStoneRealizeStatus={(info)=>this.mileStoneRealizeStatus(info)} board_id={board_id} id={id}  is_finished = {is_finished} name={name} content_list={content_list} chird_list={chird_list} progress_percent = {progress_percent}></MilestoneDetailTop>
                <RelevanceTask content_list={content_list} board_id={board_id}   tasksDetailsRealizeStatus={(timeInfo) =>this.tasksDetailsRealizeStatus(timeInfo)}></RelevanceTask>
                <SubmileStone chird_list={chird_list} board_id={board_id}> </SubmileStone>
                <View className={indexStyles.bottomPlace_View}></View>
            </ScrollView>

        </View>
    )
  }
}
