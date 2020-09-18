import Taro, { Component } from '@tarojs/taro'
import { View, Text, RichText } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../gloalSet/styles/globalStyles.scss'
import index from '../../../pages/taksDetails/components/CommentBox';
import Avatar from '../../avatar';
import { connect } from '@tarojs/redux';
import { AtDrawer } from 'taro-ui'

@connect(({ tasks: { tasksDetailDatas = {}, }, }) => ({
    tasksDetailDatas,
}))
export default class ProjectNameCell extends Component {

    gotoChangeChoiceInfoPage = (value) => {

        const { title, name, } = value
        const { dispatch, tasksDetailDatas = {} } = this.props
        const { list_id } = tasksDetailDatas

        let board_id = Taro.getStorageSync('tasks_detail_boardId')
        let contentId = Taro.getStorageSync('tasks_detail_contentId')

        if (title === '描述') {
            // Taro.navigateTo({
            //     url: `../../pages/fillDescribe/index?describeInfo=${name}`
            // })
            Taro.navigateTo({
                url: '../../pages/native/native'
            })
        } else {
            if (title === '任务分组') {
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

            } else if (title === '执行人') {
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
            else if (title === '里程碑') {

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
            // Taro.navigateTo({
            //     url: `../../pages/choiceProject/index?title=${title}`
            // })
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
        const name = this.props.name || ''

        let icon
        let executors
        if (title === '任务分组') {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe6a8;</Text>
        } else if (title === '项目') {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe6a7;</Text>
        } else if (title === '里程碑') {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe6a9;</Text>
        } else if (title === '负责人') {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe7ae;</Text>
            executors = this.props.executors || []
        } else if (title === '描述') {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe7f5;
            </Text>
        }

        return (
            <View className={indexStyles.list_item} onClick={this.gotoChangeChoiceInfoPage.bind(this, { title: title, name: name, })}>
                {/* <View className={indexStyles.list_item} onClick={this.clickProjectNameCell}> */}
                <View className={`${indexStyles.list_item_left_iconnext}`}>
                    {icon}
                </View>

                <View className={indexStyles.list_item_name}>{title}</View>

                <View className={indexStyles.right_style}>
                    <View className={indexStyles.right_centre_style}>
                        <View>
                            {title === '负责人' ? (
                                <View className={indexStyles.executors_list_item_detail}>
                                    <View className={`${indexStyles.avata_area}`}>
                                        <Avatar avartarTotal={'multiple'} userList={executors} />
                                    </View>
                                </View>
                            ) : (
                                    <View className={indexStyles.list_item_detail}>
                                        {
                                            title === "描述" ? (<View><RichText className='text' nodes={name} /></View>) : (<View>{name.name}</View>)
                                        }
                                    </View>
                                )}
                        </View>
                    </View>
                    {
                        title != '项目' ? (
                            title === '任务分组' ? (<View className={`${indexStyles.list_item_iconnext}`}>
                                <Text className={`${globalStyle.global_iconfont}`}>&#xe654;</Text>
                            </View>) : (
                                    <View className={`${indexStyles.list_item_iconnext}`} onClick={this.deleteCardProperty}>
                                        <Text className={`${globalStyle.global_iconfont}`}>&#xe7fc;</Text>
                                    </View>
                                )
                        ) : <View></View>
                    }
                </View>
            </View>
        )
    }
}
