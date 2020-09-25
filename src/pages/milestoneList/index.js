import Taro, { Component } from '@tarojs/taro'
import { View, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'

@connect(({
    tasks: { milestone_list = [], tasksDetailDatas, },
}) => ({
    milestone_list, tasksDetailDatas,
}))
export default class milestoneList extends Component {
    config = {
        navigationBarTitleText: '里程碑'
    }

    constructor() {
        super(...arguments)
        this.state = {
            card_id: '',
            current_select_milestone_id: '',  //当前关联选中里程碑id
            current_select_milestone_name: '',  //当前关联选中里程碑name
        }
    }

    componentDidMount() {

        const { contentId, milestoneId } = this.$router.params

        this.setState({
            card_id: contentId,
            current_select_milestone_id: milestoneId,
        })
    }

    selectMilestone = (value, name) => {

        const { dispatch } = this.props
        const { current_select_milestone_id, card_id } = this.state

        console.log(current_select_milestone_id, 'value=======', value);

        if (current_select_milestone_id == value) { //删除关联里程碑
            debugger
            this.setState({
                current_select_milestone_id: '',
                current_select_milestone_name: '',
            })

            dispatch({
                type: 'tasks/deleteAppRelaMiletones',
                payload: {
                    id: value,
                    rela_id: card_id,
                    callBack: this.deleteAppRelaMiletones(),
                },
            })
        }
        else {  //添加关联里程碑

            if (current_select_milestone_id == '' || current_select_milestone_id == 'undefined' || current_select_milestone_id) {
                debugger
                dispatch({
                    type: 'tasks/boardAppRelaMiletones',
                    payload: {
                        id: value,
                        origin_type: '0',
                        rela_id: card_id,
                        callBack: this.boardAppRelaMiletones(name),
                    },
                })
            } else {
                debugger
                //先删除, 再关联
                Promise.resolve(
                    dispatch({
                        type: 'tasks/deleteAppRelaMiletones',
                        payload: {
                            id: current_select_milestone_id,
                            rela_id: card_id,
                        },
                    })
                ).then(res => {

                    this.setState({
                        current_select_milestone_id: value,
                        current_select_milestone_name: name,
                    })

                    dispatch({
                        type: 'tasks/boardAppRelaMiletones',
                        payload: {
                            id: value,
                            origin_type: '0',
                            rela_id: card_id,
                            callBack: this.boardAppRelaMiletones(name),
                        },
                    })
                })

                this.setState({
                    current_select_milestone_id: value,
                    current_select_milestone_name: name,
                })
            }
        }
    }

    deleteAppRelaMiletones = () => {

        const { dispatch, tasksDetailDatas, } = this.props
        const { properties = [] } = tasksDetailDatas

        properties.forEach(item => {
            if (item['code'] === 'MILESTONE') {
                item.data = {};
            }
        })

        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                tasksDetailDatas: {
                    ...tasksDetailDatas,
                    ...properties
                }
            }
        })
    }

    boardAppRelaMiletones = (name) => {
        const { dispatch, tasksDetailDatas, } = this.props
        const { properties = [] } = tasksDetailDatas
        const { current_select_milestone_id, current_select_milestone_name, } = this.state

        properties.forEach(item => {
            if (item['code'] === 'MILESTONE') {
                item.data = {
                    id: current_select_milestone_id,
                    name: name,
                };
            }
        })

        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                tasksDetailDatas: {
                    ...tasksDetailDatas,
                    ...properties
                }
            }
        })
    }

    render() {

        const { milestone_list = [] } = this.props
        const { current_select_milestone_id } = this.state

        return (
            <View className={indexStyles.viewStyle}>

                {milestone_list.map((value, key) => {
                    const { board_id, id, milestone_chird = [], name, } = value
                    return (
                        <View key={key}>
                            <View className={indexStyles.milestone_list_row} onClick={() => this.selectMilestone(id, name)}>
                                <View className={indexStyles.milestone_list_style}>
                                    {name}
                                </View>
                                {
                                    current_select_milestone_id == id ? (<View className={indexStyles.cleck_milestone_styles}>
                                        <Text className={`${globalStyle.global_iconfont}`}>&#xe641;</Text>
                                    </View>) : <View></View>
                                }
                            </View>
                            {
                                milestone_chird.map((item, key1) => {

                                    return (
                                        <View key={key1}
                                            className={indexStyles.milestone_chird_row}
                                            onClick={() => this.selectMilestone(item.id, item.name)}
                                        >
                                            <View key={key1} className={indexStyles.milestone_chird_style}>
                                                {item.name}
                                            </View>
                                            {
                                                current_select_milestone_id == item.id ? (<View className={indexStyles.cleck_milestone_chird_styles}>
                                                    <Text className={`${globalStyle.global_iconfont}`}>&#xe641;</Text>
                                                </View>) : <View></View>
                                            }
                                        </View>
                                    )
                                })
                            }
                        </View>
                    )
                })}
            </View>
        )
    }
}

milestoneList.defaultProps = {

};