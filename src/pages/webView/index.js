import Taro, { Component } from '@tarojs/taro'

export default class WebView extends Component {

    render() {

        /***
         * file_url_address 文件地址
         * 通过路由传过来的话, 会自动截取导致链接不完整, 所以通过 Storage 获取
         */
        const file_url_address = Taro.getStorageSync('file_url_address')

        return (
            <web-view src={file_url_address}></web-view>
        )
    }
}

