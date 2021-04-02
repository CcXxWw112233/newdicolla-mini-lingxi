import Taro, { Component, getStorage, getStorageSync } from '@tarojs/taro'
import { View, Text, Picker, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
@connect(({
    tasks: { milestone_list = [], tasksDetailDatas, },
}) => ({
    milestone_list, tasksDetailDatas,
}))
export default class milestoneCellPicker extends Component {
    state = {
        current_select_milestone_name: '未选择',
    }
    // constructor() {
    // super(...arguments)
    // this.state = {
    // card_id: '',
    // select_milestone_id: '',
    // select_milestone_name: '',
    // current_select_milestone_id: '',  //当前关联选中里程碑id
    // current_select_milestone_name: '',  //当前关联选中里程碑name
    // }
    // }
    // this.setState({
    // card_id: contentId,
    // current_select_milestone_id: milestoneId,
    // })
    componentDidMount() {
        const { contentId, milestoneId } = this.props;
        this.setState({
            card_id: contentId,
        })
        Taro.setStorageSync('current_select_milestone_id', milestoneId)
    }
    onChange = e => {
        const { contentId, milestoneId, title } = this.props;

        const {
            dataArray = [],
        } = this.props;
        var current_select_milestone_id = Taro.getStorageSync('current_select_milestone_id')
        const { dispatch } = this.props
        const { card_id, current_select_milestone_name } = this.state
        if (current_select_milestone_id == dataArray[e.detail.value]['id']) { //删除关联里程碑
            // this.setState({
            // current_select_milestone_id: '',
            // current_select_milestone_name: '',
            // })

            // dispatch({
            // type: 'tasks/deleteAppRelaMiletones',
            // payload: {
            // id: select_milestone_id,
            // rela_id: card_id,
            // callBack: this.deleteAppRelaMiletones(),
            // },
            // })
        }
        else {  //添加关联里程碑
            if (current_select_milestone_id == '' || current_select_milestone_id == 'undefined' || current_select_milestone_id == null) {

                dispatch({
                    type: 'tasks/boardAppRelaMiletones',
                    payload: {
                        id: dataArray[e.detail.value]['id'],
                        origin_type: '0',
                        rela_id: card_id,
                        callBack: this.boardAppRelaMiletones(dataArray[e.detail.value]['name']),
                    },
                })
            } else {

                //先删除, 再关联
                Promise.resolve(
                    dispatch({
                        type: 'tasks/deleteAppRelaMiletones',
                        payload: {
                            id: current_select_milestone_id ? current_select_milestone_id : '',
                            rela_id: card_id,
                        },
                    })
                ).then(res => {
                    Taro.removeStorageSync('current_select_milestone_id')

                    // this.setState({
                    // current_select_milestone_id: dataArray[e.detail.value]['id'],
                    // current_select_milestone_name: select_milestone_name,
                    // })
                    Taro.setStorageSync('current_select_milestone_id', dataArray[e.detail.value]['id']);
                    dispatch({
                        type: 'tasks/boardAppRelaMiletones',
                        payload: {
                            id: dataArray[e.detail.value]['id'],
                            origin_type: '0',
                            rela_id: card_id,
                            callBack: this.boardAppRelaMiletones(current_select_milestone_name),
                        },
                    })
                })

                this.setState({
                    // current_select_milestone_id: dataArray[e.detail.value]['id'],
                    current_select_milestone_name: dataArray[e.detail.value]['name'],
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
        var current_select_milestone_id = Taro.getStorageSync('current_select_milestone_id')

        properties.forEach(item => {
            if (item['code'] === 'MILESTONE') {
                item.data = {
                    id: current_select_milestone_id ? current_select_milestone_id : '',
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

        // Taro.navigateBack({})
    }


    // typeof this.props.clickHandle == "function" &&
    // this.props.clickHandle({ result_value, tag, result_key });
    render() {
        const {
            title,
            dataArray,
            tag,
            editAuth
        } = this.props;
        var rangeKey = 'name';
        // if (tag == 3) {
        // }
        const { current_select_milestone_name } = this.state;
        return (
            <View>
                <Picker rangeKey={rangeKey} mode='selector' range={dataArray} disabled={!editAuth} onChange={this.onChange}>
                    <View className={indexStyles.projectNameCellPicker}>
                        {current_select_milestone_name != '未选择' || !title ? current_select_milestone_name : title}

                    </View>
                </Picker>
            </View >
        );
    }

}
milestoneCellPicker.defaultProps = {
    title: "", //显示的信息, 是
    dataArray: [], //Picker的自定义数据源, 是
    tag: "", //标识符, 是
};