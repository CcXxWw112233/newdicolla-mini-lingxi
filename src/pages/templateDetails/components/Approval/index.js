import Taro, { Component } from '@tarojs/taro'
import { View, Text, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import RelevantPersonnel from './../CommonComponents/RelevantPersonnel/index'
import OtherCell from './../CommonComponents/OtherCell/index'
import ApprovalMethod from './components/ApprovalMethod/index'
import ApprovalOpinion from './components/ApprovalOpinion/index'

export default class index extends Component {

    constructor() {
        super(...arguments)
        this.state = {
        }
    }

    loadFindAssignees = (assignees = []) => {
        const account_info_string = Taro.getStorageSync('account_info')
        const account_info = JSON.parse(account_info_string)
        const { id } = account_info
        //判断当前等登录用户 在不在审批人assignees当中
        //不在就返回false
        //在当中根据processed状态为1,返回true,不在为返回false
        var currntAssignees = assignees.find(item => item.id == id);
        if (currntAssignees) {
            const { processed } = currntAssignees
            if (processed == '1') {
                return true
            } else {
                return false
            }
        }
        else {
            return false;
        }
    }

    render() {

        const { recipients, assignees, last_complete_time, description, approve_type, flow_instance_id, flow_node_instance_id, status, } = this.props
        return (
            <View className={indexStyles.viewStyle}>

                <View className={indexStyles.other_cell}>
                    <RelevantPersonnel recipients={recipients} assignees={assignees} last_complete_time={last_complete_time} />
                </View>

                {description ? (<View className={indexStyles.other_cell}>
                    <OtherCell title='备注' description={description} />
                </View>) : (<View></View>)}

                <View className={indexStyles.other_cell}>
                    <ApprovalMethod assignees={assignees} approve_type={approve_type} />
                </View>

                {
                    ((status && status === '1') && (this.loadFindAssignees(assignees))) ? (<View className={indexStyles.other_cell}>
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
};
