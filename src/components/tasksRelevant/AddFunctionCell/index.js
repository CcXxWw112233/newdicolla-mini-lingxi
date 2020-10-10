import Taro, { Component } from '@tarojs/taro'
import { View, } from '@tarojs/components'
import indexStyles from './index.scss'
import { AtTag } from 'taro-ui'
import { connect } from '@tarojs/redux'

@connect(({ tasks: { tasksDetailDatas = {}, properties_list = [], }, }) => ({
    tasksDetailDatas, properties_list
}))
export default class AddFunctionCell extends Component {

    state = {
        dataArray: [],
    }

    selectFunction = (code, id) => {

        const { dispatch, tasksDetailDatas, } = this.props
        const { card_id } = tasksDetailDatas

        dispatch({
            type: 'tasks/postCardProperty',
            payload: {
                card_id: card_id,
                property_id: id,
                callBack: this.postCardProperty(code)
            }
        })
    }

    postCardProperty = (code) => {

        const { dispatch, tasksDetailDatas, properties_list, } = this.props
        const { properties = [], } = tasksDetailDatas
        properties_list.forEach(element => {

            if (element.code == code) {
                properties.push(element)
            }
        });

        const that = this
        Promise.resolve(
            dispatch({
                type: 'tasks/updateDatas',
                payload: {
                    tasksDetailDatas: {
                        ...tasksDetailDatas,
                        properties: [...properties],
                    }
                }
            })
        ).then(res => {

            that.overwriteData()
        })
    }

    componentDidMount() {

        this.overwriteData()
    }

    overwriteData = () => {

        const { properties_list = [], tasksDetailDatas, } = this.props
        const { properties = [], } = tasksDetailDatas
        let new_array = [];
        new_array = properties_list.filter(item => {
            const gold_code = (properties.find(n => {
                if (n.code == item.code) {
                    return n
                }
            }) || {}).code

            if (item.code != gold_code) {
                return item
            }
        })
        this.setState({
            dataArray: new_array,
        })
    }

    componentWillReceiveProps() {

        this.overwriteData()
    }

    render() {

        const { dataArray = [] } = this.state

        return (

            <View className={indexStyles.list_item}>
                {
                    dataArray.length > 0 && dataArray.map((tag, key) => {

                        const { id, code, name, } = tag

                        return (
                            <View key={key}
                                className={indexStyles.tagCell_list_item}
                                onClick={() => this.selectFunction(code, id)}
                            >
                                <AtTag type='primary'
                                    customStyle={{
                                        color: `rgba(0, 0, 0,1)`,
                                        backgroundColor: `rgba(211, 211, 211,.2)`,
                                        border: `1px solid rgba(169, 169, 169,1)`,
                                    }}>
                                    {name}
                                </AtTag>
                            </View>
                        )
                    })
                }
            </View>

        )
    }
}
