import Taro, { Component } from '@tarojs/taro'
import { View, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../gloalSet/styles/globalStyles.scss'
import { AtTag } from 'taro-ui'
// eslint-disable-next-line import/first
import { connect } from '@tarojs/redux'
// import { isApiResponseOk } from "../../../utils/request";

@connect(({ tasks: { tasksDetailDatas = {}, properties_list = [], }, }) => ({
    tasksDetailDatas, properties_list
}))
export default class AddFunctionCell extends Component {

    state = {
        dataArray: [],
    }

    selectFunction = (code) => {

        const { dispatch, tasksDetailDatas, properties_list, } = this.props
        const { properties = [], } = tasksDetailDatas
        const { propertiesList } = this.state

        properties_list.forEach(element => {

            if (element.code == code) {

                properties.push(element)
            }

            // if (element.code != code) {
            //     properties_list.push(element)
            // }

        });


        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                tasksDetailDatas: {
                    ...tasksDetailDatas,
                    ...properties,
                    ...propertiesList,
                }
            }
        })

    }

    componentDidMount() {

        const { properties_list = [], properties = [], } = this.props

        let new_array = [];

        new_array = properties_list.filter(item => {
            const gold_code = (properties.find(n => {
                if (n.code == item.code) {
                    return n
                }
            }) || {}).code
            // console.log(gold_code);
            if (item.code != gold_code) {
                return item
            }
        })

        this.setState({
            dataArray: new_array,
        })
    }

    render() {

        const { dataArray = [] } = this.state

        return (

            <View className={indexStyles.list_item}>
                {
                    dataArray.map((tag, key) => {

                        const { id, code, name, } = tag

                        return (
                            <View key={key}
                                className={indexStyles.tagCell_list_item}
                                onClick={() => this.selectFunction(code)}
                            >
                                <AtTag type='primary'
                                    customStyle={{
                                        color: `rgba(0, 0, 0,1)`,
                                        backgroundColor: `rgba(211, 211, 211,.2)`,
                                        border: `1px solid rgba(169, 169, 169,1)`,
                                    }
                                    }>
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
