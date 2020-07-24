import Taro, { Component } from '@tarojs/taro'
import { View, Text, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import RelevantPersonnel from './../CommonComponents/RelevantPersonnel/index'
import OtherCell from './../CommonComponents/OtherCell/index'
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

    render() {

        const { recipients, assignees, last_complete_time, forms, description, board_id, status, deadline_time_type, deadline_value, deadline_type, complete_time, } = this.props

        return (
            <View className={indexStyles.viewStyle}>

                <View className={indexStyles.other_cell}>
                    <RelevantPersonnel
                        recipients={recipients}
                        assignees={assignees}
                        last_complete_time={last_complete_time}
                        status={status}
                        deadline_time_type={deadline_time_type}
                        deadline_value={deadline_value}
                        deadline_type={deadline_type}
                        complete_time={complete_time}
                    />
                </View>

                {description ? (<View className={indexStyles.other_cell}>
                    <OtherCell title='备注' description={description} />
                </View>) : (<View></View>)}


                <View className={indexStyles.view_cell}>
                    {forms && forms.map((item, key) => {
                        const { id, value, field_type, files = [], options } = item
                        return (
                            <View key={id}>
                                {field_type === '1' && (
                                    <View>
                                        <View className={indexStyles.other_cell}>
                                            <OtherCell title='文本' description={value} />
                                        </View>
                                    </View>
                                )}
                                {field_type === '2' && (
                                    <View>
                                        <View className={indexStyles.other_cell}>
                                            <Choice title='选择' options={options} />
                                        </View>
                                    </View>
                                )}
                                {field_type === '3' && (
                                    <View className={indexStyles.other_cell}>
                                        <OtherCell title='日期' description={timestampToTimeZH(value)} />
                                    </View>
                                )}
                                {field_type === '5' && (
                                    <View className={indexStyles.other_cell}>
                                        <Enclosure title='附件' files={files} board_id={board_id} />
                                    </View>
                                )}
                                {field_type === '6' && (
                                    <View>
                                        <View className={indexStyles.other_cell}>
                                            <OnlineTable />
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
    complete_time: '', //完成时间
};