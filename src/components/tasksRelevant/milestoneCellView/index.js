import Taro, { Component, getStorage, getStorageSync } from '@tarojs/taro'
import { View, Text, Picker, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
@connect(({
    tasks: { milestone_list = [], tasksDetailDatas, },
}) => ({
    milestone_list, tasksDetailDatas,
}))
export default class milestoneCellPicker extends Component {
    state = {
        current_select_milestone_name: '未选择',
    }
    // constructor() {
    // super(...arguments)
    // this.state = {
    // card_id: '',
    // select_milestone_id: '',
    // select_milestone_name: '',
    // current_select_milestone_id: '',  //当前关联选中里程碑id
    // current_select_milestone_name: '',  //当前关联选中里程碑name
    // }
    // }
    // this.setState({
    // card_id: contentId,
    // current_select_milestone_id: milestoneId,
    // })
    componentDidMount() {
        const { contentId, milestoneId,title,currentName } = this.props;
        this.setState({
            card_id: contentId,
            current_select_milestone_name :currentName,
            new_select_milestone_name:currentName
        })
        Taro.setStorageSync('current_select_milestone_id', milestoneId)
    }
    onChange = e => {
        const { contentId, milestoneId, title,dispatch } = this.props;
        const {currentItem,new_select_milestone_name,card_id, current_select_milestone_name} = this.state;
        const {
            dataArray = [],
        } = this.props;
        var current_select_milestone_id = Taro.getStorageSync('current_select_milestone_id')
        if (current_select_milestone_name == new_select_milestone_name) { //删除关联里程碑
            this.cancelSelect()
        }  else  if (current_select_milestone_name && new_select_milestone_name == "") { //删除关联里程碑
            dispatch({
                type: 'tasks/deleteAppRelaMiletones',
                payload: {
                    id: current_select_milestone_id ? current_select_milestone_id : '',
                    rela_id: card_id,
                },
            }).then(res=>{
                this.cancelSelect()
            })
        } 

        else {  //添加关联里程碑
            if (current_select_milestone_id == '' || current_select_milestone_id == 'undefined' || current_select_milestone_id == null) {
                dispatch({
                    type: 'tasks/boardAppRelaMiletones',
                    payload: {
                        id: currentItem['id'],
                        origin_type: '0',
                        rela_id: card_id,
                        callBack: this.boardAppRelaMiletones(currentItem['name']),
                    },
                }).then(res=>{
                    this.cancelSelect()
                })
            } else {
                //先删除, 再关联
                Promise.resolve(
                    dispatch({
                        type: 'tasks/deleteAppRelaMiletones',
                        payload: {
                            id: current_select_milestone_id ? current_select_milestone_id : '',
                            rela_id: card_id,
                        },
                    })
                ).then(res => {
                    Taro.removeStorageSync('current_select_milestone_id')
                    Taro.setStorageSync('current_select_milestone_id', currentItem['id']);
                    if(currentItem['id']) {
                        
                    }
                    dispatch({
                        type: 'tasks/boardAppRelaMiletones',
                        payload: {
                            id: currentItem['id'],
                            origin_type: '0',
                            rela_id: card_id,
                            callBack: this.boardAppRelaMiletones(current_select_milestone_name),
                        },
                    }).then(res=>{
                        this.cancelSelect()
                    })
                })
            }
        }
    }
    deleteAppRelaMiletones = () => {

        const { dispatch, tasksDetailDatas, } = this.props
        const { properties = [] } = tasksDetailDatas

        properties.forEach(item => {
            if (item['code'] === 'MILESTONE') {
                item.data = {};
            }
        })
        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                tasksDetailDatas: {
                    ...tasksDetailDatas,
                    ...properties
                }
            }
        })
    }
    boardAppRelaMiletones = (name) => {
        const { dispatch, tasksDetailDatas, } = this.props
        const { properties = [] } = tasksDetailDatas
        var current_select_milestone_id = Taro.getStorageSync('current_select_milestone_id')

        properties.forEach(item => {
            if (item['code'] === 'MILESTONE') {
                item.data = {
                    id: current_select_milestone_id ? current_select_milestone_id : '',
                    name: name,
                };
            }
        })

        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                tasksDetailDatas: {
                    ...tasksDetailDatas,
                    ...properties
                }
            }
        })

        // Taro.navigateBack({})
    }

     /**
     * 选择
     * @param {*} item 
     */
      selectItem = (item) => {
        const {new_select_milestone_name} = this.state
        if(new_select_milestone_name == item.name) {
            this.setState({
                currentItem:"",
                new_select_milestone_name:''
            })
        } else {
            this.setState({
                currentItem:item,
                new_select_milestone_name:item.name
            })
        }
    }
     /**
     * 确定选择
     */
      confirmSelect () {       
        this.onChange()
      }

       /**
     * 取消选择
     */
    cancelSelect () {
        typeof this.props.onClickAction == "function" &&
        this.props.onClickAction();
    }

    // typeof this.props.clickHandle == "function" &&
    // this.props.clickHandle({ result_value, tag, result_key });
    render() {
        const {
            title,
            dataArray,
            tag,
            editAuth
        } = this.props;
        var rangeKey = 'name';
        // if (tag == 3) {
        // }
        const { new_select_milestone_name} = this.state;

        return (
            <View className={indexStyles.index}> 
                {/* <Picker rangeKey={rangeKey} mode='selector' range={dataArray} disabled={!editAuth} onChange={this.onChange}>
                    <View className={indexStyles.projectNameCellPicker}>
                        {current_select_milestone_name != '未选择' || !title ? current_select_milestone_name : title}

                    </View>
                </Picker> */}
                   <View className={indexStyles.content_view}>
                    <View className={indexStyles.content_topline_view}></View>
                    <View className={indexStyles.content_title_view}>
                       <View className={indexStyles.content_title_left}>
                          <View className={`${globalStyles.global_iconfont} ${indexStyles.iconfont}`}>&#xe6a8;</View>
                          <View className={indexStyles.content_title_text}>{title}</View>
                       </View>
                       <View className={indexStyles.content_confirm} onClick={this.confirmSelect}>确定</View>
                    </View>
                    <ScrollView className={indexStyles.scrollview} scrollY scrollWithAnimation>
                       {
                           dataArray && dataArray.map((item,key)=>{
                               const isSelected = item.name == new_select_milestone_name;
                               return (
                                
                                   <View className={`${indexStyles.content_item}`} onClick={this.selectItem.bind(this,item)}>
                                       <View className={`${indexStyles.content_item_name} ${isSelected ? indexStyles.content_item_selected : ''}`}>{item.name}</View>
                                       {
                                           isSelected ? (
                                            <View className={`${globalStyles.global_iconfont} ${indexStyles.item_iconfont} ${isSelected ? indexStyles.content_item_selected : ''}`}>&#xe844;</View>
                                           ):(
                                            <View className={`${globalStyles.global_iconfont} ${indexStyles.item_iconfont}`}>&#xe6df;</View>
                                           )
                                       }
                                   </View>
                               )
                           })
                       }
                    </ScrollView>
                    <View className={indexStyles.cencel_View} onClick={this.cancelSelect}>取消</View>
                </View>
            </View >
        );
    }

}
milestoneCellPicker.defaultProps = {
    title: "", //显示的信息, 是
    dataArray: [], //Picker的自定义数据源, 是
    tag: "", //标识符, 是
};