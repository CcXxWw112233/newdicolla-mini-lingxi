import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { AtTag } from 'taro-ui'
import { connect } from '@tarojs/redux';
import { MultipleSelectionView } from '../../../multipleSelectionView'
import { isApiResponseOk, } from "../../../../utils/request";
import { TaskGroupView } from "../../../../components/tasksRelevant/taskGroupView";

@connect(({ tasks: { tasksDetailDatas = {}, }, }) => ({
    tasksDetailDatas,
}))
export default class index extends Component {
    state = {
        isTaskGroupViewShow:false, //任务分组
        groupList:[]
    }

    clickTagCell = () => {

        const { data = [], fieldValue, item_id, editAuth } = this.props
        const {groupList} = this.state
        if (!editAuth) {
            Taro.showToast({
                title: '您没有该项目的编辑权限',
                icon: 'none',
                duration: 2000
            })
            return;
        }
        if(groupList.length > 0) {
            this.setState({
                isTaskGroupViewShow: true
            })
        } else {
            Taro.showToast({
                title: '暂无任务分组可选',
                icon: 'none',
                duration: 2000
            })
        }

    }
     /**
     * 任务分组回调
     */
      onClickTaskGroup = currentTaskGroup => {
        const {groupList} = this.state;
        
        const { dispatch, data,tasksDetailDatas = {} } = this.props;
        const {list_ids = []} = tasksDetailDatas;
     
        
        typeof this.props.onClickAction == "function" &&
            this.props.onClickAction();
    }

    componentDidMount() {
        this.getTasksGroupList()
    }
     //获取任务分组列表
     getTasksGroupList = () => {
        let board_id = Taro.getStorageSync("tasks_detail_boardId");
        const { dispatch, data,tasksDetailDatas,list_ids} = this.props;
        // const {list_ids = []} = tasksDetailDatas;
        console.log(this.props.list_ids)
        Promise.resolve(
            dispatch({
                type: "tasks/getCardList",
                payload: {
                    board_id: board_id,
                },
            })
        ).then((res) => {
            if (isApiResponseOk(res)) {
                if (res.data && res.data.length > 0) {
                    this.setState({
                        groupList:res.data
                    })
                } else {
                }
            }
        });
    }

    
    render() {
        const { title, data = [], fieldValue, item_id } = this.props
        const { tasksDetailDatas = {}, boardId, editAuth } = this.props;
        const { list_ids=[] } = tasksDetailDatas;
        var {groupList = []} = this.state
        groupList = groupList.filter(item=>{
            return list_ids.indexOf(item.list_id) != -1
        })
        return (
            <View className={indexStyles.list_item} >

             
                <View className={indexStyles.list_left} onClick={this.clickTagCell}>

                    <View className={`${indexStyles.list_item_left_iconnext}`}>
                        <Text className={`${globalStyle.global_iconfont}`} style={{color:'#5FA6FF',fontSize:'24px'}}>&#xe8b3;</Text>
                    </View>

                    {/* <View className={indexStyles.list_item_name}>{title}</View> */}

                    <View className={indexStyles.tagCell_list_item_detail}>
                   
                   {
                       groupList && groupList.length > 0 ? (         

                            list_ids.map((tag, key) => {
                                const {  list_id, list_name, } = tag
                                return (
                                    <View key={key} className={indexStyles.tagCell_list_item}>
                                        <AtTag type='primary' customStyle={{
                                            color: `#FFFFFF`,
                                            backgroundColor: `#7C83A1`,
                                        }}>
                                            {list_name}
                                        </AtTag>
                                    </View>
                                )
                            })
                       ):(
                         <View className={indexStyles.placeText}>未选择</View>  
                       )
                   }    
                    </View>
                </View>
                {/* {
                    isTaskGroupViewShow ? (<TaskGroupView contentId={contentId} onClickAction={(groupName)=>this.onClickTaskGroup(groupName)} tag={type} title={title} listId={list_id} currentName={data.name} tasksGroupList={tasksGroupList}></TaskGroupView>):('')
                }  */}
            </View>
        )
    }
}
