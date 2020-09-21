import Taro, { Component } from '@tarojs/taro'
import { View, Text, RichText } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../gloalSet/styles/globalStyles.scss'
import index from '../../../pages/taksDetails/components/CommentBox';
import Avatar from '../../avatar';
import { connect } from '@tarojs/redux';

@connect(({ tasks: { tasksDetailDatas = {}, }, }) => ({
    tasksDetailDatas,
}))
export default class ProjectNameCell extends Component {

    gotoChangeChoiceInfoPage = (value) => {

        const { type, items, field_value, } = value
        const { dispatch, tasksDetailDatas = {} } = this.props
        const { list_id, org_id, } = tasksDetailDatas

        let board_id = Taro.getStorageSync('tasks_detail_boardId')
        let contentId = Taro.getStorageSync('tasks_detail_contentId')

        if (type === '2') {  //任务分组 
            Promise.resolve(
                dispatch({
                    type: 'tasks/getCardList',
                    payload: {
                        board_id: board_id,
                    },
                })
            ).then(res => {
                Taro.navigateTo({
                    url: `../../pages/tasksGroup/index?contentId=${contentId}&listId=${list_id}`
                })
            })

        } else if (type === '3') {  //执行人
            Promise.resolve(
                dispatch({
                    type: 'tasks/getTaskExecutorsList',
                    payload: {
                        board_id: board_id,
                    },
                })
            ).then(res => {
                Taro.navigateTo({
                    url: `../../pages/executorsList/index?contentId=${contentId}`
                })
            })
        }
        else if (type === '4') { //里程碑

            const { milestoneId } = this.props

            Promise.resolve(
                dispatch({
                    type: 'tasks/getTaskMilestoneList',
                    payload: {
                        board_id: board_id,
                    },
                })
            ).then(res => {
                Taro.navigateTo({
                    url: `../../pages/milestoneList/index?contentId=${contentId}&milestoneId=${milestoneId}`
                })
            })
        }
        else if (type === '5') {  //字段

            Promise.resolve(
                dispatch({
                    type: 'tasks/getBoardFieldGroupList',
                    payload: {
                        org_id: org_id,
                    },
                })
            ).then(res => {
                Taro.navigateTo({
                    url: `../../pages/fieldSelection/index?items=${items}&field_value=${field_value}`
                })
            })
        }
        else if (type === '6') {  //单选

        }
        else if (type === '8') {  //日期

        }
        else if (type === '9') {  //文本

        }
        else if (type === '10') {  //数字

        }
    }

    clickProjectNameCell = () => {
        this.props.clickProjectNameCell();
    }

    deleteCardProperty = () => {

        const { dispatch, propertyId, cardId } = this.props

        dispatch({
            type: 'tasks/deleteCardProperty',
            payload: {
                card_id: cardId,
                property_id: propertyId,
            },
        })
    }

    render() {
        const title = this.props.title || ''
        const data = this.props.data || ''
        const type = this.props.type || ''
        const items = this.props.items || []
        const field_value = this.props.field_value || ''


        //左边icon
        let icon
        if (type === '1') {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe6a8;</Text>
        } else if (type === '2') {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe6a7;</Text>
        } else if (type === '3') {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe6a9;</Text>
        } else if (type === '4') {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe7ae;</Text>
        } else if (type === '5') {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe7be;</Text>
        } else if (type === '6') {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe7ba;</Text>
        } else if (type === '7') {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe7b8;</Text>
        } else if (type === '8') {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe7c1;</Text>
        } else if (type === '9') {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe7c1;</Text>
        } else if (type === '10') {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe7c0;</Text>
        }

        //右边icon
        let rightIcon
        if (type === '2' || type === '5') {  //向右箭头
            rightIcon = <Text className={`${globalStyle.global_iconfont}`}>&#xe654;</Text>
        }
        else if (type === '3' || type === '4' || type === '6' || type === '7' || type === '8' || type === '9' || type === '10') {  // 叉×
            rightIcon = <Text className={`${globalStyle.global_iconfont}`}>&#xe7fc;</Text>
        }

        return (

            <View className={indexStyles.list_item} onClick={this.gotoChangeChoiceInfoPage.bind(this, { data: data, type: type, items: items, field_value: field_value })}>


                <View className={`${indexStyles.list_item_left_iconnext}`}>
                    {icon}
                </View>



                <View className={indexStyles.list_item_name}>{title}</View>



                <View className={indexStyles.right_style}>
                    <View className={indexStyles.right_centre_style}>
                        <View>
                            {type === '3' ? (
                                <View className={indexStyles.executors_list_item_detail}>
                                    <View className={`${indexStyles.avata_area}`}>
                                        <Avatar avartarTotal={'multiple'} userList={data} />
                                    </View>
                                </View>
                            ) : (
                                    <View className={indexStyles.list_item_detail}>
                                        <View>{data.name}</View>
                                    </View>
                                )}
                        </View>
                    </View>



                    <View className={`${indexStyles.list_item_iconnext}`} onClick={this.deleteCardProperty}>
                        {rightIcon}
                    </View>


                </View>

            </View>
        )
    }
}
