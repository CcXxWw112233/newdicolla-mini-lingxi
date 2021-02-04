import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../../../gloalSet/styles/globalStyles.scss'
export default class index extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            selectContent: ""
        }
    }

    startSelect() {
        const { status } = this.props;
        if (status == 1) {
            Taro.showToast({
                title: '不可更改',
                icon: 'none',
                duration: 1000
            })
        }
    }

    componentDidMount() {
        const { options, value } = this.props
        if (value) {
            options.map(item => {
                if (value == item.id) {
                    this.setState({
                        selectContent: item.label_name
                    })
                }
            })
        }
    }
    onChange(e) {
        const { options, status } = this.props;
        // console.log(item.label_name);
        this.setState({
            selectContent: options[e.detail.value].label_name,
        })
    }

    onClickAction() {
        const { status } = this.props;
        if (status == '1') {
            Taro.showToast({
                title: '小程序暂不支持编辑,请前往PC端操作',
                icon: 'none',
                duration: 2000
            })
        }
    }
    render() {
        const { title, options, prompt_content, status, value } = this.props
        const { selectContent } = this.state;


        return (
            <View className={indexStyles.viewStyle} onClick={this.onClickAction}>

                <View className={indexStyles.line_cell}>
                    <View className={indexStyles.line_empty}></View>
                    <View className={indexStyles.line}></View>
                </View>

                <View className={indexStyles.content_cell}>
                    <View className={indexStyles.content_padding}>

                        <View className={indexStyles.title}>{title}</View>
                        <View className={indexStyles.choice_view}>

                            {/* {isShowlistView ? (<View className={indexStyles.choice_itemList}> */}
                            {/* {options && options.map((item, key) => { */}
                            {/* const { flow_file_id, label_name } = item */}
                            {/* return ( */}
                            {/* <View key={flow_file_id} className={indexStyles.choice_name} onClick={() => this.selectItem(item)}> */}
                            {/* {label_name} */}
                            {/* </View> */}
                            {/* ) */}
                            {/* })} */}
                            {/* </View>) : (null)} */}

                            {/* 单选把下面注释的代码取消注释 */}

                            {/* <View> */}
                            {/* { */}
                            {/* status == 1 ? (<Picker mode='selector' range={options} rangeKey="label_name" */}
                            {/* onChange={this.onChange}> */}
                            {/* <View className={indexStyles.choice_name} > */}
                            {/* <Text>{selectContent ? selectContent : prompt_content}</Text> */}
                            {/* <Text className={`${globalStyle.global_iconfont}`}>&#xe8ec; */}
                            {/* </Text> */}
                            {/* </View> */}
                            {/* </Picker>) : (*/}
                            <View className={indexStyles.choice_name} onClick={this.startSelect} >
                                <Text>{selectContent}
                                </Text>
                                <Text className={`${globalStyle.global_iconfont}`}>&#xe8ec;</Text>
                            </View>
                            {/* ) */}
                            {/* } */}
                            {/* </View> */}
                        </View>

                    </View>

                </View>

            </View >
        )
    }
}

index.defaultProps = {
    title: '', //标题
    options: [], //选项列表
};
