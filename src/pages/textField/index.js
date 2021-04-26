import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import index from '../taksDetails/components/CommentBox'

@connect(({
    tasks: { tasksDetailDatas, },
}) => ({
    tasksDetailDatas,
}))
export default class textField extends Component {
    // config = {
    //     navigationBarTitleText: '填写字段信息'
    // }

    // constructor() {
    //     super(...arguments)
    //     this.state = {

    //         current_id: '', //当前字段id
    //         type: '', //输入类型 'text', 'number'
    //     }
    // }

    componentDidMount() {
        const { item_id, type, } = this.props

        this.setState({
            current_id: item_id,
            type: type,
        })
    }

    updataContent = (value) => {

        const { dispatch } = this.props
        const { current_id } = this.state

        const valueText = value['detail']["value"]

        dispatch({
            type: 'tasks/putBoardFieldRelation',
            payload: {
                id: current_id,
                field_value: valueText,
                calback: this.putBoardFieldRelation(valueText),
            }
        })
    }

    putBoardFieldRelation = (valueText) => {

        const { dispatch, tasksDetailDatas, } = this.props
        const { fields = [] } = tasksDetailDatas
        const { current_id } = this.state

        fields.forEach(item => {

            if (item.id === current_id) {
                item.field_value = valueText
            }
        })

        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                tasksDetailDatas: {
                    ...tasksDetailDatas,
                    ...fields,
                }
            }
        })
    }

    render() {

        const { field_value, type, editAuth } = this.props

        return (
            // <View className={indexStyles.viewStyle}>

            <View className={indexStyles.contentStyles}>


                {/* {type === 'number' ?
                        (<View className={`${indexStyles.list_item_left_iconnext}`}>
                            <Text className={`${globalStyle.global_iconfont}`}>&#xe7c0;</Text>
                        </View>)
                        :
                        (<View className={`${indexStyles.list_item_left_iconnext}`}>
                            <Text className={`${globalStyle.global_iconfont}`}>&#xe7c1;</Text>
                        </View>)
                    } */}

                {/* <View className={indexStyles.list_item_name}>{type === 'number' ? '填写字段' : '文本字段'}</View> */}

                <Input
                    className={indexStyles.list_item_detail}
                    placeholder='填写自定义字段'
                    placeholderStyle='color:#BCC2D6'
                    value={field_value}
                    type={type == '8' ? 'number' : 'text'}
                    confirmType='完成'
                    onBlur={this.updataContent.bind(this,)}
                    type={type}
                    disabled={!editAuth}
                ></Input>


                {/* <View className={`${indexStyles.list_item_iconnext}`}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe7fc;</Text>
                    </View> */}

            </View>

            // </View>
        )
    }
}

textField.defaultProps = {

};