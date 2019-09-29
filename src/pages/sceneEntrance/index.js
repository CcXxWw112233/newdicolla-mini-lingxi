import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

export default class sceneEntrance extends Component {

    componentDidMount() {
        const options = this.$router.params
        this.sceneEntrancePages(options)
    }

    componentWillReceiveProps() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    sceneEntrancePages(options) {
        if (options.redirectType === '1' || options.redirectType === 1) {
            Taro.redirectTo({
                url: `../../pages/taksDetails/index?contentId=${options.contentId}&&boardId=${options.boardId}`
            })
        } else {

        }
    }
}

