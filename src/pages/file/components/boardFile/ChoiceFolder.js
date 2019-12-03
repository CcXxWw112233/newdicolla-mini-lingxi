
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './ChoiceFolder.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'

@connect(({ file: { isShowChoiceFolder } }) => ({ isShowChoiceFolder }))
export default class ChoiceFolder extends Component {

    handleCancel = () => {
        const { dispatch } = this.props
        dispatch({
            type: 'file/updateDatas',
            payload: {
                isShowChoiceFolder: false,
            },
        })
    }

    handleConfirm = () => {
        this.props.fileUpload()
    }

    choiceFolder = () => {

    }


    render() {
        const { isShowChoiceFolder, choiceImageThumbnail } = this.props

        return (

            <View className={indexStyles.choice_folder_modal_mask} >
                <View className={indexStyles.choice_folder_modal_view_style}>

                    <View className={indexStyles.modal_content_style}>

                        {/* <View className={indexStyles.modal_content_top_style}>
                            <View className={indexStyles.modal_tips_text_style}>上传到:</View>
                        </View>

                        <View className={indexStyles.modal_content_center_style}>
                            <View className={indexStyles.choice_folder_button_style} onClick={this.choiceFolder}>选择文件夹</View>
                            <View className={indexStyles.thumbnail_view_style}>
                                <Image mode='aspectFill' className={indexStyles.choice_image_thumbnail_style} src={choiceImageThumbnail}></Image>
                            </View>

                        </View> */}

                    </View>

                    <View className={indexStyles.modal_botton_style}>
                        <View className={indexStyles.cancel_button_style} onClick={this.handleCancel}>取消</View>
                        <View className={indexStyles.confirm_button_style} onClick={this.handleConfirm}>上传</View>
                    </View>

                </View>

            </View>
        )
    }
}

ChoiceFolder.defaultProps = {
    choiceImageThumbnail: '',  //从相册中选中图片传过来当做略缩图
}
