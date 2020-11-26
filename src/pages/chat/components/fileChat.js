import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './fileChat.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'
import { filterFileFormatType } from './../../../utils/util';
import { connect } from '@tarojs/redux'
import { getOrgIdByBoardId, setBoardIdStorage } from '../../../utils/basicFunction'

@connect(({ }) => ({}))
export default class FileChat extends Component {

    state = {
        commentValue: '', //评论内容
        inputBottonHeight: '0', //输入框弹起高度
    }

    handleInput = e => {
        this.setState({
            commentValue: e.currentTarget.value
        });
    };

    //关闭
    closeFileComment = () => {
        const { dispatch } = this.props
        dispatch({
            type: 'file/updateDatas',
            payload: {
                isShowFileComment: false,
            },
        })
    }

    //发送评论
    sendComment = () => {
        const { dispatch, fileInfo = {} } = this.props
        const { board_id, file_id } = fileInfo
        const { commentValue } = this.state

        dispatch({
            type: 'file/sendFileComment',
            payload: {
                type: '0',
                board_id: board_id,
                file_id: file_id,
                comment: commentValue,
            },
        })

        this.setState({
            commentValue: ''
        });

        this.closeFileComment()
    }

    goFileDetails = (fileInfo) => {
        // Taro.setStorageSync('isReloadFileList', 'is_reload_file_list')

        const { file_resource_id, board_id, file_name, } = fileInfo
        const { dispatch } = this.props
        setBoardIdStorage(board_id)
        const fileType = file_name.substr(file_name.lastIndexOf(".")).toLowerCase();

        const parameter = {
            board_id,
            ids: file_resource_id,
            _organization_id: getOrgIdByBoardId(board_id),
        }

        // 清除缓存文件
        Taro.getSavedFileList({
            success(res) {
                if (res.fileList.length > 0) {
                    Taro.removeSavedFile({
                        filePath: res.fileList[0].filePath,
                        complete(res) {
                            //console.log('清除成功', res)
                        }
                    })
                }
            }
        })

        dispatch({
            type: 'file/getDownloadUrl',
            payload: {
                parameter,
                fileType: fileType,
            },
        })
    }

    //键盘弹起, 获取键盘的高度
    handleBindfocus = (e) => {
        if (e.detail.height) {
            this.setState({
                // inputBottonHeight: e.detail.height
                inputBottonHeight: '250'
            })
        }
    }

    handBindblur = () => {
        this.setState({
            inputBottonHeight: '0'
        })
    }

    render() {

        const { commentValue, inputBottonHeight, } = this.state
        const { fileInfo = {} } = this.props
        const { thumbnail_url, file_name, } = fileInfo

        const fileType = file_name && filterFileFormatType(file_name)

        return (
            <View className={indexStyles.mask} >
                <View
                    className={indexStyles.file_chat_view_style}
                    style={{
                        position: inputBottonHeight === '0' ? 'absolute' : 'fixed',
                        bottom: inputBottonHeight + 'px',
                    }}>
                    <View className={indexStyles.file_chat_view_content_style}>
                        <View className={indexStyles.file_chat_view_hear_style}>
                            <View className={indexStyles.file_info_view_style} >
                                <View onClick={this.goFileDetails.bind(this, fileInfo)}>
                                    {
                                        thumbnail_url ?
                                            (
                                                <Image mode='aspectFill' className={indexStyles.thumbnail_img_style} src={thumbnail_url}>
                                                </Image>
                                            ) : (
                                                <View className={indexStyles.other_icon_style}>
                                                    <RichText className={`${globalStyles.global_iconfont} ${indexStyles.folder_type_icon}`} nodes={fileType} />
                                                </View>)
                                    }
                                </View>
                                <View className={indexStyles.file_chat_view_hear_text_style}>
                                    <View className={indexStyles.file_chat_hear_tips_style}>
                                        <View className={indexStyles.file_chat_view_hear_tips_style}>发送评论到:</View>
                                        <View className={indexStyles.close_button_style} onClick={this.closeFileComment}>
                                            <Text className={`${globalStyles.global_iconfont}`}>&#xe7fc;</Text>
                                        </View>
                                    </View>
                                    <View className={indexStyles.file_name_style}>{file_name}</View>
                                </View>
                            </View>
                        </View>
                        <View className={indexStyles.input_view_style}>
                            <Textarea className={indexStyles.input_comment_style}
                                placeholder='请输入评论'
                                onInput={this.handleInput}
                                value={commentValue}
                                auto-height={false}
                                show-confirm-bar={false}
                                adjust-position={true}
                                onFocus={this.handleBindfocus}
                                onblur={this.handBindblur}
                            />
                        </View>
                        {commentValue && commentValue.trim() ? (
                            <View className={indexStyles.send_file_comment_button_style} onClick={this.sendComment}>发送评论</View>
                        ) : (
                                <View className={indexStyles.prohibit_send_file_comment_button_style}>发送评论</View>
                            )
                        }
                    </View>
                </View>
            </View>
        )
    }
}

FileChat.defaultProps = {

}
