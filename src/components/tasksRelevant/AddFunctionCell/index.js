import Taro, { Component } from '@tarojs/taro'
import { View, } from '@tarojs/components'
import indexStyles from './index.scss'
import { AtTag } from 'taro-ui'
import { connect } from '@tarojs/redux'
import globalStyle from '../../../gloalSet/styles/globalStyles.scss'

@connect(({ tasks: { tasksDetailDatas = {}, properties_list = [], }, }) => ({
    tasksDetailDatas, properties_list
}))
export default class AddFunctionCell extends Component {

    state = {
        dataArray: [],
    }

    selectFunction = (code, id) => {
        if(code == '' && id == '') {
            Taro.navigateTo({
                url: `/pages/fieldSelection/index`,
            });
            return
        }
        const { dispatch, tasksDetailDatas, editAuth } = this.props
        const { card_id } = tasksDetailDatas
        if (!editAuth) {
            Taro.showToast({
                title: '您没有该项目的编辑权限',
                icon: 'none',
                duration: 2000
            })
            return;
        }

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
        new_array.push(
            {
                code: "",
                id: "",
                name: "更多"
            }
        )
        this.setState({
            dataArray: new_array,
        })
    }

    componentWillReceiveProps() {

        this.overwriteData()
    }
    /**
     * 更多字段
     * @param {*} e 
     */
    goMoreCustomField = e => {
        Taro.navigateTo({
            url: `/pages/fieldSelection/index`,
        });
    }

    iconFont = code => {
        if(code == 'EXECUTOR') {
            return '&#xe877;'
        } else if(code == 'MILESTONE') {
            return '&#xe850;'
        } else if(code == 'REMARK') {
            return '&#xe86c;'
        } else if (code == 'LABEL') {
            return '&#xe86d;'
        } else {
            return '&#xe7f4;'
        }
    }
    render() {

        const { dataArray = [] } = this.state
        console.log(dataArray)
        return (
            <View className={indexStyles.index}>
            <View className={indexStyles.index_title}>添加字段</View>
            <View className={indexStyles.list_View}>
                {
                  dataArray && dataArray.map((item,key) => {
                    const { id, code, name, } = item
                   return (
                    <View key={key} className={indexStyles.list_item_View} onClick={() => this.selectFunction(code, id)}>
                        <RichText className={`${globalStyle.global_iconfont} ${indexStyles.list_item_icon}`} nodes={this.iconFont(code)}></RichText>
                        <Text className={indexStyles.list_item_title}>{item.name}</Text>
                    </View>
                   )
                  })
                }
            </View>
        </View>
            // <View className={indexStyles.list_item}>
            //     {
            //         dataArray.length > 0 && dataArray.map((tag, key) => {

            //             const { id, code, name, } = tag

            //             return (
            //                 <View key={key}
            //                     className={indexStyles.tagCell_list_item}
            //                     onClick={() => this.selectFunction(code, id)}
            //                 >
            //                     <AtTag type='primary'
            //                         customStyle={{
            //                             color: `rgba(0, 0, 0,1)`,
            //                             backgroundColor: `rgba(211, 211, 211,.2)`,
            //                             border: `1px solid rgba(169, 169, 169,1)`,
            //                         }}>
            //                         {name}
            //                     </AtTag>
            //                 </View>
            //             )
            //         })
            //     }
            // </View>

        )
    }
}
