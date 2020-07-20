import Taro, { Component } from '@tarojs/taro'
import { View, Text, RichText } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../gloalSet/styles/globalStyles.scss'
import index from '../../../pages/taksDetails/components/CommentBox';
import Avatar from '../../avatar';
import { connect } from '@tarojs/redux';

@connect(({ ProjectNameCell }) => ({
    ProjectNameCell
}))
export default class ProjectNameCell extends Component {

    gotoChangeChoiceInfoPage = (value) => {
        const { title, name } = value
        const { dispatch, boardId } = this.props

        if (title === '描述') {
            Taro.navigateTo({
                url: `../../pages/fillDescribe/index?describeInfo=${name}`
            })
        } else {
            if (title === '项目') {
                dispatch({
                    type: 'board/getBoardList',
                    payload: {
                    },
                })
            } else if (title === '任务分组') {
                dispatch({
                    type: 'tasks/getTaskGroupList',
                    payload: {
                        board_id: boardId,
                        type: 2,
                        arrange_type: 1,
                    },
                })
            } else if (title === '执行人') {
                dispatch({
                    type: 'tasks/getTaskExecutorsList',
                    payload: {
                        board_id: boardId,
                    },
                })
            }
            else if (title === '里程碑') {
                dispatch({
                    type: 'tasks/getTaskMilestoneList',
                    payload: {
                        board_id: boardId,
                    },
                })
            }
            Taro.navigateTo({
                url: `../../pages/choiceProject/index?title=${title}`
            })
        }
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
        } else if (title === '执行人') {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe7ae;</Text>
            executors = this.props.executors || []
        } else if (title === '描述') {
            icon = <Text className={`${globalStyle.global_iconfont}`}>&#xe7f5;
            </Text>
        }

        return (
            // <View className={indexStyles.list_item} onClick={this.gotoChangeChoiceInfoPage.bind(this, { title: title, name: name })}>
            <View className={indexStyles.list_item}>
                <View className={`${indexStyles.list_item_left_iconnext}`}>
                    {icon}
                </View>

                <View className={indexStyles.list_item_name}>{title}</View>

                <View className={indexStyles.right_style}>
                    <View className={indexStyles.right_content_style}>
                        <View className={indexStyles.right_centre_style}>
                            <View>
                                {title === '执行人' ? (
                                    <View className={indexStyles.executors_list_item_detail}>
                                        <View className={`${indexStyles.avata_area}`}>
                                            <Avatar avartarTotal={'multiple'} userList={executors} />
                                        </View>
                                    </View>
                                ) : (
                                        <View className={indexStyles.list_item_detail}>
                                            {
                                                title === "描述" ? (<View><RichText className='text' nodes={name} /></View>) : (<View>{name}</View>)
                                            }
                                        </View>
                                    )}
                            </View>
                        </View>
                        {/* <View className={`${indexStyles.list_item_iconnext}`}>
                            <Text className={`${globalStyle.global_iconfont}`}>&#xe654;</Text>
                        </View> */}
                    </View>
                </View>
            </View>
        )
    }
}
