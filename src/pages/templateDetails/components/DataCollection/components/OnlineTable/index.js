
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../../../gloalSet/styles/globalStyles.scss'
import Table from '../../../../../../asset/meeting/table.png'


export default class index extends Component {

    constructor() {
        super(...arguments)
        this.state = {

        }
    }

    componentDidMount() {

    }
    onLineTableAction() {
        const { item } = this.props;

        Taro.navigateTo({
            url: '/pages/OnlineTableWebView/index?id=' + item.online_excel_id
        })
    }
    render() {
        const { item } = this.props;
        console.log(item);

        return (
            <View className={indexStyles.viewStyle}>

                <View className={indexStyles.line_cell}>
                    <View className={indexStyles.line_empty}></View>
                    <View className={indexStyles.line}></View>
                </View>

                <View className={indexStyles.content_cell}>
                    <View className={indexStyles.content_title}>
                        <Image src={Table} className={indexStyles.icon}></Image>
                        <View className={indexStyles.titleCenter}>
                            <View className={indexStyles.title} >表格</View>
                        </View>
                    </View>
                    <View className={indexStyles.onineTable} onClick={this.onLineTableAction}>查看</View>
                    {/* <View className={indexStyles.time}>
                        完成期限:
                        </View> */}

                </View>

            </View>
        )
    }
}
