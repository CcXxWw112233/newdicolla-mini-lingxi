
import Taro, { Component } from '@tarojs/taro'
import { View, Text, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../../../gloalSet/styles/globalStyles.scss'
import { getOrgIdByBoardId, setBoardIdStorage, } from '../../../../../../utils/basicFunction'
export default class index extends Component {

    constructor() {
        super(...arguments)
        this.state = {

        }
    }

    goFileDetails = (fileResourceId, fileName, board_id) => {
        const { globalData: { store: { dispatch } } } = Taro.getApp();
        setBoardIdStorage(board_id)
        const fileType = fileName.substr(fileName.lastIndexOf(".")).toLowerCase();
        const parameter = {
            board_id,
            ids: fileResourceId,
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

    render() {

        const { title, files, board_id, } = this.props

        return (
            <View className={indexStyles.viewStyle}>

                <View className={indexStyles.line_cell}>
                    <View className={indexStyles.line_empty}></View>
                    <View className={indexStyles.line}></View>
                </View>

                <View className={indexStyles.content_cell}>
                    <View className={indexStyles.content_padding}>

                        <View className={indexStyles.title}>{title}</View>

                        <View className={indexStyles.enclosure_view}>
                            {files.map((item, key) => {
                                const { flow_file_id, file_resource_id, file_name } = item
                                return (
                                    <View key={flow_file_id} className={indexStyles.enclosure} onClick={this.goFileDetails.bind(this, file_resource_id, file_name, board_id)}>
                                        <View className={indexStyles.enclosure_icon} >
                                            <Text className={`${globalStyle.global_iconfont}`}>&#xe669;</Text>
                                        </View>
                                        <View className={indexStyles.enclosure_name}>{file_name}</View>
                                    </View>
                                )
                            })}
                        </View>

                    </View>

                </View>

            </View>
        )
    }
}

index.defaultProps = {
    title: '', //标题
    files: [], //附件列表
    board_id: '', //项目id
};