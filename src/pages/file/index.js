import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, RichText } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import file_head_background from '../../asset/file/file_head_background.png'
import { connect } from '@tarojs/redux'
import SearchAndMenu from '../board/components/SearchAndMenu'
import { filterFileFormatType } from './../../utils/util';
import file_list_empty from '../../asset/file/file_list_empty.png'


@connect(({ file: { file_list = [], } }) => ({
    file_list,
}))
export default class File extends Component {
    config = {
        navigationBarTitleText: '文件',
        "onReachBottomDistance": 50,  //默认值50
    }
    componentDidMount() { }

    componentDidShow() {
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
        const { file_id, board_id } = value
        const { dispatch } = this.props
        dispatch({
            type: 'file/getFileDetails',
            payload: {
                id: file_id,
                board_id: board_id,
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

                {
                    file_list.length !== 0 ? (<View className={indexStyles.grid_style}>
                        {file_list.map((value, key) => {
                            const { thumbnail_url } = value
                            const fileType = filterFileFormatType(value.file_name)
                            return (
                                <View className={indexStyles.lattice_style} onClick={this.goFileDetails.bind(this, value)} >
                                    {
                                        thumbnail_url ?
                                            (<Image mode='aspectFill' className={indexStyles.img_style} src={thumbnail_url}>
                                            </Image>)
                                            :
                                            (<View className={indexStyles.other_icon_style}>
                                                <RichText className={`${globalStyle.global_iconfont} ${indexStyles.folder_type_icon}`} nodes={fileType} />
                                                <View className={indexStyles.other_name_style}>{value.file_name}</View>
                                            </View>)
                                    }

                                </View>
                            )
                        })}
                    </View>
                    ) : (
                            <View className={indexStyles.contain1}>
                                <Image src={file_list_empty} className={indexStyles.file_list_empty} />
                            </View>
                        )
                }

            </View>
        )
    }
}

