import Taro, { Component } from '@tarojs/taro'
import { View, Text, RichText } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../gloalSet/styles/globalStyles.scss'
import index from '../../../pages/taksDetails/components/CommentBox';
import Avatar from '../../avatar';
import { connect } from '@tarojs/redux';

@connect(({ tasks: { tasksDetailDatas = {}, properties_list = [], milestone_list = [], group_list = [], }, }) => ({
    tasksDetailDatas, properties_list, milestone_list, group_list,
}))
export default class ProjectNameCell extends Component {

    state = {
        isFieldSelectionClick: true,
        isTasksGroupClick: true,
        isExecutorsListClick: true,
        isMilestoneListClick: true,
    }

    gotoChangeChoiceInfoPage = (value) => {

        const { type, items, field_value, field_item_id, item_id, } = value
        const { dispatch, tasksDetailDatas = {}, data, cardId, } = this.props
        const { list_id, org_id, fields, } = tasksDetailDatas
        const { isFieldSelectionClick, isTasksGroupClick, isExecutorsListClick, isMilestoneListClick, } = this.state

        let board_id = Taro.getStorageSync('tasks_detail_boardId')
        let contentId = Taro.getStorageSync('tasks_detail_contentId')


        if (type === '2') {  //任务分组 
            if (isTasksGroupClick) {
                this.setState({
                    isTasksGroupClick: false,
                })
                Promise.resolve(
                    dispatch({
                        type: 'tasks/getCardList',
                        payload: {
                            board_id: board_id,
                        },
                    })
                ).then(res => {
                    const { group_list = [] } = this.props
                    if (group_list.length > 0) {

                        Taro.navigateTo({
                            url: `../../pages/tasksGroup/index?contentId=${contentId}&listId=${list_id}`
                        })
                    }
                })

                const that = this
                setTimeout(function () {
                    that.setState({
                        isTasksGroupClick: true
                    })
                }, 1500);
            }
        } else if (type === '3') {  //执行人
            if (isExecutorsListClick) {
                this.setState({
                    isExecutorsListClick: false,
                })
                Promise.resolve(
                    dispatch({
                        type: 'tasks/getTaskExecutorsList',
                        payload: {
                            board_id: board_id,
                        },
                    })
                ).then(res => {
                    Taro.navigateTo({
                        url: `../../pages/executorsList/index?contentId=${contentId}&executors=${JSON.stringify(data)}`
                    })
                })

                const that = this
                setTimeout(function () {
                    that.setState({
                        isExecutorsListClick: true
                    })
                }, 1500);
            }
        }
        else if (type === '4') { //里程碑
            if (isMilestoneListClick) {
                this.setState({
                    isMilestoneListClick: false,
                })
                Promise.resolve(
                    dispatch({
                        type: 'tasks/getTaskMilestoneList',
                        payload: {
                            board_id: board_id,
                        },
                    })
                ).then(res => {

                    const { milestone_list = [], } = this.props
                    if (milestone_list.length > 0) {

                        Taro.navigateTo({
                            url: `../../pages/milestoneList/index?contentId=${contentId}&milestoneId=${data.id}`
                        })
                    }
                })

                const that = this
                setTimeout(function () {
                    that.setState({
                        isMilestoneListClick: true
                    })
                }, 1500);
            }
        }
        else if (type === '5') {  //字段

            if (isFieldSelectionClick) {
                this.setState({
                    isFieldSelectionClick: false,
                })

                Promise.resolve(
                    dispatch({
                        type: 'tasks/getBoardFieldGroupList',
                        payload: {
                            org_id: org_id,
                        },
                    })
                ).then(res => {
                    Taro.navigateTo({
                        url: `../../pages/fieldSelection/index?items=${items}&fields=${JSON.stringify(fields)}&card_id=${cardId}`
                    })
                })

                const that = this
                setTimeout(function () {
                    that.setState({
                        isFieldSelectionClick: true
                    })
                }, 1500);
            }

        }
        else if (type === '6') {  //单选
            Taro.navigateTo({
                url: `../../pages/singleChoice/index?items=${JSON.stringify(items)}&field_value=${field_value}&field_item_id=${field_item_id}`
            })
        }
        else if (type === '8') {  //日期

            Taro.navigateTo({
                url: `../../pages/dateField/index?field_value=${field_value}&item_id=${item_id}`
            })
        }
        else if (type === '9') {  //数字

            Taro.navigateTo({
                url: `../../pages/textField/index?field_value=${field_value}&item_id=${item_id}&type=${'number'}`
            })
        }
        else if (type === '10') {  //文本

            Taro.navigateTo({
                url: `../../pages/textField/index?field_value=${field_value}&item_id=${item_id}&type=${'text'}`
            })
        }
    }

    deleteCardProperty = (type, item_id, propertyId) => {
        const { dispatch, cardId, } = this.props

        if (type === '6' || type === '8' || type === '9' || type === '10') {

            dispatch({
                type: 'tasks/deleteBoardFieldRelation',
                payload: {
                    id: item_id,
                    callBack: this.deleteBoardFieldRelation(item_id),
                },
            })
        }

        if (type === '3' || type === '4') {

            dispatch({
                type: 'tasks/deleteCardProperty',
                payload: {
                    property_id: propertyId,
                    card_id: cardId,
                    callBack: this.deleteTasksFieldRelation(propertyId),
                },
            })
        }
    }

    deleteTasksFieldRelation = (propertyId) => {

        const { dispatch, tasksDetailDatas = {}, properties_list = [], } = this.props
        const { properties = [], } = tasksDetailDatas

        let new_array = []
        properties.forEach(element => {
            console.log(element.id, propertyId, 'ssssssssss');
            if (element.id !== propertyId) {
                new_array.push(element)
            }
        });

        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                tasksDetailDatas: {
                    ...tasksDetailDatas,
                    ...{ properties: new_array },
                }
            }
        })
        console.log(new_array, 'new_array========', properties);
        // typeof this.props.onLoadTasksDetail == 'function' && this.props.onLoadTasksDetail();

        // dispatch({
        //     type: 'tasks/updateDatas',
        //     payload: {
        //         ...properties_list,
        //     }
        // })
    }

    deleteBoardFieldRelation = (item_id) => {
        const { dispatch, tasksDetailDatas, } = this.props
        const { fields = [], } = tasksDetailDatas

        let new_array = []
        fields.forEach(element => {

            if (element.id !== item_id) {
                new_array.push(element)
            }
        });

        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                tasksDetailDatas: {
                    ...tasksDetailDatas,
                    ...{ fields: new_array },
                }
            }
        })
    }

    render() {

        const title = this.props.title || ''
        const data = this.props.data || ''
        const type = this.props.type || ''
        const items = this.props.items || []
        const field_value = this.props.field_value || ''
        const field_item_id = this.props.field_item_id || ''
        const item_id = this.props.item_id || ''
        const propertyId = this.props.propertyId || ''


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
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe63e;</Text>
        } else if (type === '9') {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe7c0;</Text>
        } else if (type === '10') {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe7c1;</Text>
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

            <View className={indexStyles.list_item} >

                <View className={indexStyles.list_left} onClick={this.gotoChangeChoiceInfoPage.bind(this, { data: data, type: type, items: items, field_value: field_value, field_item_id: field_item_id, item_id: item_id })}>

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

                    </View>

                </View>

                <View className={`${indexStyles.list_item_iconnext}`} onClick={() => this.deleteCardProperty(type, item_id, propertyId,)}>
                    {rightIcon}
                </View>

            </View>
        )
    }
}
