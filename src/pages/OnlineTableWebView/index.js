import Taro, { Component } from '@tarojs/taro'
import { View, WebView } from '@tarojs/components'
import WebViewRN from './rn'
import './index.scss'
import { BASE_URL, REQUEST_PREFIX } from '../../gloalSet/js/constant'

export default class idnex extends Component {

    state = {
        url: ''
    }
    componentWillMount() {
    }
    componentDidMount() {
        const { id } = this.$router.params;
        const toekn = Taro.getStorageSync("access_token");
        console.log(id, toekn)
        this.setState({
            url: `${BASE_URL}/#/anyPublicPages/previewTable/` + id + `?token=` + toekn
        })

    }
    render() {
        const { url } = this.state;
        console.log(url)
        return (
            <View className='webview'>
                <WebView src={url} />
            </View>)
    }
}