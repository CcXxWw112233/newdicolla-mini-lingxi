import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import CustomNavigation from '../acceptInvitation/components/CustomNavigation.js'
import general_error from '../../asset/error/general_error.png'
import indexStyles from './index.scss'

export default class errorPage extends Component {
    config = {
        navigationStyle: 'custom',
    }

    render() {
        return (
            <View>
                <CustomNavigation />
                <View className={indexStyles.contain1}>
                    <Image src={general_error} className={indexStyles.generalErrorStyle} />
                </View>
            </View>
        )
    }
}

