import Taro, { Component } from '@tarojs/taro'
import { View, Text, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'

export default class StepRow extends Component {

    constructor(props) {
        super(props)
    }
    state = {
        isOpenStep: false,
    }

    clickOpen = (value) => {
        const { current_step_id, step_id } = this.props;
        const { isOpenStep } = this.state

        if (isOpenStep == false) {
            this.setState({
                isOpenStep: true,
                currentStepId: value
            })
            this.props.onClicked({ isOpenStep: true, currentStepId: value })
        } else {
            if (current_step_id == step_id) {
                value = ''
                this.setState({
                    isOpenStep: false,
                    currentStepId: ''
                })
            } else {
                this.setState({
                    isOpenStep: false,
                    currentStepId: value
                })
            }

            this.props.onClicked({ isOpenStep: false, currentStepId: value })
        }
    }
    componentDidMount() {
        const { step_id, current_step_id, is_change_open } = this.props;
        if (step_id == current_step_id && is_change_open) {
            this.setState({
                isOpenStep: is_change_open,
                currentStepId: step_id
            })
        }
    }

    render() {
        const { sort, name, runtime_type, status, step_id, current_step_id, is_change_open } = this.props;
        const { currentStepId } = this.state;
        return (
            <View className={indexStyles.viewStyle} onClick={() => this.clickOpen(step_id)}>
                <View className={`${indexStyles.select_step_number} ${status == '1' ? indexStyles.currentStep : ''}`}>
                    {sort ? sort : ''}
                </View>

                <View class={indexStyles.step_name}>
                    {name ? name : ''}
                </View>

                <View className={indexStyles.runtime_type}>
                    {runtime_type == '1' ? '驳回' : ''}
                </View>

                <View className={indexStyles.open_icon}  >
                    {
                        is_change_open && currentStepId && currentStepId == current_step_id ? (
                            <Text className={`${globalStyle.global_iconfont}`}>&#xe675;</Text>
                        ) : (
                                <Text className={`${globalStyle.global_iconfont}`}>&#xe8ec;</Text>
                            )
                    }
                </View>
            </View>
        )
    }
}

StepRow.defaultProps = {
    sort: '', //排序序号
    name: '', //节点名称
    runtime_type: '', //是否被驳回 , 1 = 是, 0 = 否
    setIsOpen: function () { },   //是否展开详情
    step_id: '', //流程id
};
