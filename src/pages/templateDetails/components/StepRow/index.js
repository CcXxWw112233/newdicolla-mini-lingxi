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

        const { isOpenStep } = this.state

        if (isOpenStep == false) {
            this.setState({
                isOpenStep: true
            })
            this.props.onClicked({ isOpenStep: true, currentStepId: value })
        } else {
            this.setState({
                isOpenStep: false
            })
            this.props.onClicked({ isOpenStep: false, currentStepId: value })
        }
    }


    render() {
        const { sort, name, runtime_type, step_id, isOpen, } = this.props
        return (
            <View className={indexStyles.viewStyle} >
                <View className={indexStyles.select_step_number}>
                    {sort ? sort : ''}
                </View>

                <View class={indexStyles.step_name}>
                    {name ? name : ''}
                </View>

                <View className={indexStyles.runtime_type}>
                    {runtime_type == '1' ? '被驳回' : ''}
                </View>

                <View className={indexStyles.open_icon} onClick={() => this.clickOpen(step_id)} >
                    {
                        isOpen ? (
                            <Text className={`${globalStyle.global_iconfont}`}>&#xe675;</Text>
                        ) : (
                                <Text className={`${globalStyle.global_iconfont}`}>&#xe8ec;</Text>
                            )
                    }
                </View>
            </ View>
        )
    }
}

StepRow.defaultProps = {
    sort: '', //排序序号
    name: '', //节点名称
    runtime_type: '', //是否被驳回 , 1 = 是, 0 = 否
    setIsOpen: function () { },   //是否展开详情
    step_id: '', //流程id
    isOpen: '', //是否展开
};
