import { connect } from '@tarojs/redux'
import Taro, { Component, } from '@tarojs/taro'
import { View, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import { AtTag, AtIcon, } from 'taro-ui'


@connect(({ tasks: { label_list = [], }, }) => ({
    label_list,
}))
export default class LabelSelection extends Component {
    config = {
        navigationBarTitleText: '标签选择',
    }

    state = {
        card_id: '',
    }

    componentDidMount() {

        const { contentId } = this.$router.params

        this.setState({
            card_id: contentId,
        })

    }

    selectlabel = (labelId) => {

        const { dispatch } = this.props
        const { card_id } = this.state

        // dispatch({
        //     type: 'tasks/postCardLabel',
        //     payload: {
        //         label_id: labelId,
        //         card_id: card_id,
        //     },
        // })

        dispatch({
            type: 'tasks/deleteCardLabel',
            payload: {
                label_id: labelId,
                card_id: card_id,
            },
        })

    }


    render() {

        const { label_list = [], } = this.props

        return (
            <View className={indexStyles.index}>
                {label_list && label_list.map((value, key) => {
                    const { id, name, color } = value
                    return (
                        <View key={key} className={indexStyles.rowIndex} onClick={this.selectlabel.bind(this, id)}>
                            <View className={indexStyles.cellIndex}>
                                <AtTag type='primary' customStyle={{
                                    color: `rgba(${color},1)`,
                                    backgroundColor: `rgba(${color},.2)`,
                                    border: `1px solid rgba(${color},1)`,
                                }}>
                                    {name}
                                </AtTag>
                            </View>
                            <AtIcon value='check' size='20' color='#0000FF' className={indexStyles.cleckIndex}></AtIcon>
                        </View>
                    )
                })}
            </View>
        )
    }
}

