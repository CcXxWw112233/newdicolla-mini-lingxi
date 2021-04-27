import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import { AtCheckbox } from 'taro-ui'

@connect(({ tasks: { executors_list = [], tasksDetailDatas = {}, }, }) => ({
    executors_list, tasksDetailDatas,
}))
export default class sonTaskExecutors extends Component {
    // config = {
    //     navigationBarTitleText: '选择执行人'
    // }

    constructor() {
        super(...arguments)
        this.state = {
            checkedList: [],  //已选中数组
            checkboxOption: [],  //全部数组
        }
    }

    componentDidMount() {

        const { contentId, executors = [], } = this.props

        let executorsData;
        let new_arr;
        let newCheckedList = []
        if (executors.length > 0) {
            executorsData = executors;
            //取出已经是执行人的id, 组成新数组(已选中)
            new_arr = executorsData.map(obj => { return obj.user_id });
            newCheckedList = executorsData.map(obj => { return obj.user_id });
        }
        this.setState({
            card_id: contentId,
            // value: listId,
        })

        const { executors_list = [], } = this.props

        executors_list.forEach(item => {
            item['label'] = item.name
            item['value'] = item.id
        })

        this.setState({
            checkboxOption: executors_list,
            checkedList: new_arr,
            newCheckedList:newCheckedList
        })

    }

    componentWillUnmount() {

        // const { checkedList } = this.state
        // var data = JSON.stringify(checkedList)
        // Taro.setStorageSync('son_tasks_executors', data);
    }

    handleChange(value) {

        this.setState({
            checkedList: value
        })


        // var sa = new Set(this.state.checkedList);
        // var sb = new Set(value);

        // const { dispatch } = this.props
        // const { card_id } = this.state

        // if (this.state.checkedList.length > value.length) {  //删减
        //     // 差集
        //     let minus = this.state.checkedList.filter(x => !sb.has(x));
        //     let executor_id = minus[0];

        //     dispatch({
        //         type: 'tasks/deleteCardExecutor',
        //         payload: {
        //             card_id: card_id,
        //             executor: executor_id,
        //             callBack: this.deleteCardExecutor(value),
        //         },
        //     })
        // }
        // else if (this.state.checkedList.length < value.length) {  //增加
        //     //补集
        //     let complement = [...this.state.checkedList.filter(x => !sb.has(x)), ...value.filter(x => !sa.has(x))];
        //     let executor_id = complement[0];

        //     dispatch({
        //         type: 'tasks/addCardExecutor',
        //         payload: {
        //             card_id: card_id,
        //             executor: executor_id,
        //             callBack: this.deleteCardExecutor(value),
        //         },
        //     })
        // }
    }


    //更改本地数据
    // deleteCardExecutor = (value) => {
    //     const { dispatch, tasksDetailDatas, executors_list = [], } = this.props
    //     const { properties = [] } = tasksDetailDatas


    //     let array = [];
    //     for (let i = 0; i < value.length; i++) {

    //         executors_list.forEach(obj => {

    //             if (obj.id === value[i]) {

    //                 array.push(obj);
    //             }
    //         })
    //     }
    //     properties.forEach(item => {
    //         if (item['code'] === 'EXECUTOR') {
    //             item.data = array
    //         }
    //     })

    //     dispatch({
    //         type: 'tasks/updateDatas',
    //         payload: {
    //             tasksDetailDatas: {
    //                 ...tasksDetailDatas,
    //                 ...properties,
    //             }
    //         }
    //     })
    // }

    // onClickAction() {
    //     const { checkedList } = this.state
    //     var data = JSON.stringify(checkedList)
    //     Taro.setStorageSync('son_tasks_executors', data);
    //     typeof this.props.onClickAction == "function" &&
    //         this.props.onClickAction();
    // }

    /**
         * 取消
         */
    onClickAction() {

        typeof this.props.onClickAction == "function" &&
            this.props.onClickAction();
    }
    /**
     * 选择
     * @param {*} item 
     */
    selectItem = item => {
    var {newCheckedList = [],card_id} = this.state;
    const {dispatch} = this.props;
    if(newCheckedList.indexOf(item.user_id) != -1) {
        newCheckedList = newCheckedList.filter((value)=> {
            return item.user_id != value;
        });  
    } else {
        newCheckedList.push(item.user_id)
        }
        this.setState({
            newCheckedList:  newCheckedList,
        })
    }
    /**
     * 重置
     */
    resetAction() {     
        this.setState({
            newCheckedList:  [],
        })
    }
    /**
     * 确定选择
     * @returns 
     */
    confirmSelect () {
        const { newCheckedList } = this.state
        var data = JSON.stringify(newCheckedList)
        Taro.setStorageSync('son_tasks_executors', data);
        typeof this.props.onClickAction == "function" &&
            this.props.onClickAction();
    }

    render() {

        const { checkboxOption = [], newCheckedList} = this.state

        return (

            // <View className={indexStyles.labelSelectionView}>
            //     <View className={indexStyles.index}>
            //         <View className={indexStyles.titleView}>请选择</View>
            //         <ScrollView className={indexStyles.scrollview} scrollY scrollWithAnimation>
            //             <AtCheckbox
            //                 options={checkboxOption}
            //                 selectedList={this.state.checkedList}
            //                 onChange={this.handleChange.bind(this)}
            //             />
            //         </ScrollView>
            //         <View className={indexStyles.bootomBtnView}>
            //             <View onClick={this.onClickAction} className={indexStyles.btnView}>确定</View>
            //         </View>
            //     </View>
            // </View>
            <View className={indexStyles.index}>
            <View className={indexStyles.content_view}>
             <View className={indexStyles.content_topline_view}></View>
             <View className={indexStyles.content_title_view}>
                <View className={indexStyles.content_title_left}>
                   <View className={indexStyles.content_title_text}>{title}</View>
                </View>
                <View className={indexStyles.content_confirm} onClick={this.confirmSelect}>确定</View>
             </View>
             <ScrollView className={indexStyles.scrollview} scrollY scrollWithAnimation>
                <View className={indexStyles.grid_style}>
                        {
                            checkboxOption && checkboxOption.map((item,key)=>{
                                const isSelected = newCheckedList.indexOf(item.user_id) != -1;
                              return (
                                  <View className={indexStyles.lattice_style} key={key} onClick={this.selectItem.bind(this,item)}>  
                                     {
                                         isSelected ? (
                                            <Text className={`${globalStyle.global_iconfont} ${indexStyles.checked_iconfont}`}>&#xe844;</Text>
                                         ):('')
                                     }
                                    {   item.avatar ? (
                                      <Image src={item.avatar} className={indexStyles.content_avatar}></Image>
                                    ) :(
                                      <View className={`${globalStyle.global_iconfont} ${indexStyles.content_avatar}`}>&#xe878;</View>
                                    )}
                                 </View>
                             )
                          })
                        }
                </View>
             </ScrollView>
             <View className={indexStyles.reset_View} onClick={this.resetAction}>重置负责人</View>
             <View className={indexStyles.cencel_View} onClick={this.onClickAction} >取消</View>
         </View>
        </View>
        )
    }
}

sonTaskExecutors.defaultProps = {

};
