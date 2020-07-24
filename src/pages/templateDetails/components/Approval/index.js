import Taro, { Component } from '@tarojs/taro'
import { View, Text, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import RelevantPersonnel from './../CommonComponents/RelevantPersonnel/index'
import OtherCell from './../CommonComponents/OtherCell/index'
import ApprovalMethod from './components/ApprovalMethod/index' //ApprovalMethod/index'
import ApprovalOpinion from './components/ApprovalOpinion/index'
import { loadFindAssignees, } from '../../../../utils/basicFunction';

export default class index extends Component {

    constructor() {
        super(...arguments)
        this.state = {
        }
    }

    render() {
        const { recipients, assignees, last_complete_time, description, approve_type, flow_instance_id, flow_node_instance_id, status, deadline_time_type, deadline_value, deadline_type, his_comments, complete_time, } = this.props
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
                    <ApprovalMethod assignees={assignees} approve_type={approve_type} his_comments={his_comments} />
                </View>

                {
                    ((status && status === '1') && (loadFindAssignees(assignees))) ? (<View className={indexStyles.other_cell}>
                        <ApprovalOpinion flow_instance_id={flow_instance_id} flow_node_instance_id={flow_node_instance_id} />
                    </View>) : (<View></View>)
                }

            </View>
        )
    }
}

index.defaultProps = {
    recipients: [], //填写人array
    name: '', //抄送人array
    last_complete_time: '', //最后完成时间
    description: '', //备注
    flow_instance_id: '', //流程id
    flow_node_instance_id: '', //流程节点id
    status: '', //当前节点进度 0未进行 1进行中 2完成
    assignees: [],//审批人array
    deadline_time_type: '',  //截止时间类型
    deadline_value: '',    //截止时间数
    deadline_type: '', //限制时间类型 0未限制时间 1有限制时间
    his_comments: [], //历史审批
    complete_time: '', //完成时间
};
