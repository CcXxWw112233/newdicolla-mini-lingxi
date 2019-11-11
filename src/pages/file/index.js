import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import file_head_background from '../../asset/file/file_head_background.png'
import { connect } from '@tarojs/redux'
import SearchAndMenu from '../board/components/SearchAndMenu'
import { filterFileFormatType } from '../../../utils/util';


@connect(({ file: { file_list = [], } }) => ({
    file_list,
}))
export default class File extends Component {
    config = {
        navigationBarTitleText: '文件',
        "onReachBottomDistance": 50,  //默认值50
    }
    componentDidMount() {
        const { dispatch } = this.props
        dispatch({
            type: 'file/getFilePage',
            payload: {
                _organization_id: '0',
                board_id: '',
                folder_id: '',
                page_number: '',
                page_size: '',
            },
        })
    }
    componentDidShow() { }

    componentDidHide() { }

    componentWillReceiveProps() { }

    componentWillUnmount() { }

    onReachBottom() {
        const { dispatch } = this.props

        dispatch({
            type: 'file/updateDatas',
            payload: {

            }
        })

    }

    onSelectType = ({ show_type }) => {
        this.setState({
            show_card_type_select: show_type,
            search_mask_show: show_type
        })
    }

    choiceBoard = () => {
        console.log('选择项目');
    }

    goFileDetails = (value) => {
        const { file_id } = value
        const { dispatch } = this.props
        dispatch({
            type: 'file/getFileDetails',
            payload: {
                id: file_id,
            },
        })
    }

    render() {

        const { file_list } = this.props

        return (
            <View className={indexStyles.index}>
                {/* <SearchAndMenu onSelectType={this.onSelectType} search_mask_show={'0'} /> */}

                {/* <View className={indexStyles.head_background}>
                    <Image src={file_head_background} className={indexStyles.image_head_background} />

                    <View className={indexStyles.hear_function}>
                        <View className={indexStyles.folderPath} onClick={this.choiceBoard}>
                            <Text className={`${globalStyle.global_iconfont} ${indexStyles.folder_Path_icon}`}>&#xe6c6;</Text>
                            <View>全部文件</View>
                        </View>
                        <View>相册/相机</View>
                    </View>
                </View> */}

                <View className={indexStyles.grid_style}>
                    {file_list.map((value, key) => {
                        const { thumbnail_url } = value
                        // const fileType = this.distinguishFileType(value.file_name)
                        return (
                            <View className={indexStyles.lattice_style} onClick={this.goFileDetails.bind(this, value)} >
                                {
                                    thumbnail_url ?
                                        (<Image mode='aspectFit' className={indexStyles.img_style} src={thumbnail_url}>
                                        </Image>)
                                        :
                                        (<View>
                                            <Text className={`${globalStyle.global_iconfont} ${indexStyles.folder_Path_icon}`}></Text>
                                            <View>{value.file_name}</View>
                                        </View>)
                                }

                            </View>
                        )
                    })}
                </View>
            </View>
        )
    }
}

