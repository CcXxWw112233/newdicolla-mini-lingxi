import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../gloalSet/styles/globalStyles.scss'
import { AtTag } from 'taro-ui'
import { connect } from '@tarojs/redux'

@connect(({ tasks: { tasksDetailDatas = {}, properties_list = [], }, }) => ({
    tasksDetailDatas, properties_list
}))
export default class AddFunctionCell extends Component {

    selectFunction = (code) => {

    }

    componentDidMount() {

        const { tasksDetailDatas = {}, properties_list = [], } = this.props
        const { properties = [], } = tasksDetailDatas
        console.log(tasksDetailDatas, 'tasksDetailDatas======', properties_list);
        let new_array = [];

        properties_list.forEach(element => {
            console.log(element, 'element=========');
            for (let index = 0; index < properties.length; index++) {

                if (properties[index]['id'] !== element.forEach) {

                    new_array.push(element);
                }
            }
        });


        console.log(new_array, 'new_array=======', properties);
    }

    render() {

        const { properties_list } = this.props

        return (

            <View className={indexStyles.list_item}>
                {
                    properties_list.map((tag, key) => {

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
