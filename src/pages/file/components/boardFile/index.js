import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'

@connect(({ }) => ({}))
export default class BoardFile extends Component {

    componentDidMount() {
        const { dispatch } = this.props
        dispatch({
            type: 'board/v2BoardList',
            payload: {
                _organization_id: '0',
                contain_type: '0',
            },
        })

        this.selectionBoard()
    }

    wholeFile = () => {

    }

    selectionBoard = () => {
        const { dispatch } = this.props
        dispatch({
            type: 'file/getFolder',
            payload: {
                board_id: "1193876784882520064",
            },
        })
    }

    closeBoardList = () => {
        this.props.closeBoardList()
    }

    render() {

        const SystemInfo = Taro.getSystemInfoSync()
        const screen_Height = SystemInfo.screenHeight
        const statusBar_Height = SystemInfo.statusBarHeight
        const navBar_Height = SystemInfo.platform == 'ios' ? 44 : 48

        return (
            <View className={indexStyles.choice_board_file_style} style={{ height: screen_Height - (statusBar_Height + navBar_Height) + 'px', marginTop: statusBar_Height + navBar_Height + 'px' }}>

                <View className={indexStyles.whole_file_style}>
                    <View className={indexStyles.whole_file_hear_style} onClick={this.wholeFile}>
                        <Text className={`${globalStyle.global_iconfont} ${indexStyles.folder_Path_icon}`}>&#xe662;</Text>
                        <View>全部文件</View>
                    </View>
                </View>

                <View className={indexStyles.close_button_style} onClick={this.closeBoardList}>
                    <Text className={`${globalStyle.global_iconfont} ${indexStyles.close_button_icon_style}`}>&#xe7fc;</Text>
                </View>
            </View>
        )
    }
}

BoardFile.defaultProps = {

}
