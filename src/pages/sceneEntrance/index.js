import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

export default class sceneEntrance extends Component {

    componentDidMount() { }

    componentWillReceiveProps() { }

    componentWillUnmount() { }

    componentDidShow() {
        const options = this.$router.params
        this.sceneEntrancePages(options)
    }

    componentDidHide() { }

    sceneEntrancePages(options) {

        if (options.redirectType === '1') {
            Taro.redirectTo({
                url: `../../pages/taksDetails/index?contentId=${options.contentId}&&boardId=${options.boardId}`
            })
        } else {

        }
    }
}

