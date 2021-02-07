import Taro, { Component } from '@tarojs/taro'
import { View, Text, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import RelevantPersonnel from './../CommonComponents/RelevantPersonnel/index'
import OtherCell from './../CommonComponents/OtherCell/index'
import DateCell from './../CommonComponents/DateCell/index'
import Choice from './components/Choice/index'
import Enclosure from './components/Enclosure/index'
import OnlineTable from './components/OnlineTable/index'
import { timestampToTimeZH } from '../../../../utils/basicFunction'

export default class index extends Component {

    constructor() {
        super(...arguments)
        this.state = {
        }
    }

    componentDidMount() {
        const { status } = this.props;
        if (status == '1') {
            Taro.showToast({
                title: '小程序暂不支持编辑,请前往PC端操作',
                icon: 'none',
                duration: 1000
            })

        }
    }
    render() {

        const { recipients, assignees, last_complete_time, forms, description, board_id, status, deadline_time_type, deadline_value, deadline_type, cc_type } = this.props
        return (
            <View className={indexStyles.viewStyle}>

                <View className={indexStyles.other_cell}>
                    <RelevantPersonnel recipients={recipients} assignees={assignees} last_complete_time={last_complete_time} status={status} deadline_time_type={deadline_time_type} deadline_value={deadline_value} deadline_type={deadline_type} />
                </View>

                {description ? (<View className={indexStyles.other_cell}>
                    <OtherCell title='备注' description={description} />
                </View>) : (<View></View>)}


                <View className={indexStyles.view_cell}>
                    {forms && forms.map((item, key) => {
                        const { id, value, field_type, files = [], options, title, prompt_content } = item
                        return (
                            <View key={id}>
                                {field_type === '1' && (
                                    <View>
                                        <View className={indexStyles.other_cell}>
                                            <OtherCell title={title} description={value} item={item} status={status} field_type={field_type} />
                                        </View>
                                    </View>
                                )}
                                {field_type === '2' && (
                                    <View>
                                        <View className={indexStyles.other_cell}>
                                            <Choice title={title} options={options} prompt_content={prompt_content} value={value} status={status} item={item} />
                                        </View>
                                    </View>
                                )}
                                {field_type === '3' && (
                                    <View className={indexStyles.other_cell}>
                                        <DateCell title={title} description={timestampToTimeZH(value)} item={item} status={status} value={value} field_type={field_type} />
                                    </View>
                                )}
                                {field_type === '5' && (
                                    <View className={indexStyles.other_cell}>
                                        <Enclosure title={title} files={files} item={item} board_id={board_id} status={status} />
                                    </View>
                                )}
                                {field_type === '6' && (
                                    <View>
                                        <View className={indexStyles.other_cell}>
                                            <OnlineTable item={item} />
                                        </View>
                                    </View>
                                )}
                            </View>
                        )
                    })}
                </View>
            </View>
        )
    }
}

index.defaultProps = {
    recipients: '', //填写人array
    name: '', //抄送人array
    last_complete_time: '', //最后完成时间
    forms: '', //资料收集类型
    description: '', //备注
    board_id: '', //项目id
    status: '', //当前节点进度 0未进行 1进行中 2完成
    deadline_time_type: '',  //截止时间类型
    deadline_value: '',    //截止时间数
    deadline_type: '', //限制时间类型 0未限制时间 1有限制时间
};