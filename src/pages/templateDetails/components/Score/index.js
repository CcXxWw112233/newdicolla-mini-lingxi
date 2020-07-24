import Taro, { Component } from '@tarojs/taro'
import { View, Text, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import RelevantPersonnel from './../CommonComponents/RelevantPersonnel/index'
import OtherCell from './../CommonComponents/OtherCell/index'
import ScoringItems from './components/ScoringItems/index'

export default class index extends Component {

    constructor() {
        super(...arguments)
        this.state = {
        }
    }

    getScoreItems = (score_items) => {
        //删掉数组的最后一个对象元素
        score_items.length = score_items.length - 1;
        return score_items;
    }

    render() {

        const { recipients, assignees, last_complete_time, description, score_items, status, flow_instance_id, flow_node_instance_id, deadline_time_type, deadline_value, deadline_type, complete_time, } = this.props
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

                <View className={indexStyles.other_cell}>
                    <ScoringItems
                        assignees={assignees}
                        score_items={(status == '2' || status == '1' ? this.getScoreItems(score_items) : score_items)}
                        status={status}
                        flow_instance_id={flow_instance_id}
                        flow_node_instance_id={flow_node_instance_id}
                    />
                </View>

            </View>
        )
    }
}

index.defaultProps = {
    recipients: [], //填写人array
    assignees: [], //抄送人array
    last_complete_time: '', //最后完成时间
    description: '', //备注
    score_items: [], //评分数组   
    status: '', //当前节点进度 0未进行 1进行中 2完成
    flow_instance_id: '', //流程id
    flow_node_instance_id: '', //流程节点id
    deadline_time_type: '',  //截止时间类型
    deadline_value: '',    //截止时间数
    deadline_type: '', //限制时间类型 0未限制时间 1有限制时间
    complete_time: '', //完成时间
};